# Usa una imagen oficial de Node.js
FROM node:18

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

# Comando que ejecuta el servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]