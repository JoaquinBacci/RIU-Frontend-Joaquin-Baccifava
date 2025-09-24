# Dockerfile — Aplicación Node.js (multi-stage)

Este repositorio contiene un `Dockerfile` multi-etapa para construir y ejecutar una aplicación Node.js compilada en `/dist`. La imagen final está basada en Alpine, corre como usuario no root y tiene configurada la zona horaria de Córdoba, Argentina.

## Requisitos

- Docker 24+ o compatible  

## Estructura esperada

```
.
├─ package.json
├─ package-lock.json
├─ src/…                 
└─ dist/
   └─ riu-frontend-joaquin-baccifava/server/server.mjs
```

El `CMD` definido en el `Dockerfile` apunta a `/app/dist/riu-frontend-joaquin-baccifava/server/server.mjs`. Es necesario que el proceso de build genere exactamente esa ruta.

## Build de la imagen

```bash
docker build --no-cache -t riu-frontend-joaquin-baccifava:latest .
```

## Ejecución del contenedor

```bash
docker run --rm -p 4000:4000 --name={nombre-contenedor} {id-imagen}
```

