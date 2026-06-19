---
title: "Implementación Escalable de PlugNmeet | Una Guía para Configuraciones Distribuidas"
description: "Una guía de alto nivel para escalar una implementación autoalojada de plugNmeet. Aprenda a crear una arquitectura distribuida y multiservidor con LiveKit, NATS y más en clúster para una alta disponibilidad."
keywords: [webrtc escalable, configuración distribuida, escalado de plugnmeet, alta disponibilidad, balanceo de carga, clúster de livekit, clúster de nats, clúster de redis, escalado autoalojado, webrtc empresarial]
sidebar_position: 4
sidebar_label: Implementación Escalable
---

# Escalado de su Implementación de PlugNmeet

Esta guía ofrece una visión general y estrategias recomendadas para escalar una implementación autoalojada de PlugNmeet, permitiéndole soportar un gran número de usuarios concurrentes a través de múltiples servidores.

### Antes de Empezar: Un Enfoque por Fases para el Escalado

Es fundamental comprender que una configuración totalmente distribuida y multiservidor es la más avanzada y compleja. Para muchos usuarios, existen estrategias de escalado más sencillas que pueden proporcionar el aumento de rendimiento necesario sin añadir una complejidad excesiva.

Recomendamos abordar el escalado en las siguientes fases:

#### Fase 1: Aislar el Grabador (El Cuello de Botella Más Común)

Para un rendimiento óptimo, especialmente si se graba con frecuencia, recomendamos encarecidamente implementar el **`plugnmeet-recorder` en un servidor dedicado**, separado de su instancia principal de `plugnmeet-server` y LiveKit.

*   **¿Por qué?** La grabación y el posprocesamiento (transcodificación) son tareas que consumen mucha CPU. Aislarlas evita que los trabajos de grabación afecten el rendimiento de sus reuniones en vivo.
*   **¿Cuándo?** Este debería ser su primer paso si nota una degradación del rendimiento durante las grabaciones activas.
*   **Requisitos Clave:** Al aislar el grabador, debe configurar un **almacenamiento de red compartido** para sus archivos de grabación y asignar una **ID única** a la instancia del grabador.
*   **Pasos Siguientes:** Para obtener instrucciones de configuración detalladas, consulte la sección [El Grabador de plugNmeet](#3-el-grabador-de-plugnmeet) más adelante en esta guía.

#### Fase 2: Escalar Verticalmente su Servidor Principal

Si no realiza grabaciones de forma intensiva pero sigue experimentando problemas de rendimiento, el siguiente paso es **escalar verticalmente** su servidor único. Esto simplemente significa añadir más núcleos de CPU y RAM. Un único servidor bien aprovisionado puede gestionar cómodamente a **cientos de usuarios concurrentes**.

#### Fase 3: Configuraciones Distribuidas Avanzadas

:::note[Para Implementaciones a Gran Escala y Avanzadas]

La mayoría de los usuarios **nunca** necesitarán ir más allá de la Fase 1 (aislar el grabador) y la Fase 2 (escalado vertical). Un único servidor bien aprovisionado puede gestionar un número muy grande de usuarios y operaciones concurrentes.

La arquitectura totalmente distribuida que se describe en el resto de esta guía está diseñada para implementaciones masivas a escala empresarial con requisitos de alta disponibilidad extremos. Solo debería considerar esta fase después de haber agotado las opciones de escalado vertical.

Cuando alcance esta escala, **recuerde que no es un proceso de todo o nada**. Puede escalar de forma incremental los componentes individuales (como LiveKit o NATS) según sea necesario, en lugar de agrupar todo a la vez. El resto de esta guía detalla la arquitectura conceptual para cuando necesite escalar cada componente.

:::

---

## Arquitectura Conceptual

En una configuración distribuida, los componentes principales de plugNmeet se separan en diferentes máquinas. Una arquitectura típica a gran escala se compone de:

1.  **Capas de Aplicación y Medios sin Estado:**
    *   Múltiples instancias de `plugnmeet-server`.
    *   Múltiples instancias del servidor de medios `LiveKit`.
    *   Un balanceador de carga estándar.
2.  **Capas de Infraestructura con Estado y en Clúster:**
    *   Un clúster de `NATS`.
    *   Un clúster de `Redis`.
    *   Un clúster de `MariaDB`.
3.  **Grabadores Escalados Horizontalmente:**
    *   Múltiples instancias de `plugnmeet-recorder`, potencialmente en diferentes modos operativos.
4.  **Almacenamiento de Archivos Compartido y Persistente:**
    *   Un sistema de archivos de red compartido (p. ej., NFS, Samba (CIFS), GlusterFS o un almacenamiento de objetos compatible con S3) accesible por todas las instancias de `plugnmeet-server` y `plugnmeet-recorder`. Este es un componente crítico que garantiza que las grabaciones, los archivos de análisis y las cargas de los usuarios estén disponibles de manera consistente en todo el clúster.

---

## Estrategia de Escalado de Componentes

La clave para una configuración distribuida exitosa es comprender cómo se escala cada componente. Los componentes se dividen en dos categorías principales: servicios sin estado, que pueden ser balanceados fácilmente, y servicios con estado, que requieren sus propias configuraciones de clúster específicas.

### 1. Capas de Aplicación y Medios sin Estado

Estos componentes pueden situarse detrás de un balanceador de carga estándar, cuya función principal es terminar las conexiones SSL y distribuir el tráfico inicial.

#### El Servidor plugNmeet: El Puesto de Mando Ligero

La aplicación principal `plugnmeet-server` está diseñada para ser un **puesto de mando** u orquestador ligero y sin estado. Delega intencionadamente todo el trabajo pesado: los medios son gestionados por LiveKit y la grabación por el `plugnmeet-recorder`.

Su responsabilidad principal es gestionar las solicitudes de la API, autenticar a los usuarios y coordinar la sesión a través de NATS. Debido a su bajo consumo de recursos (CPU y RAM), es increíblemente eficiente y fácil de escalar horizontalmente.

*   **Acción:** Puede ejecutar múltiples instancias en diferentes máquinas y situarlas detrás de un balanceador de carga L4 o L7 estándar, utilizando un algoritmo simple como round-robin o el de menor número de conexiones.
*   **Configuración:** Cada instancia debe configurarse para apuntar a la misma infraestructura compartida (NATS, Redis y MariaDB).

#### Servidor de Medios LiveKit

LiveKit también funciona detrás de un balanceador de carga para las conexiones iniciales.
*   **Acción:** El balanceador de carga puede terminar las conexiones SSL y redirigir la conexión inicial a cualquier nodo de LiveKit disponible.
*   **Nota Crítica:** Una vez establecida la conexión, la propia lógica de clúster interna de LiveKit se encarga de todo el enrutamiento complejo de medios. Es **esencial seguir la documentación oficial de LiveKit para la configuración de clústeres** para configurar el backend correctamente.
*   **Configuración del Firewall:** Asegúrese de que las reglas de su firewall permitan que los puertos TCP y UDP necesarios para el tráfico WebRTC lleguen a sus instancias de LiveKit. Para una lista detallada de los puertos requeridos, consulte nuestra **[Guía de Configuración del Firewall](/docs/firewall)**.
*   **Dependencia:** Se requiere una instancia de Redis, ya sea independiente o en clúster, para la agrupación de LiveKit.

**(Enlace: [Guía Oficial de Clústeres de LiveKit](https://docs.livekit.io/home/self-hosting/distributed))

---

### 2. Capas de Infraestructura con Estado y en Clúster

**Advertencia Crítica:** Los siguientes componentes tienen sus propios mecanismos robustos de clúster y descubrimiento de servicios. Colocarlos detrás de un balanceador de carga TCP/L4 simple y estándar sin una configuración avanzada y específica **probablemente causará inestabilidad en el sistema, corrupción de datos o un fallo completo.** Siga siempre la documentación oficial de clúster para estos servicios.

#### Sistema de Mensajería NATS

*   **Recomendación:** NATS tiene sus propias capacidades de clúster y enrutamiento de clientes. Sus clientes `plugnmeet-server` y `plugnmeet-recorder` deben configurarse con una lista de todos los nodos de NATS en el clúster. Los clientes gestionarán automáticamente la conmutación por error (failover).
*   **Acción:** Siga la **documentación oficial de NATS para crear un clúster**.

**(Enlace: [Documentación Oficial de Clústeres de NATS](https://docs.nats.io/running-a-nats-service/configuration/clustering/jetstream_clustering))

#### Base de Datos MariaDB

*   **Recomendación:** Para una alta disponibilidad, la base de datos debe estar en un clúster. Todas las instancias de `plugnmeet-server` deben apuntar al mismo clúster de base de datos.
*   **Acción:** Utilice un servicio de base de datos gestionado y de alta disponibilidad de un proveedor en la nube, o configure su propia solución, como un Clúster Galera de MariaDB. Siga la documentación oficial para la solución que elija.

**(Enlace: [Documentación Oficial de MariaDB](https://mariadb.com/docs/galera-cluster))

#### Caché de Redis

*   **Recomendación:** Para un clúster de plugNmeet y LiveKit de alta disponibilidad, su instancia de Redis también debe ser de alta disponibilidad.
*   **Acción:** Utilice un servicio de Redis gestionado o configure su propio Clúster de Redis o una configuración con Sentinel. Sus nodos de plugNmeet y LiveKit deben configurarse para conectarse directamente a este clúster.

**(Enlace: [Documentación Oficial de Clústeres con Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel))

---

### 3. El Grabador de plugNmeet

El `plugnmeet-recorder` es un caso especial. Aunque tiene estado durante un trabajo, su descubrimiento y balanceo de carga se gestionan automáticamente.

*   **Balanceo de Carga y Descubrimiento:** El grabador **no** requiere un balanceador de carga externo. Los grabadores anuncian automáticamente su disponibilidad a través de NATS, y el `plugnmeet-server` distribuye los trabajos entre ellos.

*   **Modos Operativos:** El `plugnmeet-recorder` admite diferentes modos operativos, lo que permite una arquitectura altamente escalable y resiliente. Cada instancia se puede configurar mediante el ajuste `mode` en `config.yaml`:
    *   **`recorderOnly`:** Esta instancia se dedicará *exclusivamente* a la grabación de sesiones en vivo. Una vez que captura un archivo de grabación en bruto, publica un trabajo de transcodificación en una cola y queda inmediatamente disponible para la siguiente sesión en vivo. Esto es ideal para sus servidores de grabación principales, ya que los mantiene ligeros y receptivos.
    *   **`transcoderOnly`:** Esta instancia se dedicará *exclusivamente* a procesar trabajos de transcodificación. Se suscribe a la cola de trabajos, realiza la conversión intensiva en CPU de los archivos en bruto a MP4 y no gestiona ninguna grabación en vivo. Puede ejecutar una flota de estos trabajadores en máquinas virtuales más económicas y optimizadas para CPU para procesar grabaciones en paralelo sin afectar a las reuniones en vivo.
    *   **`both` (Predeterminado):** Una única instancia realiza tanto la grabación en vivo como la transcodificación. Es adecuado para configuraciones más pequeñas o si graba con poca frecuencia.

*   **Configuración:**
    *   Cada instancia de grabador debe configurarse para conectarse al mismo clúster de NATS.
    *   A cada instancia de grabador **se le debe** asignar una `id` única en su `config.yaml`, en la sección `recorder` (p. ej., `recorder.id: "recorder-node-1"`). El `plugnmeet-server` utiliza esta ID para rastrear y comunicarse con los trabajadores individuales. Es especialmente crítico para los modos `recorderOnly` y `both`, y muy recomendable para todas las instancias para un registro e identificación claros.

:::warning[Responsabilidad del Administrador]

Es **su responsabilidad** asegurarse de que cada instancia de grabador tenga una `id` globalmente única. El `plugnmeet-server` **no** valida la unicidad de estas IDs.

Si varios grabadores comparten la misma ID, todos intentarán aceptar el mismo trabajo de grabación de la cola de NATS. Esta condición de carrera provocará que el trabajo falle, ya que ninguna de las instancias podrá adquirir el bloqueo necesario. Este escenario es extremadamente difícil de depurar, ya que el único síntoma puede ser que las grabaciones fallen de forma intermitente al iniciarse.

:::

*   **Acción:** Para una configuración detallada, consulte el **README oficial del repositorio `plugnmeet-recorder`**.

**(Enlace: [README Oficial de plugNmeet-recorder](https://github.com/mynaparrot/plugNmeet-recorder))

---

### 4. Sistema de Archivos Compartido: Un Requisito Crítico para la Consistencia de los Datos

En un entorno distribuido, es **absolutamente crítico** que todos los servidores sin estado tengan una forma consistente de acceder a los archivos persistentes. Sin esto, sus usuarios experimentarán funciones rotas, como descargas de archivos que no se encuentran o grabaciones inaccesibles.

Existen dos enfoques principales para lograrlo: un sistema de archivos compartido tradicional o el sistema de hooks, más moderno y flexible.

#### Opción 1: Sistema de Archivos Compartido Tradicional

Puede montar una solución de almacenamiento de red compartida (como **NFS**, **Samba (CIFS)**, **GlusterFS** o un **almacén de objetos compatible con S3** montado como sistema de archivos) en la misma ruta en **todas** sus instancias de `plugnmeet-server` y `plugnmeet-recorder`.

Las siguientes rutas en su `config.yaml` deben apuntar a esta ubicación compartida:

*   `recorder_info.recording_files_path`
*   `artifacts_settings.storage_path`
*   `upload_file_settings.path`

#### Opción 2: El Sistema de Hooks (Recomendado para Implementaciones Nativas de la Nube)

:::tip[Alternativa a los Sistemas de Archivos Compartidos]
Para un enfoque más flexible y nativo de la nube, puede utilizar el sistema de **[Hooks de Scripting y Almacenamiento](/docs/others/hooks)** en lugar de un sistema de archivos compartido. Este es el método recomendado para gestionar grabaciones y artefactos en un entorno escalable.

Con los hooks, puede integrarse directamente con servicios de almacenamiento de objetos como **AWS S3**, **Google Cloud Storage** o **MinIO**.

*   **Para Grabaciones:** Su hook `post_transcoding` en el grabador sube el MP4 final a su almacenamiento de objetos y devuelve un identificador único (como una clave de S3).
*   **Para Artefactos y Descargas:** Su `upload_hook` en el servidor sube los artefactos al mismo almacenamiento de objetos. Sus `download_hook` y `delete_hook` en el servidor utilizan entonces el identificador almacenado para generar enlaces de descarga seguros o eliminar archivos directamente del almacenamiento de objetos.

Este enfoque elimina la necesidad de gestionar un disco de red compartido, que a menudo es más complejo y menos escalable que utilizar un servicio de almacenamiento de objetos dedicado.
:::

---

## Configuración

Una vez que su infraestructura distribuida esté implementada, simplemente necesita actualizar su archivo `config.yaml` de cada instancia de `plugnmeet-server` para que apunte a los nuevos servicios del clúster.

```yaml
# Fragmento de configuración de ejemplo
redis_info:
  host: "su-endpoint-del-cluster-redis:6379"
  # ... otras configuraciones de redis

database_info:
  host: "su-endpoint-del-cluster-mariadb"
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
  host: "http://su-endpoint-de-livekit" # El endpoint para su clúster de LiveKit
  # ... otras configuraciones de livekit
```

Siguiendo esta guía conceptual y aprovechando la documentación oficial de cada componente, podrá construir una implementación de plugNmeet robusta y escalable, capaz de soportar una base de usuarios masiva.
