---
description: Una guía para configurar un entorno de desarrollo local completo para contribuir al proyecto de código abierto de plugNmeet.
title: Configuración del Entorno de Desarrollo | Guía del Desarrollador de plugNmeet
keywords: [contribuir, configuración de desarrollo, entorno local, desarrollo de plugnmeet, docker, nodejs, pnpm, guía del desarrollador]
sidebar_position: 2
sidebar_label: Configuración de Desarrollo
---

# Configuración de su Entorno de Desarrollo

¡Bienvenido a la guía de desarrollo de plugNmeet! Estamos emocionados de que esté interesado en contribuir. Esta guía lo guiará a través de la configuración de un entorno de desarrollo local completo, lo que le permitirá ejecutar toda la pila de plugNmeet en su propia máquina.

Seguir estos pasos le permitirá probar nuevas funciones, corregir errores y ver sus cambios en tiempo real.

---

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado el siguiente software en su computadora:

1.  **Docker**: Se utiliza para ejecutar los servicios de backend (como LiveKit y NATS) en contenedores aislados, lo que simplifica significativamente el proceso de configuración.
2.  **Node.js**: Requerido para ejecutar y desarrollar el `plugNmeet-client`. Recomendamos usar la última versión LTS.
3.  **Git**: Para clonar los repositorios del proyecto. Puede usar un cliente de línea de comandos o una GUI como GitHub Desktop.
4.  **FFMPEG**: (Opcional) Requerido solo si planea trabajar o probar las funciones de grabación.

---

## Paso 1: Clonar los Repositorios

Primero, cree un directorio de proyecto principal y clone los repositorios de plugNmeet necesarios en él. Abra su terminal y ejecute los siguientes comandos:

```sh
# Crear e ingresar a un nuevo directorio para el proyecto
mkdir plugnmeet-dev
cd plugnmeet-dev

# Clonar el repositorio del servidor principal
git clone https://github.com/mynaparrot/plugNmeet-server server

# Clonar el repositorio del cliente front-end
git clone https://github.com/mynaparrot/plugNmeet-client client

# Clonar el repositorio del servicio de grabación
git clone https://github.com/mynaparrot/plugNmeet-recorder recorder
```

---

## Paso 2: Configurar y Ejecutar el Servidor de Backend

El repositorio `plugNmeet-server` contiene un archivo `docker-compose.yaml` que orquesta todos los servicios de backend necesarios.

```sh
# Navegar al directorio del servidor
cd server

# Para la configuración por primera vez, copie los archivos de configuración de muestra
cp config_sample.yaml config.yaml
cp livekit_sample.yaml livekit.yaml
cp ingress_sample.yaml ingress.yaml
cp nats_server_sample.conf nats_server.conf
cp docker-compose_sample.yaml docker-compose.yaml

# Construir e iniciar todos los servicios de backend
docker-compose up --build
```

La primera vez que ejecute esto, puede tardar unos minutos en descargar y construir las imágenes del contenedor. En ejecuciones posteriores, simplemente puede usar `docker-compose up` para iniciar los servicios mucho más rápido.

Deje esta ventana de terminal en ejecución, ya que mostrará los registros de todos los servicios de backend.

---

## Paso 3: Configurar y Ejecutar el Cliente Front-End

Ahora, pongamos en marcha la interfaz de usuario. Abra una **nueva ventana o pestaña de terminal** para que pueda ejecutar el cliente simultáneamente con el servidor.

```sh
# Navegar al directorio del cliente desde su carpeta de proyecto principal
cd client

# Copiar el archivo de configuración de muestra
cp src/assets/config_sample.js src/assets/config.js

# Instalar todas las dependencias del proyecto
# Si no tiene pnpm, puede instalarlo con `npm install -g pnpm`
pnpm install

# Iniciar el servidor de desarrollo del cliente
pnpm start
```

Una vez que el servidor de desarrollo esté en funcionamiento, puede acceder al cliente de plugNmeet en su navegador web en: **[http://localhost:3000/login.html](http://localhost:3000/login.html)**

---

## Paso 4: (Opcional) Ejecutar el Servicio de Grabación

Si necesita trabajar en las funciones de grabación, puede iniciar el servicio de grabación. Abra una **tercera ventana o pestaña de terminal**.

```sh
# Navegar al directorio del grabador desde su carpeta de proyecto principal
cd recorder

# Copiar los archivos de configuración de muestra
cp config_sample.yaml config.yaml
cp docker-compose_sample.yaml docker-compose.yaml

# Construir e iniciar el servicio de grabación
docker-compose up --build
```

El grabador ahora estará en funcionamiento y escuchará automáticamente los trabajos de grabación del `plugNmeet-server`.

---

## Solución de Problemas

### "No puedo conectarme a la sala de reuniones."

Este es un problema común en las configuraciones de desarrollo local, a menudo causado por la red de Docker. El servidor LiveKit dentro del contenedor necesita conocer la dirección IP local de su máquina anfitriona para establecer una conexión WebRTC.

1.  Encuentre la dirección IP local de su computadora (p. ej., `192.168.1.100`).
2.  Abra el archivo `docker-compose.yaml` dentro del directorio `server`.
3.  Encuentre la sección del servicio `livekit`.
4.  Modifique la línea de `command` para agregar la bandera `--node-ip` con su IP:

```yaml
  # Antes
  command: --config "/app/livekit.yaml" --dev

  # Después
  command: --config "/app/livekit.yaml" --dev --node-ip SU_IP_LOCAL_AQUÍ
```

5.  Reinicie el servidor con `docker-compose down` y `docker-compose up`.

---

## ¿Qué Sigue?

¡Ahora tiene un entorno de desarrollo de plugNmeet completamente funcional! Puede comenzar a hacer cambios en el código del cliente o del servidor, y sus cambios se reflejarán en tiempo real.

Damos la bienvenida a todas las contribuciones. Un buen lugar para comenzar es mirar los problemas abiertos en nuestros repositorios de GitHub. ¡Feliz codificación!
