# Usa una imagen oficial de Node.js
FROM node:22.14.0-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json desde la raíz del proyecto
COPY ../package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente desde la raíz del proyecto
COPY ../ ./

# Expone el puerto de desarrollo de Vite
EXPOSE 5173

# Comando que ejecuta el servidor de desarrollo en modo local
#CMD ["npm", "run", "dev", "--", "--mode", "enlocal", "--host"]

# Comando que ejecuta el servidor de desarrollo en modo cloud
CMD ["npm", "run", "dev", "--", "--mode", "nube", "--host"]

# Comando que ejecuta el servidor de desarrollo en modo test
#CMD ["npm", "run", "dev", "--", "--mode", "test", "--host"]
