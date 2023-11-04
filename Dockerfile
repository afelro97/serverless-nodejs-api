# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Instalar nodemon para el desarrollo
RUN npm install -g nodemon

# Copiar los archivos de definición de paquete
COPY package*.json ./

# Instalar todas las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente de la aplicación
COPY . .

# Exponer el puerto que nodemon usará
EXPOSE 3000

# Comando para ejecutar la aplicación usando nodemon
CMD ["nodemon", "server.js"]
