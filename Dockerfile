# Usar una imagen base de Node.js
#FROM node:16

# Establecer el directorio de trabajo en el contenedor
#WORKDIR /usr/src/app

# Instalar nodemon para el desarrollo
#RUN npm install -g nodemon

# Copiar los archivos de definición de paquete
#COPY package*.json ./

# Instalar todas las dependencias del proyecto
#RUN npm install

# Copiar el resto del código fuente de la aplicación
#COPY . .

# Exponer el puerto que nodemon usará
#EXPOSE 3000

# Comando para ejecutar la aplicación usando nodemon
#CMD ["nodemon", "server.js"]

# Establece la imagen base
FROM node:16

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Instala las dependencias de la aplicación
# El asterisco se usa para asegurarse de que tanto package.json como package-lock.json se copien
# donde estén disponibles (npm@5+)
COPY app/package*.json ./

RUN npm install
# Si estás construyendo tu código para producción
# RUN npm ci --only=production

# Agrupa el código fuente de la aplicación dentro del contenedor Docker
COPY app/ .

# Tu aplicación se une a puerto 3000, por lo que usarás la instrucción EXPOSE para que se mapee por Docker
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD [ "node", "handler.js" ]
