# Usa la imagen base de Node.js
FROM node:20
# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app
# Copia los archivos de configuración del proyecto
COPY package*.json ./
# Instala las dependencias
RUN npm install
# Copia el resto de los archivos del proyecto
COPY . .
# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000
# Comando para iniciar la aplicación
CMD ["node", "index.js"]