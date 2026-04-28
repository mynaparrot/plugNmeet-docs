---
title: Cómo instalar el servidor plugNmeet | Guía de instalación auto-alojada
description: Una guía paso a paso para instalar el servidor de código abierto plugNmeet en su máquina Linux utilizando nuestro script automatizado simple.
keywords: [instalar, configuración, servidor, linux, auto-alojar, docker, ubuntu, instalación, servidor webrtc]
sidebar_position: 3
sidebar_label: Guía de instalación
---

# Inicio rápido de instalación

Esta guía lo llevará a través de la forma más rápida y fácil de poner en marcha su propia plataforma de videoconferencia auto-alojada.

Nuestro método recomendado utiliza un script automatizado simple que configura todos los componentes necesarios requeridos para ejecutar la plataforma en un servidor Ubuntu o Debian limpio. Alternativamente, para aquellos que prefieren un servicio gestionado, nuestra **[solución oficial PlugNmeet Cloud](https://www.plugnmeet.cloud)** proporciona un servidor listo para usar, lo que le permite omitir el proceso de instalación por completo.

Vamos a configurar su servidor.

---

## Paso 1: Requisitos del servidor

Antes de comenzar, asegúrese de tener lo siguiente:

*   Un **servidor Ubuntu o Debian limpio** con una **dirección IP pública**. Recomendamos cualquier versión de Ubuntu LTS. Es fundamental que el servidor **no** tenga otros servidores web como Apache o Nginx ya en ejecución, ya que esto causará conflictos.
*   **Hardware y ancho de banda:** El servidor Plug-N-Meet en sí mismo es una aplicación muy ligera. El hardware que necesita depende de su carga de trabajo esperada, específicamente el número de usuarios concurrentes y su frecuencia de grabación.

    Para un grupo pequeño o pruebas, un servidor simple (ej., 2 núcleos de CPU, 2-4GB de RAM) es suficiente.

    Para un entorno de producción, recomendamos:
    *   **Ancho de banda:** Este es el factor más crítico. Se recomienda un **mínimo de 100 Mbits/seg**, pero más siempre es mejor para una experiencia de usuario de calidad.
    *   **CPU:** Al menos 4 núcleos (se recomiendan 8+ si se usa el grabador).
    *   **RAM:** Al menos 4GB (se recomiendan 8GB+ si se usa el grabador).
*   **Dos subdominios** que apunten a la IP pública de su servidor (ej., `plugnmeet.example.com` y `turn.example.com`).
*   Una **dirección de correo electrónico válida** para generar un certificado SSL de Let's Encrypt.

:::info[Configuración del Firewall]
Si su servidor está detrás de un firewall, revise nuestra **[Guía de configuración del Firewall](/docs/firewall)** para asegurarse de que los puertos necesarios estén abiertos antes de continuar.
:::

---

## Paso 2: Ejecutar la instalación automatizada

Conéctese a su servidor a través de SSH. El método recomendado y más transparente es descargar primero el script y luego ejecutarlo. Esto le permite inspeccionar el contenido del script antes de ejecutarlo como root.

```bash
# 1. Descargar el script
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh

# 2. Ejecutar el script como root
sudo bash install.sh
```

**Alternativamente**, puede descargarlo y ejecutarlo en un solo comando:
```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh)" root
```

El script es interactivo y le solicitará la información necesaria, como sus nombres de dominio y dirección de correo electrónico.

Al final del proceso, el script mostrará su **URL del servidor**, **API Key** y **API Secret**.

:::info[Sus credenciales de servidor]
Recomendamos guardar estas credenciales ahora para facilitar el acceso. Sin embargo, si llega a cerrar la ventana, ¡no se preocupe! Siempre puede encontrarlas más tarde en el archivo `/opt/plugNmeet/config.yaml` en su servidor.
:::

---

## Paso 3: Verificar su instalación

Una vez completada la instalación, puede verificar que todo esté funcionando correctamente.

1.  **Verificar el estado del servicio:**

    ```bash
    # Verificar el servidor principal
    systemctl status plugnmeet

    # Verificar el servicio de grabador
    systemctl status plugnmeet-recorder
    ```
    Ambos servicios deben mostrar un estado `active (running)`.

2.  **Realizar un inicio de sesión de prueba:**
    La mejor manera de confirmar que todo el sistema funciona es unirse a una reunión de prueba.

    Navegue a `https://plugnmeet.example.com/login.html`. En esta página, puede usar la `API_KEY` y `API_SECRET` que guardó de la instalación para generar un token de acceso temporal y unirse a una conferencia de prueba.

---

## ¿Qué sigue?

¡Felicidades! Ahora tiene una plataforma de videoconferencia auto-alojada totalmente funcional. Aquí hay algunas cosas que puede hacer a continuación:

*   **Comenzar a usar Plug-N-Meet:** Ahora que su servidor está en funcionamiento, visite nuestro **[Resumen de la guía del usuario](/docs/user-guide/overview)** para conocer las diferentes formas en que puede integrar y usar su nueva plataforma, desde plugins sin código hasta nuestra potente API.
*   **Explorar la API:** Para los desarrolladores listos para sumergirse, nuestra **[Documentación de la API](/docs/api/intro)** proporciona todos los detalles que necesita para comenzar a comenzar a construir.
*   **Administrar su servidor:** Conozca los comandos comunes para **[administrar sus servicios](#administrando-servicios)**, incluyendo iniciar, detener y ver registros.

---

## Temas avanzados

### Administrando servicios

Todos los componentes de Plug-N-Meet se ejecutan como servicios de `systemd`.

```bash
# Para iniciar, reiniciar o detener los servicios:
systemctl restart plugnmeet
systemctl restart plugnmeet-recorder
```

Para ver los archivos de registro:
```sh
tail -n 200 -f /opt/plugNmeet/log/plugNmeet.log
tail -n 200 -f /opt/plugNmeet/recorder/logs/recorder.log
```

### Actualización de su servidor

Para actualizar su instalación de Plug-N-Meet a la última versión, simplemente ejecute el script `update.sh`:

```sh
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh)" root
```

### Despliegues escalables

Para necesidades a gran escala, Plug-N-Meet puede desplegarse en un clúster distribuido de múltiples servidores. Para obtener más información, lea nuestra **[Guía de despliegue escalable](/docs/developer-guide/scalable-setup)**.
