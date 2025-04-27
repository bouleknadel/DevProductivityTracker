# Utiliser une image de base Node.js pour construire l'application
FROM node:18 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Utiliser une image de base nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour le serveur nginx
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]