---
title: Guía de configuración del Firewall para Plug-N-Meet
description: Cómo configurar su firewall y NAT para un servidor Plug-N-Meet auto-alojado, incluyendo los puertos TCP/UDP requeridos para WebRTC, TURN y HTTPS.
keywords: [firewall, puertos, redes, nat, turn, stun, udp, tcp, puertos webrtc, sip, voip]
sidebar_position: 2
sidebar_label: Firewall y Puertos
---

# Configuración de Firewall y Puertos

Un firewall correctamente configurado es el paso más crítico para una instalación exitosa de Plug-N-Meet. Si su servidor está detrás de un firewall o NAT (lo cual es cierto para casi todos los proveedores de la nube como AWS, Google Cloud, Azure, etc.), debe asegurarse de que los puertos correctos estén abiertos para permitir que el tráfico llegue al servidor.

Esta guía le mostrará qué puertos abrir y cómo probar su configuración.

---

## Puertos Requeridos

Debe permitir el tráfico entrante en los siguientes puertos:

| Puerto          | Protocolo | Requerido | Descripción                                                  |
| :------------ | :------- | :------- | :----------------------------------------------------------- |
| **80**        | TCP      | **Sí**  | Requerido por Let's Encrypt para emitir certificados SSL.         |
| **443**       | TCP      | **Sí**  | El puerto HTTPS principal para todo el tráfico de aplicaciones y API.  |
| **7881**      | TCP      | **Sí**  | Un puerto de respaldo para medios WebRTC cuando UDP está bloqueado.        |
| **50000-60000** | UDP      | **Sí**  | El rango de puertos principal para todos los medios de audio y video de WebRTC. |

:::info[¿Qué pasa con TURN?]
El script de instalación configura automáticamente un servidor TURN para usted en el puerto 443 a través de TCP/UDP, por lo que normalmente no necesita abrir un puerto separado para ello.
:::

---

### Puertos de marcado SIP/VoIP

Si planea usar la función de marcado SIP/VoIP, también debe abrir los siguientes puertos para permitir la comunicación con su proveedor externo de troncales SIP.

| Puerto          | Protocolo | Requerido | Descripción                                                  |
| :------------ | :------- | :------- | :----------------------------------------------------------- |
| **5060-5061** | TCP      | **Sí**  | Puertos de señalización SIP.                                         |
| **5060-5061** | UDP      | **Sí**  | Puertos de señalización SIP.                                         |
| **10000-20000** | UDP      | **Sí**  | Rango de puertos de medios RTP (Protocolo de transporte en tiempo real) para audio. |

:::info[Más detalles]
Para una comprensión más profunda de los requisitos de red del gateway SIP y configuraciones avanzadas, consulte el [repositorio oficial de livekit/sip en GitHub](https://github.livekit/sip).
:::

---

## Guías de Proveedores de la Nube

La mayoría de los proveedores de la nube tienen una sección de "Grupo de seguridad" o "Firewall" donde puede crear estas reglas. Aquí hay enlaces a la documentación oficial de proveedores populares:

*   [Amazon AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html)
*   [Google Cloud](https://cloud.google.com/vpc/docs/using-firewalls)
*   [Microsoft Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/nsg-quickstart-portal)
*   [DigitalOcean](https://docs.digitalocean.com/products/networking/firewalls/how-to/configure-rules/)

---

## Probando su configuración (Opcional pero recomendado)

Antes de ejecutar el script de instalación principal, es una buena idea verificar que sus puertos estén abiertos. La herramienta `ncat` (una versión mejorada de `netcat`) es perfecta para esto.

### 1. En su servidor Plug-N-Meet

Primero, instale `ncat` y comience a escuchar en un puerto. Usaremos el puerto 443 como ejemplo.

```sh
# Instalar la herramienta
sudo apt update && sudo apt install -y nmap

# Escuchar tráfico TCP en el puerto 443
sudo ncat -l -p 443 --keep-open --verbose
```

El servidor ahora esperará una conexión.

### 2. Desde una computadora externa

En una *computadora diferente* (como su computadora portátil), use `ncat` para conectarse a su servidor. Reemplace `su_ip_de_servidor` con la dirección IP pública de su servidor.

```bash
# En macOS (con Homebrew) o Linux: brew install nmap
# On Windows: descargar de nmap.org

ncat su_ip_de_servidor 443 --verbose
```

Ahora, escriba `hola` y presione Enter.

### 3. Verifique los resultados

*   Si la conexión es **exitosa**, verá "Conexión recibida de [su_ip]" en su servidor, y aparecerá la palabra `hola`.
*   Si la conexión **falla** (se agota el tiempo o se rechaza), su regla de firewall es incorrecta. Verifique dos veces la configuración de su proveedor de la nube e intente nuevamente.

Puede repetir esta prueba para los otros puertos (`80`, `7881`) y para UDP agregando el flag `-u` (ej., `sudo ncat -u -l -p 50005 ...`).
