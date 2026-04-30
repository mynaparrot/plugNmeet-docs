---
title: Cómo Instalar el Servidor plugNmeet | Guía de Instalación Autoalojada
description: Una guía paso a paso para instalar el servidor de código abierto plugNmeet en su máquina Linux utilizando nuestro sencillo script automatizado.
keywords: [instalar, configuración, servidor, linux, autoalojar, docker, ubuntu, instalación, servidor webrtc]
sidebar_position: 3
sidebar_label: Guía de Instalación
---

# Guía de Instalación Rápida

Esta guía le mostrará la forma más rápida y sencilla de poner en marcha su propia plataforma de videoconferencias autoalojada.

Nuestro método recomendado utiliza un sencillo script automatizado que configura todos los componentes necesarios para ejecutar la plataforma en un servidor limpio con Ubuntu o Debian. Como alternativa, para quienes prefieren un servicio gestionado, nuestra **[solución oficial en la nube, PlugNmeet Cloud](https://www.plugnmeet.cloud)**, proporciona un servidor listo para usar, permitiéndole omitir por completo el proceso de instalación.

Comencemos a configurar su servidor.

---

## Paso 1: Requisitos del Servidor

Antes de comenzar, asegúrese de contar con lo siguiente:

*   Un **servidor limpio con Ubuntu o Debian** y una **dirección IP pública**. Recomendamos cualquier versión LTS de Ubuntu. Es fundamental que el servidor **no** tenga otros servidores web como Apache o Nginx en ejecución, ya que esto provocará conflictos.
*   **Hardware y Ancho de Banda:** El servidor Plug-N-Meet en sí es una aplicación muy ligera. El hardware que necesita dependerá de la carga de trabajo que espere, específicamente del número de usuarios concurrentes y de la frecuencia con la que grabe sesiones.

    Para un grupo pequeño o para realizar pruebas, un servidor simple (p. ej., 2 núcleos de CPU, 2-4 GB de RAM) es suficiente.

    Para un entorno de producción, recomendamos:
    *   **Ancho de Banda:** Este es el factor más crítico. Se recomienda un **mínimo de 100 Mbits/s**, pero más siempre es mejor para una experiencia de usuario de calidad.
    *   **CPU:** Al menos 4 núcleos (se recomiendan 8 o más si se utiliza el grabador).
    *   **RAM:** Al menos 4 GB (se recomiendan 8 GB o más si se utiliza el grabador).
*   **Dos subdominios** que apunten a la IP pública de su servidor (p. ej., `plugnmeet.ejemplo.com` y `turn.ejemplo.com`).
*   Una **dirección de correo electrónico válida** para generar un certificado SSL de Let's Encrypt.

:::info[Configuración del Firewall]
Si su servidor está detrás de un firewall, por favor, revise nuestra **[Guía de Configuración del Firewall](/docs/firewall)** para asegurarse de que los puertos necesarios estén abiertos antes de continuar.
:::

---

## Paso 2: Ejecutar la Instalación Automatizada

Conéctese a su servidor a través de SSH. El método recomendado y más transparente es descargar primero el script y luego ejecutarlo. Esto le permite inspeccionar el contenido del script antes de ejecutarlo como superusuario (root).

```bash
# 1. Descargar el script
wget https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh

# 2. Ejecutar el script como superusuario
sudo bash install.sh
```

**Alternativamente**, puede descargarlo y ejecutarlo en un solo comando:
```bash
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/install.sh)" root
```

El script es interactivo y le solicitará la información necesaria, como sus nombres de dominio y su dirección de correo electrónico.

Al final del proceso, el script mostrará su **URL del Servidor**, **Clave de API** y **Secreto de API**.

:::info[Sus Credenciales de Servidor]
Recomendamos guardar estas credenciales ahora para un fácil acceso. Sin embargo, si cierra la ventana, ¡no se preocupe! Siempre podrá encontrarlas más tarde en el archivo `/opt/plugNmeet/config.yaml` de su servidor.
:::

---

## Paso 3: Verificar su Instalación

Una vez completada la instalación, puede verificar que todo funcione correctamente.

1.  **Verificar el estado del servicio:**

    ```bash
    # Verificar el servidor principal
    systemctl status plugnmeet

    # Verificar el servicio del grabador
    systemctl status plugnmeet-recorder
    ```
    Ambos servicios deberían mostrar un estado de `active (running)`.

2.  **Realizar un inicio de sesión de prueba:**
    La mejor manera de confirmar que todo el sistema funciona es unirse a una reunión de prueba.

    Navegue a `https://plugnmeet.ejemplo.com/login.html`. En esta página, puede usar la `API_KEY` y el `API_SECRET` que guardó de la instalación para generar un token de acceso temporal y unirse a una conferencia de prueba.

---

## ¿Qué Sigue?

¡Felicidades! Ahora tiene una plataforma de videoconferencias autoalojada y completamente funcional. Aquí hay algunas cosas que puede hacer a continuación:

*   **Comenzar a usar Plug-N-Meet:** Ahora que su servidor está en funcionamiento, visite nuestro **[Resumen de la Guía del Usuario](/docs/user-guide/overview)** para conocer las diferentes formas en que puede integrar y usar su nueva plataforma, desde plugins sin código hasta nuestra potente API.
*   **Explorar la API:** Para los desarrolladores listos para sumergirse, nuestra **[Documentación de la API](/docs/api/intro)** proporciona todos los detalles que necesita para comenzar a construir.
*   **Administrar su servidor:** Conozca los comandos comunes para **[administrar sus servicios](#administrando-servicios)**, incluyendo iniciar, detener y ver registros.

---

## Temas Avanzados

### Administrando Servicios

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

### Actualización de su Servidor

Para actualizar su instalación de Plug-N-Meet a la última versión, simplemente ejecute el script `update.sh`:

```sh
sudo su -c "bash <(wget -qO- https://raw.githubusercontent.com/mynaparrot/plugNmeet-install/main/update.sh)" root
```

### Despliegues Escalables

Para necesidades a gran escala, Plug-N-Meet puede desplegarse en un clúster distribuido de múltiples servidores. Para obtener más información, lea nuestra **[Guía de Despliegue Escalable](/docs/developer-guide/scalable-setup)**.
