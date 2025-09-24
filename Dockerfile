# Etapa Construcción
FROM node:22.19.0-alpine3.22 AS build

# Define directorio de trabajo directorio de trabajo
WORKDIR /app

# Copia package.json y lock primero
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Copia el código
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de Despliegue
FROM node:22.19.0-alpine3.22 AS deploy-stage

# Establece Zona Horaria
ENV TZ=America/Argentina/Cordoba
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Define espacio de trabajo
WORKDIR /app

# Copia la App
COPY --from=build /app/dist /app/dist

# Define usuario y grupo
ARG APP_UID=14000
ARG APP_USER=frontuser

# Configura Usuario
RUN addgroup -g ${APP_UID} ${APP_USER} && \
    adduser -S -G ${APP_USER} -u ${APP_UID} ${APP_USER}

# Cambia el usuario por defecto para ejecutar Node
USER ${APP_USER}

EXPOSE 4000

# Comando de arranque
CMD ["node", "/app/dist/riu-frontend-joaquin-baccifava/server/server.mjs"]