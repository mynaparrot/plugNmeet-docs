---
title: "Implementación Escalable de PlugNmeet | Una Guía para Configuraciones Distribuidas"
description: "Una guía de alto nivel para escalar una implementación autoalojada de plugNmeet. Aprenda a crear una arquitectura distribuida y multiservidor con LiveKit, NATS y más en clúster para una alta disponibilidad."
keywords: [webrtc escalable, configuración distribuida, escalado de plugnmeet, alta disponibilidad, balanceo de carga, clúster de livekit, clúster de nats, clúster de redis, escalado autoalojado, webrtc empresarial]
sidebar_position: 4
sidebar_label: Implementación Escalable
---

# Escalando su Implementación de PlugNmeet

Esta guía proporciona una descripción general de alto nivel y estrategias recomendadas para escalar una implementación autoalojada de plugNmeet para soportar un gran número de usuarios concurrentes en múltiples servidores.

### Antes de Empezar: Un Enfoque por Fases para el Escalado

Es fundamental entender que una configuración totalmente distribuida y multiservidor es la configuración más avanzada y compleja. Para muchos usuarios, estrategias de escalado más simples pueden proporcionar el aumento de rendimiento necesario sin la complejidad añadida.

Recomendamos abordar el escalado en fases:

#### Fase 1: Aislar el Grabador (El Cuello de Botella Más Común)

Para un rendimiento óptimo, especialmente al grabar con frecuencia, recomendamos encarecidamente implementar el **`plugnmeet-recorder` en un servidor dedicado**, separado de su instancia principal de `plugnmeet-server` y LiveKit.

*   **¿Por qué?** La grabación y el posprocesamiento (transcodificación) son tareas intensivas en CPU. Aislarlas evita que los trabajos de grabación afecten el rendimiento de sus reuniones en vivo.
*   **¿Cuándo?** Este debería ser su primer paso si nota una degradación del rendimiento durante las grabaciones activas.
*   **Requisitos Clave:** Cuando aísla el grabador, debe configurar un **almacenamiento de red compartido** para sus archivos de grabación y asignar una **ID única** a la instancia del grabador.
*   **Pasos Siguientes:** Para obtener instrucciones de configuración detalladas, consulte la sección [El Grabador de plugNmeet](#3-el-grabador-de-plugnmeet) más adelante en esta guía.

#### Fase 2: Escalar Verticalmente su Servidor Principal

Si no está grabando mucho pero aún ve problemas de rendimiento, el siguiente paso es **escalar verticalmente** su único servidor. Esto simplemente significa agregar más núcleos de CPU y RAM. Un único servidor bien aprovisionado puede manejar cómodamente **cientos de usuarios concurrentes**.

#### Fase 3: Configuraciones Distribuidas Avanzadas

:::note[Para Implementaciones a Gran Escala y Avanzadas]

La mayoría de los usuarios **nunca** necesitarán ir más allá de la Fase 1 (aislar el grabador) y la Fase 2 (escalar verticalmente). Un único servidor bien aprovisionado puede manejar un número muy grande de usuarios y operaciones concurrentes.

La arquitectura totalmente distribuida que se describe en el resto de esta guía está diseñada para implementaciones masivas a escala empresarial con requisitos de alta disponibilidad extremos. Solo debe considerar esta fase después de haber agotado las opciones de escalado vertical.

Cuando alcance esta escala, **recuerde que no es un proceso de todo o nada**. Puede escalar incrementalmente componentes individuales (como LiveKit o NATS) según sea necesario, en lugar de agrupar todo a la vez. El resto de esta guía detalla la arquitectura conceptual para cuando necesite escalar cada parte.

:::

---

## Arquitectura Conceptual

En una configuración distribuida, los componentes principales de plugNmeet se separan en diferentes máquinas. Una arquitectura típica a gran escala consta de:

1.  **Capas de Aplicación y Medios sin Estado:**
    *   Múltiples instancias de `plugnmeet-server`.
    *   Múltiples instancias de servidor de medios `LiveKit`.
    *   Un balanceador de carga estándar.
2.  **Capas de Infraestructura con Estado y en Clúster:**
    *   Un clúster de `NATS`.
    *   Un clúster de `Redis`.
    *   Un clúster de `MariaDB`.
3.  **Grabadores Escalados Horizontalmente:**
    *   Múltiples instancias de `plugnmeet-recorder`, potencialmente en diferentes modos operativos.
4.  **Almacenamiento de Archivos Compartido y Persistente:**
    *   Un sistema de archivos de red compartido (p. ej., NFS, Samba (CIFS), GlusterFS o compatible con S3) accesible por todas las instancias de `plugnmeet-server` y `plugnmeet-recorder`. Este es un componente crítico que garantiza que las grabaciones, los archivos de análisis y las cargas de los usuarios estén disponibles de manera consistente en todo el clúster.

---

## Estrategia de Escalado de Componentes

La clave para una configuración distribuida exitosa es comprender cómo se escala cada componente. Los componentes se dividen en dos categorías principales: servicios sin estado que se pueden balancear fácilmente y servicios con estado que requieren sus propias configuraciones de clúster específicas.

### 1. Capas de Aplicación y Medios sin Estado

Estos componentes se pueden colocar detrás de un balanceador de carga estándar, cuya función principal es terminar SSL y distribuir el tráfico inicial.

#### El Servidor plugNmeet: El Puesto de Mando Ligero

La aplicación principal `plugnmeet-server` está diseñada para ser un **puesto de mando** u orquestador ligero y sin estado. Delega intencionalmente todo el trabajo pesado: los medios son manejados por LiveKit y la grabación es manejada por el `plugnmeet-recorder`.

Su responsabilidad principal es manejar las solicitudes de la API, autenticar a los usuarios y coordinar la sesión general a través de NATS. Debido a que utiliza muy pocos recursos (CPU y RAM), es increíblemente eficiente y fácil de escalar horizontalmente.

*   **Acción:** Puede ejecutar múltiples instancias en diferentes máquinas y colocarlas detrás de un balanceador de carga L4 o L7 estándar utilizando un algoritmo simple como round-robin o menos conexiones.
*   **Configuración:** Cada instancia debe configurarse para apuntar a la misma infraestructura compartida (NATS, Redis y MariaDB).

#### Servidor de Medios LiveKit

LiveKit también funciona detrás de un balanceador de carga para las conexiones iniciales.
*   **Acción:** El balanceador de carga puede terminar SSL y redirigir la conexión inicial a cualquier nodo de LiveKit disponible.
*   **Nota Crítica:** Una vez que se establece la conexión, la propia lógica de clúster interna de LiveKit maneja todo el enrutamiento de medios complejo. Es **esencial seguir la documentación oficial de LiveKit para la agrupación en clústeres** para configurar el backend correctamente.
*   **Configuración del Firewall:** Asegúrese de que las reglas de su firewall permitan que los puertos TCP y UDP necesarios para el tráfico WebRTC lleguen a sus instancias de LiveKit. Para obtener una lista detallada de los puertos requeridos, consulte nuestra **[Guía de Configuración del Firewall](/docs/firewall)**.
*   **Dependencia:** Se requiere una instancia de Redis independiente o en clúster para la agrupación en clústeres de LiveKit.

**(Enlace: [Guía Oficial de Agrupación en Clústeres de LiveKit](https://docs.livekit.io/home/self-hosting/distributed))

---

### 2. Capas de Infraestructura con Estado y en Clúster

**Advertencia Crítica:** Los siguientes componentes tienen sus propios mecanismos robustos de agrupación en clústeres y descubrimiento de servicios. Colocarlos detrás de un balanceador de carga TCP/L4 simple y estándar sin una configuración avanzada y específica es **altamente probable que cause inestabilidad del sistema, corrupción de datos o una falla completa.** Siga siempre la documentación oficial de agrupación en clústeres para estos servicios.

#### Sistema de Mensajería NATS

*   **Recomendación:** NATS tiene sus propias capacidades de agrupación en clústeres y enrutamiento de clientes. Sus clientes `plugnmeet-server` y `plugnmeet-recorder` deben configurarse con una lista de todos los nodos de NATS en el clúster. Los clientes manejarán automáticamente la conmutación por error.
*   **Acción:** Siga la **documentación oficial de NATS para crear un clúster**.

**(Enlace: [Documentación Oficial de Agrupación en Clústeres de NATS](https://docs.nats.io/running-a-nats-service/configuration/clustering/jetstream_clustering))

#### Base de Datos MariaDB

*   **Recomendación:** Para una alta disponibilidad, la base de datos debe estar en clúster. Todas las instancias de `plugnmeet-server` deben apuntar al mismo clúster de base de datos.
*   **Acción:** Utilice un servicio de base de datos administrado y de alta disponibilidad de un proveedor de la nube, o configure su propia solución como un Clúster Galera de MariaDB. Siga la documentación oficial para la solución elegida.

**(Enlace: [Documentación Oficial de MariaDB](https://mariadb.com/docs/galera-cluster))

#### Caché de Redis

*   **Recomendación:** Para un clúster de plugNmeet y LiveKit de alta disponibilidad, su instancia de Redis también debe ser de alta disponibilidad.
*   **Acción:** Utilice un servicio de Redis administrado o configure su propio Clúster de Redis o configuración Sentinel. Sus nodos de plugNmeet y LiveKit deben configurarse para conectarse a este clúster directamente.

**(Enlace: [Documentación Oficial de Agrupación en Clústeres de Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel))

---

### 3. El Grabador de plugNmeet

El `plugnmeet-recorder` es un caso especial. Si bien tiene estado durante un trabajo, su descubrimiento y balanceo de carga se manejan automáticamente.

*   **Balanceo de Carga y Descubrimiento:** El grabador **no** requiere un balanceador de carga externo. Los grabadores anuncian automáticamente su disponibilidad a través de NATS, y el `plugnmeet-server` les distribuye los trabajos.

*   **Modos Operativos:** El `plugnmeet-recorder` admite diferentes modos operativos, lo que permite una canalización altamente escalable y resistente. Cada instancia se puede configurar a través del ajuste `mode` en `config.yaml`:
    *   **`recorderOnly`:** Esta instancia *solo* manejará la grabación de sesiones en vivo. Una vez que se captura un archivo de grabación sin procesar, publica un trabajo de transcodificación en una cola e inmediatamente se vuelve disponible para la siguiente sesión en vivo. Esto es ideal para sus servidores de grabación principales, ya que los mantiene ligeros y receptivos.
    *   **`transcoderOnly`:** Esta instancia *solo* procesará trabajos de transcodificación. Se suscribe a la cola de trabajos, realiza la conversión intensiva en CPU de archivos sin procesar a MP4 y no maneja ninguna grabación en vivo. Puede ejecutar una flota de estos trabajadores en máquinas virtuales más baratas y optimizadas para CPU para procesar grabaciones en paralelo sin afectar las reuniones en vivo.
    *   **`both` (Predeterminado):** Una única instancia realiza tanto la grabación en vivo como la transcodificación. Esto es adecuado para configuraciones más pequeñas o si graba con poca frecuencia.

*   **Configuración:**
    *   Cada instancia de grabador debe configurarse para conectarse al mismo clúster de NATS.
    *   A cada instancia de grabador **se le debe** asignar una `id` única en su `config.yaml` en la sección `recorder` (p. ej., `recorder.id: "recorder-node-1"`). El `plugnmeet-server` utiliza esta ID para rastrear y comunicarse con los trabajadores individuales. Es especialmente crítico para los modos `recorderOnly` y `both`, y muy recomendable para todas las instancias para un registro e identificación claros.

:::warning[Responsabilidad del Administrador]

Es **su responsabilidad** asegurarse de que cada instancia de grabador tenga una `id` globalmente única. El `plugnmeet-server` **no** valida la unicidad de estas ID.

Si varios grabadores comparten la misma ID, todos intentarán aceptar el mismo trabajo de grabación de la cola de NATS. Esta condición de carrera hará que el trabajo falle, ya que ninguna de las instancias podrá adquirir el bloqueo necesario. Este escenario es extremadamente difícil de depurar, ya que el único síntoma puede ser que las grabaciones fallen intermitentemente al iniciarse.

:::

*   **Acción:** Para una configuración detallada, consulte el **README oficial del repositorio `plugnmeet-recorder`**.

**(Enlace: [README Oficial de plugNmeet-recorder](https://github.com/mynaparrot/plugNmeet-recorder))

---

### 4. Sistema de Archivos Compartido: Un Requisito Crítico para la Consistencia de los Datos

En un entorno distribuido donde las solicitudes pueden ser manejadas por cualquier instancia de `plugnmeet-server`, es **absolutamente crítico** que todos los servidores sin estado tengan acceso a un sistema de archivos compartido para almacenar y recuperar archivos persistentes. Sin esto, sus usuarios experimentarán funciones rotas como descargas de archivos faltantes o grabaciones inaccesibles.

Debe montar una solución de almacenamiento de red compartida (como **NFS**, **Samba (CIFS)**, **GlusterFS** o un **almacén de objetos compatible con S3** montado como un sistema de archivos) en la misma ruta en **todas** sus instancias de `plugnmeet-server` y `plugnmeet-recorder`.

Las siguientes rutas en su `config.yaml` deben apuntar a esta ubicación compartida:

*   **`recorder_info.recording_files_path`**: Las instancias de `plugnmeet-recorder` escriben archivos MP4 aquí, pero **todas** las instancias de `plugnmeet-server` necesitan acceso de lectura para atender las solicitudes de descarga a través de la API.
*   **`artifacts_settings.storage_path`**: Cuando finaliza una sala, cualquier `plugnmeet-server` puede escribir un archivo de artefactos. Más tarde, una solicitud para descargar ese archivo podría ser manejada por un servidor diferente, que necesita poder leerlo.
*   **`upload_file_settings.path`**: Cuando un usuario carga un archivo en el chat, la solicitud puede ser manejada por un servidor. Cuando otro usuario intenta descargarlo, esa solicitud podría ir a cualquier otro servidor del clúster.

---

## Configuración

Una vez que su infraestructura distribuida esté en su lugar, simplemente necesita actualizar su archivo `config.yaml` para cada instancia de `plugnmeet-server` para que apunte a los nuevos servicios en clúster.

```yaml
# Fragmento de configuración de ejemplo
redis_info:
  host: "su-punto-final-de-clúster-redis:6379"
  # ... otras configuraciones de redis

database_info:
  host: "su-punto-final-de-clúster-mariadb"
  port: 3306
  username: "su_usuario"
  password: "su_contraseña"
  db: "plugnmeet"

nats_info:
  nats_urls:
    - "nats://nodo1.su-dominio.com:4222"
    - "nats://nodo2.su-dominio.com:4222"
    - "nats://nodo3.su-dominio.com:4222"

livekit_info:
  host: "http://su-punto-final-de-livekit" # El punto final para su clúster de LiveKit
  # ... otras configuraciones de livekit
```

Siguiendo esta guía conceptual y aprovechando la documentación oficial de cada componente, puede construir una implementación de plugNmeet robusta y escalable capaz de soportar una base de usuarios masiva.
