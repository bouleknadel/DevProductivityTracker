"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const http = __importStar(require("http"));
const url = __importStar(require("url"));
const sync_request_1 = __importDefault(require("sync-request"));
const INTERRUPTION_THRESHOLD = 60 * 1000; // 1 minute en millisecondes
let focusLostTime = null;
let totalFocusLostTime = 0; // en millisecondes
let focusLostInterval = null;
let currentSessionActive = false;
let currentSessionId = null;
let lineTracking = {
    lastCount: 0,
    totalLines: 0, // Nouveau compteur cumulatif
    timeout: null
};
let cumulativeInterruptions = 0; // Ajoutez ceci avec les autres variables globales
// Ajout d'un compteur cumulatif pour les erreurs
let cumulativeErrors = 0;
function activate(context) {
    console.log('Extension "devproductivitytracker" is now active!');
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        lineTracking.lastCount = editor.document.lineCount;
    }
    // Add this event listener to detect when VSCode is closing
    context.subscriptions.push(vscode.window.onDidChangeWindowState(async (windowState) => {
        const token = context.globalState.get('accessToken');
        if (!windowState.focused) {
            // VS Code a perdu le focus
            console.log('VSCode window lost focus');
            focusLostTime = new Date();
            // Démarrer un intervalle pour mettre à jour l'affichage
            focusLostInterval = setInterval(() => {
                if (focusLostTime) {
                    const secondsLost = Math.floor((new Date().getTime() - focusLostTime.getTime()) / 1000);
                    vscode.window.setStatusBarMessage(`Focus lost: ${secondsLost.toFixed(0)}s`, 1000);
                }
            }, 1000);
        }
        else {
            // VS Code a retrouvé le focus
            if (focusLostTime) {
                const focusLostDuration = new Date().getTime() - focusLostTime.getTime();
                totalFocusLostTime += focusLostDuration;
                // Vérifier si l'interruption dépasse le seuil
                if (focusLostDuration > INTERRUPTION_THRESHOLD && currentSessionActive && token) {
                    try {
                        cumulativeInterruptions += 1; // Incrémenter le compteur local
                        // Mettre à jour la session avec le nouveau total
                        await updateCurrentSession(context, {
                            interruptions: cumulativeInterruptions
                        });
                        console.log('Interruption enregistrée (durée > 1 minute)');
                    }
                    catch (error) {
                        console.error('Erreur lors de la mise à jour des interruptions:', error);
                    }
                }
                // Afficher un message à l'utilisateur
                const minutesLost = (focusLostDuration / 60000).toFixed(1);
                vscode.window.showInformationMessage(`Vous avez été absent pendant ${minutesLost} minutes`);
                // Nettoyer l'intervalle
                if (focusLostInterval) {
                    clearInterval(focusLostInterval);
                    focusLostInterval = null;
                }
                focusLostTime = null;
            }
        }
    }));
    // Register a handler for extension deactivation
    context.subscriptions.push({
        dispose: () => {
            console.log('Session terminated: VS Code is closing');
            if (currentSessionActive && currentSessionId) {
                const token = context.globalState.get('accessToken');
                if (token) {
                    console.log("Session terminated with focus lost");
                    if (focusLostTime) {
                        const focusLostDuration = new Date().getTime() - focusLostTime.getTime();
                        if (focusLostDuration > INTERRUPTION_THRESHOLD) {
                            cumulativeInterruptions += 1; // Incrémenter avant sauvegarde
                            updateCurrentSessionSync(context, {
                                endTime: new Date().toISOString(),
                                interruptions: cumulativeInterruptions
                            });
                        }
                    }
                    else {
                        updateCurrentSessionSync(context, {
                            endTime: new Date().toISOString()
                        });
                    }
                }
            }
            currentSessionActive = false;
        }
    });
    vscode.workspace.onDidChangeTextDocument(async (event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== event.document)
            return;
        // Compter les nouvelles lignes ajoutées
        const newLines = event.contentChanges.filter(change => change.text.includes('\n')).length;
        if (newLines > 0) {
            lineTracking.totalLines += newLines;
            if (lineTracking.timeout) {
                clearTimeout(lineTracking.timeout);
            }
            lineTracking.timeout = setTimeout(async () => {
                await updateCurrentSession(context, {
                    linesWritten: lineTracking.totalLines
                });
            }, 1000); // 1 seconde de délai
        }
    });
    // Stockage temporaire des snippets
    let userCodeSnippets = [];
    let accessToken;
    // Session au démarrage
    createNewSessionIfNeeded(context);
    // Nettoyage
    context.subscriptions.push({
        dispose: () => {
            currentSessionActive = false;
        }
    });
    // Fonction pour gérer l'authentification
    async function authenticate() {
        // Vérifier si un token existe déjà et est valide
        accessToken = context.globalState.get('accessToken');
        if (accessToken) {
            try {
                vscode.window.showInformationMessage('Already logged in');
                return true;
            }
            catch (error) {
                console.error('Token validation error:', error);
                // Continue to login if validation fails
            }
        }
        // Créer un serveur local pour recevoir le token
        return new Promise((resolve) => {
            const server = http.createServer(async (req, res) => {
                const parsedUrl = url.parse(req.url || '', true);
                if (parsedUrl.pathname === '/auth-callback') {
                    const token = parsedUrl.query.token;
                    const errorMsg = parsedUrl.query.error;
                    if (errorMsg) {
                        // Gérer les erreurs d'authentification
                        res.writeHead(400, { 'Content-Type': 'text/html' });
                        res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head><title>Authentication Error</title></head>
                        <body>
                            <h1>Authentication Failed</h1>
                            <p>${errorMsg}</p>
                        </body>
                        </html>
                    `);
                        server.close();
                        resolve(false);
                        return;
                    }
                    if (token) {
                        try {
                            const tokenData = JSON.parse(decodeURIComponent(token));
                            accessToken = tokenData.access_token;
                            await context.globalState.update('accessToken', accessToken);
                            vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
                            // Dans votre page HTML de confirmation:
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Authentification Réussie</title>
                                    <script>
                                        // Utiliser un protocole URI spécifique pour communiquer avec votre extension
                                        
                                        window.location.href = 'vscode://mandourilyass.devproductivitytracker/authsuccess';
                                      
                                    </script>
                                </head>
                                <body>
                                    <h1>Authentification Réussie</h1>
                                    <p>Redirection vers VS Code en cours...</p>
                                    <p>Si VS Code ne s'ouvre pas automatiquement, vous pouvez fermer cette fenêtre et retourner manuellement à VS Code.</p>
                                </body>
                                </html>
                            `);
                            vscode.window.showInformationMessage('Login successful!');
                            createNewSessionIfNeeded(context);
                            server.close();
                            resolve(true);
                            return;
                        }
                        catch (error) {
                            console.error('Token validation error:', error);
                        }
                    }
                    // Si on arrive ici, c'est qu'il y a eu une erreur
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>Error</title></head>
                    <body>
                        <h1>Authentication Failed</h1>
                        <p>Please try again.</p>
                    </body>
                    </html>
                `);
                    server.close();
                    resolve(false);
                }
                else {
                    res.writeHead(404);
                    res.end('Not found');
                }
            });
            // Utiliser le port 0 pour laisser le système choisir un port libre
            server.listen(0, () => {
                const port = server.address().port;
                const callbackUrl = `http://localhost:${port}/auth-callback`;
                // Ouvrir le navigateur avec l'URL de login
                const loginUrl = `http://localhost:3000/auth/login?callback=${encodeURIComponent(callbackUrl)}`;
                vscode.env.openExternal(vscode.Uri.parse(loginUrl));
                vscode.window.showInformationMessage('Please login in your browser...');
            });
            // Timeout après 5 minutes
            setTimeout(() => {
                if (server.listening) {
                    server.close();
                    vscode.window.showErrorMessage('Login timed out');
                    resolve(false);
                }
            }, 300000);
        });
    }
    let showSelectedCodeCmd = vscode.commands.registerCommand('devproductivitytracker.showSelectedCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showWarningMessage('No text selected! Please select some code first.');
            return;
        }
        const selectedText = editor.document.getText(selection);
        userCodeSnippets.push(selectedText);
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Sending code to API...",
            cancellable: false
        }, async (progress) => {
            try {
                const apiResponse = await sendCodeToAPI(selectedText);
                const responseData = JSON.parse(apiResponse);
                const panel = vscode.window.createWebviewPanel('selectedCodeViewer', 'Selected Code', vscode.ViewColumn.Beside, {
                    enableScripts: true
                });
                // Stocker la sélection originale pour le remplacement
                panel.originalSelection = selection;
                panel.webview.html = getWebviewContent(selectedText, responseData.correctedCode);
                // Écouter les messages du Webview
                panel.webview.onDidReceiveMessage(async (message) => {
                    if (message.command === 'replaceCode') {
                        const editor = vscode.window.activeTextEditor;
                        if (editor) {
                            await editor.edit(editBuilder => {
                                editBuilder.replace(panel.originalSelection, message.correctedCode);
                            });
                            vscode.window.showInformationMessage('Code replaced successfully!');
                        }
                    }
                }, undefined, context.subscriptions);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to call API: ${error}`);
            }
        });
    });
    function getWebviewContent(originalCode, correctedCode) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    pre {
                        background: #f4f4f4;
                        padding: 1em;
                        border-radius: 5px;
                        overflow-x: auto;
                        white-space: pre-wrap;
                    }
                    .container {
                        padding: 15px;
                    }
                    .api-response {
                        margin-top: 20px;
                        padding: 15px;
                        background: #f0f8ff;
                        border-radius: 5px;
                    }
                    button {
                        margin-top: 10px;
                        padding: 8px 16px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    .hidden-code {
                        display: none;
                    }
                </style>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function replaceCode() {
                        const rawCode = document.getElementById('rawCorrectedCode').textContent;
                        vscode.postMessage({
                            command: 'replaceCode',
                            correctedCode: rawCode
                        });
                    }
                </script>
            </head>
            <body>
                <div class="container">
                    <h3>Code Sélectionné :</h3>
                    <pre>${escapeHtml(originalCode)}</pre>
                    <p>Longueur : ${originalCode.length} caractères</p>
                    
                    <div class="api-response">
                        <h3>Réponse de l'API :</h3>
                        <pre>${escapeHtml(correctedCode)}</pre>
                        <button onclick="replaceCode()">Remplacer par le Code Corrigé</button>
                        <!-- Stockage du code original non échappé -->
                        <pre id="rawCorrectedCode" class="hidden-code">${correctedCode}</pre>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    // Fonction d'échappement HTML (inchangée)
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/`/g, "&#096;")
            .replace(/\$/g, "&#036;");
    }
    // Barre d'état
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(code) DevTracker';
    statusBarItem.tooltip = 'Click to view selected code';
    statusBarItem.command = 'devproductivitytracker.showSelectedCode';
    statusBarItem.show();
    context.subscriptions.push(showSelectedCodeCmd, statusBarItem);
    const generateCodeCmd = vscode.commands.registerCommand('devproductivitytracker.generateCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }
        try {
            // Demander la description à l'utilisateur
            const userPrompt = await vscode.window.showInputBox({
                prompt: 'Décrivez la fonctionnalité à générer',
                placeHolder: 'Ex: Une fonction React qui affiche un compteur'
            });
            if (!userPrompt)
                return;
            // Récupérer le contenu actuel du fichier comme contexte
            const fileContext = editor.document.getText();
            // Options supplémentaires
            const language = editor.document.languageId;
            const framework = await vscode.window.showQuickPick(['Aucun', 'Spring', 'React', 'Angular', 'Vue', 'Node.js'], { placeHolder: 'Framework (optionnel)' });
            const complexity = await vscode.window.showQuickPick(['Débutant', 'Intermédiaire', 'Avancé'], { placeHolder: 'Niveau de complexité' });
            // Appel API avec indicateur de progression
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Génération du code en cours...",
                cancellable: false
            }, async (progress) => {
                const response = await callCodeGenerationAPI(context, {
                    prompt: userPrompt,
                    language: language,
                    framework: framework === 'Aucun' ? undefined : framework,
                    complexity: complexity?.toLowerCase(),
                    fileContext: fileContext // Envoyer le contexte du fichier
                });
                // Insérer le code à la position actuelle du curseur
                await editor.edit(editBuilder => {
                    const position = editor.selection.active;
                    editBuilder.insert(position, response.generatedCode);
                });
                vscode.window.showInformationMessage('Code généré et inséré avec succès!');
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Échec de la génération: ${error.message}`);
        }
    });
    context.subscriptions.push(generateCodeCmd);
    const generateCodeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    generateCodeButton.text = '$(sparkle) Générer Code';
    generateCodeButton.tooltip = 'Générer du code avec IA';
    generateCodeButton.command = 'devproductivitytracker.generateCode';
    generateCodeButton.show();
    context.subscriptions.push(generateCodeButton);
    // Ajoutez cette nouvelle fonction dans votre extension.ts
    async function sendCodeToAPI(code) {
        try {
            const response = await fetch('http://localhost:8083/correctCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        }
        catch (error) {
            console.error('Error calling API:', error);
            throw error;
        }
    }
    let loginCommand = vscode.commands.registerCommand('devproductivitytracker.login', async () => {
        const isAuthenticated = await authenticate();
        if (isAuthenticated) {
            currentSessionActive = false;
            //await createNewSessionIfNeeded(context); // Crée une nouvelle session après login
        }
    });
    context.subscriptions.push(loginCommand);
    // Commande pour se déconnecter
    let logoutCommand = vscode.commands.registerCommand('devproductivitytracker.logout', async () => {
        accessToken = undefined;
        await context.globalState.update('accessToken', undefined);
        vscode.window.showInformationMessage('Vous êtes déconnecté');
    });
    // Ajout d'une commande pour afficher le nombre d'erreurs
    let countErrorsCmd = vscode.commands.registerCommand('devproductivitytracker.countErrors', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }
        // Attendre que les diagnostics soient mis à jour
        await new Promise(resolve => setTimeout(resolve, 500));
        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
        // Compter les diagnostics avec une gravité de 1 ou 0 (erreurs et avertissements)
        const errorCount = diagnostics.filter(diagnostic => diagnostic.severity <= vscode.DiagnosticSeverity.Warning).length;
        vscode.window.showInformationMessage(`Nombre d'erreurs dans le fichier actif : ${errorCount}`);
    });
    context.subscriptions.push(countErrorsCmd);
    // Modification pour afficher uniquement le message d'erreurs et envoyer le nombre à la BDD
    vscode.workspace.onDidSaveTextDocument(async (document) => {
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const errorCount = diagnostics.filter(diagnostic => diagnostic.severity <= vscode.DiagnosticSeverity.Warning).length;
        cumulativeErrors += errorCount; // Ajouter les erreurs actuelles au total cumulatif
        console.log(`Nombre d'erreurs dans le fichier sauvegardé : ${cumulativeErrors}`);
        // Envoyer le total cumulatif des erreurs à la BDD
        await updateCurrentSession(context, { errors: cumulativeErrors });
    });
}
function deactivate() { }
async function createNewSessionIfNeeded(context) {
    const token = context.globalState.get('accessToken');
    if (!token || currentSessionActive)
        return;
    try {
        const response = await fetch('http://localhost:8083/api/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        if (response.ok) {
            const sessionData = await response.json();
            currentSessionId = sessionData.id; // Stocke l'ID de la session
            console.log(`Nouvelle session créée avec ID: ${currentSessionId}`);
            currentSessionActive = true;
            cumulativeInterruptions = 0;
            lineTracking.totalLines = 0;
            cumulativeErrors = 0;
            // Stockez aussi dans le contexte global si nécessaire
            await context.globalState.update('currentSessionId', currentSessionId);
        }
    }
    catch (error) {
        console.error('Erreur création session:', error);
    }
}
function updateCurrentSessionSync(context, updates) {
    try {
        // Récupération des données depuis le stockage
        const token = context.globalState.get('accessToken');
        const sessionId = context.globalState.get('currentSessionId');
        if (!token || !sessionId) {
            throw new Error('Session non authentifiée ou ID de session manquant');
        }
        // Envoi de la requête SYNCHRONE
        const response = (0, sync_request_1.default)('PUT', `http://localhost:8083/api/sessions/${sessionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        if (response.statusCode !== 200) {
            throw new Error(`Erreur HTTP: ${response.statusCode}`);
        }
        console.log('Session mise à jour avec succès:', updates);
        return true;
    }
    catch (error) {
        console.error('Échec de la mise à jour:', error);
        // On ne peut pas utiliser showErrorMessage pendant la fermeture
        return false;
    }
}
async function updateCurrentSession(context, updates) {
    try {
        // Récupération des données depuis le stockage
        const token = context.globalState.get('accessToken');
        const sessionId = context.globalState.get('currentSessionId');
        if (!token || !sessionId) {
            throw new Error('Session non authentifiée ou ID de session manquant');
        }
        // Envoi de la requête
        const response = await fetch(`http://localhost:8083/api/sessions/${sessionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        console.log('Session mise à jour avec succès:', updates);
    }
    catch (error) {
        console.error('Échec de la mise à jour:', error);
        vscode.window.showErrorMessage('Échec de la mise à jour de la session');
    }
}
// Vérificateur de type
function isCodeGenerationResponse(obj) {
    return obj && typeof obj.generatedCode === 'string';
}
async function callCodeGenerationAPI(context, request) {
    const apiUrl = 'http://localhost:8083/generate-code';
    const token = context.globalState.get('accessToken');
    if (!token) {
        const loginChoice = await vscode.window.showErrorMessage('Connectez-vous pour utiliser cette fonctionnalité', 'Se connecter');
        if (loginChoice === 'Se connecter') {
            await vscode.commands.executeCommand('devproductivitytracker.login');
        }
        throw new Error('Authentification requise');
    }
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(request)
        });
        if (response.status === 401) {
            context.globalState.update('accessToken', undefined);
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (!isCodeGenerationResponse(data)) {
            throw new Error('Format de réponse API invalide');
        }
        return data;
    }
    catch (error) {
        console.error('Erreur lors de l\'appel API:', error);
        throw error;
    }
}
//# sourceMappingURL=extension.js.map