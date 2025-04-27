# Projet PFA - Guide de démarrage

Ce projet est composé de trois parties principales :
- **Backend** : Une application Java Spring Boot.
- **Frontend** : Une application React.
- **Extension** : Une extension Visual Studio Code.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants :
- [Docker](https://www.docker.com/) et Docker Compose
- [Node.js](https://nodejs.org/) (pour l'extension et le frontend)
- [Java JDK](https://www.oracle.com/java/technologies/javase-downloads.html) (pour le backend)

---

## Lancer les images Docker

### 1. Backend

1. Naviguez dans le dossier `Backend` :
   ```bash
   cd Backend
   ```
2. Construisez l'image Docker :
   ```bash
   docker build -t backend-image .
   ```
3. Lancez le conteneur avec Docker Compose :
   ```bash
   docker-compose up
   ```
4. L'application backend sera disponible sur `http://localhost:8080`.

### 2. Frontend

1. Naviguez dans le dossier `frontend` :
   ```bash
   cd frontend
   ```
2. Construisez l'image Docker :
   ```bash
   docker build -t frontend-image .
   ```
3. Lancez le conteneur avec Docker Compose :
   ```bash
   docker-compose up
   ```
4. L'application frontend sera disponible sur `http://localhost:3000`.

---

## Lancer l'extension Visual Studio Code

1. Naviguez dans le dossier `DevProductivityTracker` :
   ```bash
   cd DevProductivityTracker
   ```
2. Installez les dépendances nécessaires :
   ```bash
   npm install
   ```
3. Lancez l'extension en mode développement :
   ```bash
   code .
   ```
   Une fois dans Visual Studio Code, appuyez sur `F5` pour démarrer l'extension dans une nouvelle fenêtre de développement.

---

## Notes supplémentaires

- Assurez-vous que les ports nécessaires (8080 pour le backend, 3000 pour le frontend) ne sont pas utilisés par d'autres applications.
- Si vous rencontrez des problèmes, consultez les fichiers `docker-compose.yml` et `Dockerfile` dans les dossiers respectifs pour plus de détails sur la configuration.

---

## Structure du projet

- **Backend** : Contient le code source de l'application Spring Boot.
- **frontend** : Contient le code source de l'application React.
- **DevProductivityTracker** : Contient le code source de l'extension Visual Studio Code.