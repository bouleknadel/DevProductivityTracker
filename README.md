# Tracker de Productivité pour Développeurs

Le Tracker de Productivité pour Développeurs est une solution complète conçue pour surveiller et améliorer la productivité des développeurs dans VSCode, avec des analyses détaillées et des fonctionnalités d'assistance de code alimentées par l'IA.

## Aperçu du Projet

Ce projet se compose de trois composants principaux :

1. **Extension VSCode** : Suit vos sessions de codage, surveille les interruptions, compte les lignes écrites et offre une génération et correction de code assistée par IA.

2. **Backend (Spring Boot)** : Fournit des points d'accès API pour l'extension, gère l'authentification et traite les requêtes IA en utilisant le modèle Gemini de Google.

3. **Frontend** : Interface web pour visualiser les métriques de productivité et gérer votre compte.

## Fonctionnalités

### Extension VSCode

- **Suivi des Sessions** : Suit automatiquement les sessions de codage actives
- **Détection des Interruptions** : Mesure le temps de concentration et identifie les interruptions significatives
- **Statistiques de Code** : Compte les lignes écrites et les erreurs rencontrées
- **Assistance de Code IA** :
  - Correction de code avec remplacement en ligne
  - Génération de code par IA basée sur des instructions en langage naturel
  - Prise en compte du contexte de votre fichier actuel

### Backend & Frontend

- **Gestion des Utilisateurs** : Authentification sécurisée et gestion des profils
- **Analyse de Productivité** : Visualisation de votre productivité et de vos habitudes de codage
- **Rapports** : Générez des rapports détaillés sur votre activité de développement

## Installation

### Prérequis

- Node.js (v14+)
- Java 17
- Docker et Docker Compose (pour le déploiement)
- Visual Studio Code

### Configuration

1. **Backend**
   ```bash
   cd Backend
   docker-compose up -d
   ```

2. **Frontend**
   ```bash
   cd Frontend
   docker-compose up -d
   ```

3. **Extension VSCode**
   - Ouvrez VS Code
   - Accédez aux Extensions (Ctrl+Shift+X)
   - Cliquez sur "..." puis "Installer depuis un VSIX"
   - Sélectionnez le fichier VSIX depuis le dossier DevProductivityTracker

## Développement et test de l'extension

Pour tester l'extension pendant le développement :

1. Ouvrez le dossier de l'extension (DevProductivityTracker) dans VS Code
2. Appuyez sur F5 pour lancer une nouvelle fenêtre VS Code avec l'extension en mode debug
3. La fenêtre de développement affichera les logs et permettra de déboguer l'extension

## Guide d'utilisation de l'extension

### Démarrage d'une session

1. **Connexion** : 
   - Cliquez sur "$(code) DevTracker" dans la barre d'état
   - Ou utilisez la commande `DevProductivityTracker: Login` depuis la palette de commandes (Ctrl+Shift+P)
   - Une fenêtre de navigateur s'ouvrira pour vous authentifier
   - Après connexion, une nouvelle session de productivité démarre automatiquement

2. **Suivi automatique** : 
   - Une fois connecté, l'extension suit automatiquement votre activité
   - Les métriques collectées incluent :
     - Temps total de session
     - Lignes de code écrites
     - Erreurs détectées
     - Interruptions

### Détection des interruptions

- Une **interruption** est définie comme une période d'au moins 1 minute pendant laquelle VS Code perd le focus
- Quand vous quittez VS Code :
  - Un compteur d'absence s'affiche dans la barre d'état
  - Au retour, vous verrez un message indiquant la durée de votre absence
  - Les interruptions sont enregistrées automatiquement dans votre session

### Fonctionnalités d'assistance IA

1. **Correction de code** :
   - Sélectionnez un bloc de code
   - Cliquez sur "$(code) DevTracker" dans la barre d'état
   - Une fenêtre s'ouvre avec la version corrigée du code
   - Cliquez sur "Remplacer par le Code Corrigé" pour appliquer les modifications

2. **Génération de code** :
   - Cliquez sur "$(sparkle) Générer Code" dans la barre d'état
   - Décrivez la fonctionnalité souhaitée en langage naturel
   - Sélectionnez le framework et la complexité
   - Le code généré sera inséré à la position actuelle du curseur

### Autres commandes

- **Comptage d'erreurs** : Utilisez la commande `DevProductivityTracker: Count Errors` pour afficher le nombre d'erreurs dans le fichier actif
- **Déconnexion** : Utilisez la commande `DevProductivityTracker: Logout` pour vous déconnecter

## Architecture

- **Extension VSCode** : TypeScript, API VSCode
- **Backend** : Spring Boot, Spring AI, SQLite
- **Frontend** : React, TailwindCSS

## Sécurité

- Authentification par token JWT
- Stockage sécurisé des clés API
- Communications chiffrées entre les composants

## Contribuer

Les contributions sont les bienvenues ! Veuillez consulter notre guide de contribution pour plus de détails.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur ce dépôt.