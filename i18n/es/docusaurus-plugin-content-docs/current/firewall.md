---
title: Guía de Configuración de Firewall para Plug-N-Meet
description: Aprenda a configurar su firewall y NAT para un servidor Plug-N-Meet autoalojado, incluyendo los puertos TCP/UDP necesarios para WebRTC, TURN y HTTPS.
keywords: [firewall, puertos, redes, nat, turn, stun, udp, tcp, puertos webrtc, sip, voip]
sidebar_position: 2
sidebar_label: Firewall y Puertos
---

# Configuración de Firewall y Puertos

Una configuración correcta del firewall es el paso más crítico para una instalación exitosa de Plug-N-Meet. Si su servidor se encuentra detrás de un firewall o un sistema NAT (como ocurre con casi todos los proveedores de nube como AWS, Google Cloud, Azure, etc.), es indispensable asegurarse de que los puertos adecuados estén abiertos para permitir que el tráfico llegue al servidor.

Esta guía le mostrará qué puertos debe abrir y cómo verificar su configuración.

---

## Puertos Requeridos

Debe permitir el tráfico entrante en los siguientes puertos:

| Puerto          | Protocolo | Requerido | Descripción                                                  |
| :------------ | :------- | :------- | :----------------------------------------------------------- |
| **80**        | TCP      | **Sí**  | Requerido por Let's Encrypt para emitir certificados SSL.         |
| **443**       | TCP      | **Sí**  | El puerto HTTPS principal para todo el tráfico de la aplicación y la API.  |
| **7881**      | TCP      | **Sí**  | Un puerto de respaldo para los medios WebRTC cuando UDP está bloqueado.        |
| **50000-60000** | UDP      | **Sí**  | El rango de puertos principal para todos los medios de audio y video de WebRTC. |

:::info ¿Y qué hay de TURN?
El script de instalación configura automáticamente un servidor TURN en el puerto 443 a través de TCP/UDP, por lo que normalmente no necesita abrir un puerto separado para ello.
:::

---

### Puertos para Marcación SIP/VoIP

Si planea utilizar la función de marcación SIP/VoIP, también debe abrir los siguientes puertos para permitir la comunicación con su proveedor externo de troncales SIP.

| Puerto          | Protocolo | Requerido | Descripción                                                  |
| :------------ | :------- | :------- | :----------------------------------------------------------- |
| **5060-5061** | TCP      | **Sí**  | Puertos de señalización SIP.                                         |
| **5060-5061** | UDP      | **Sí**  | Puertos de señalización SIP.                                         |
| **10000-20000** | UDP      | **Sí**  | Rango de puertos para medios RTP (Protocolo de Transporte en Tiempo Real) para el audio. |

:::info Para más detalles
Para una comprensión más profunda de los requisitos de red de la pasarela SIP y configuraciones avanzadas, consulte el [repositorio oficial de livekit/sip en GitHub](https://github.com/livekit/sip).
:::

---

## Guías de Proveedores de Nube

La mayoría de los proveedores de nube tienen una sección de "Grupo de Seguridad" o "Firewall" donde puede crear estas reglas. Aquí tiene enlaces a la documentación oficial de los proveedores más populares:

*   [Amazon AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html)
*   [Google Cloud](https://cloud.google.com/vpc/docs/using-firewalls)
*   [Microsoft Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/nsg-quickstart-portal)
*   [DigitalOcean](https://docs.digitalocean.com/products/networking/firewalls/how-to/configure-rules/)

---

## Probando su Configuración (Opcional pero Recomendado)

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

En una *computadora diferente* (como su portátil), use `ncat` para conectarse a su servidor. Reemplace `su_ip_de_servidor` con la dirección IP pública de su servidor.

```bash
# En macOS (con Homebrew) o Linux: brew install nmap
# En Windows: descargar desde nmap.org

ncat su_ip_de_servidor 443 --verbose
```

Ahora, escriba `hola` y presione Enter.

### 3. Verifique los resultados

*   Si la conexión es **exitosa**, verá "Conexión recibida de [su_ip]" en su servidor, y aparecerá la palabra `hola`.
*   Si la conexión **falla** (se agota el tiempo de espera o es rechazada), su regla de firewall es incorrecta. Revise la configuración de su proveedor de nube e inténtelo de nuevo.

Puede repetir esta prueba para los otros puertos (`80`, `7881`) y para UDP agregando la bandera `-u` (ej., `sudo ncat -u -l -p 50005 ...`).
