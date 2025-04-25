import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

test('Count errors in active file', async () => {
    const editor = await vscode.workspace.openTextDocument({
        content: 'const a = 1\nconst b = ;', // Contient une erreur syntaxique
        language: 'javascript'
    });
    await vscode.window.showTextDocument(editor);

    // Exécuter la commande pour compter les erreurs
    await vscode.commands.executeCommand('devproductivitytracker.countErrors');

    // Récupérer les diagnostics pour vérifier le nombre d'erreurs
    const diagnostics = vscode.languages.getDiagnostics(editor.uri);
    const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;

    assert.strictEqual(errorCount, 1, 'Le nombre d\'erreurs devrait être 1');
});

test('Count errors in Python file', async () => {
    const editor = await vscode.workspace.openTextDocument({
        content: 'def test_function():\n    print("Hello World")\n    return 42\n    return 43', // Indentation error
        language: 'python'
    });
    await vscode.window.showTextDocument(editor);

    // Exécuter la commande pour compter les erreurs
    await vscode.commands.executeCommand('devproductivitytracker.countErrors');

    // Récupérer les diagnostics pour vérifier le nombre d'erreurs
    const diagnostics = vscode.languages.getDiagnostics(editor.uri);
    const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;

    assert.strictEqual(errorCount > 0, true, 'Le fichier Python devrait contenir des erreurs détectées.');
});

