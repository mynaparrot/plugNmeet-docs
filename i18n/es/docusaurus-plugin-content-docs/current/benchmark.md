---
title: "Benchmarks de plugNmeet: ¿cuántos usuarios soporta una sala?"
description: "Resultados reales de pruebas de carga para videoconferencia autoalojada de código abierto: desde un portátil hasta un servidor con instalador único (20–500 usuarios sin fallos, límite ~900) y un clúster con 1.000 usuarios. Resumen en lenguaje sencillo más detalles técnicos."
keywords: [benchmark, prueba de carga, rendimiento, escalabilidad, 1000 usuarios, capacidad webinar, videoconferencia autoalojada, webrtc código abierto, escalado livekit, fan-out nats, tamaño aula virtual, alternativa BigBlueButton]
sidebar_label: Benchmarks
sidebar_position: 4
---

# ¿Cuántas personas puede gestionar plugNmeet? Lo hemos medido.

> Probado en septiembre de 2026 · servidor plugNmeet v2.5.1 · cliente v2.5.2 · [loadtester `09b2db0`](https://github.com/mynaparrot/plugnmeet-loadtester/commit/09b2db0238924d828b56d70b4dc2004b757388fa)

Solemos decir que plugNmeet es ligero y escalable. Afirmarlo es fácil, demostrarlo es más difícil — por eso lo hemos medido.

Llenamos salas reales con participantes simulados que se comportan como usuarios de navegador: entran, chatean, dibujan en la pizarra, levantan la mano, reaccionan y envían latidos (heartbeats). Después observamos qué ocurrió en tres escenarios que realmente le interesan:

1. **Un portátil haciendo todo** — el peor caso.
2. **Un servidor normal instalado con nuestro [script de instalación única](/docs/installation)** — lo que ejecuta la mayoría de quienes autoalojan.
3. **Un clúster de producción** — hacia donde se crece.

Si usted no tiene perfil técnico, la siguiente sección le cuenta lo esencial en 60 segundos. Si sí lo tiene, siga leyendo: encontrará tablas, latencias y cómo reproducirlo.

## Si solo tiene 60 segundos

Piense en una reunión como dos trabajos: **coordinar la reunión** (quién entró, chat, pizarra, reacciones) y **mover video y audio**. El primer trabajo le cuesta muy poco a plugNmeet. El segundo depende de cuántas cámaras estén encendidas a la vez.

Esto es lo que encontramos:

- **Una clase pequeña o reunión de equipo (20–100 personas en una sala): fácil.** Incluso un portátil lo gestiona. Un solo servidor responde en ~25–30 ms sin pérdidas.
- **Un webinar grande (300–500 personas en una sala, 1–2 cámaras encendidas y el resto mirando): cómodo en un servidor.** Ejecutamos 300 y 500 usuarios en una sola sala en un servidor de 4 vCore / 16 GB con **cero latidos perdidos, cero errores, entrega ~100%**. Añadir video en directo no rompió nada: el video se unió en ~350 ms y viajó en ~25 ms.
- **Muchas salas pequeñas van más desahogadas que una sala gigante.** 10 salas × 30 usuarios y 5 salas × 100 usuarios funcionaron a la perfección en el mismo servidor, con tiempos de respuesta algo mejores que metiendo a los 500 en una sola sala.
- **Alrededor de 900 personas en una sala es donde se detiene un servidor de 4 vCore.** Con 1.000 intentos de entrada, accedieron 901, 99 agotaron el tiempo de espera y empezaron a perderse latidos. El servidor no se cayó — simplemente se quedó sin margen.
- **1.000 personas en una sala interactiva es posible, pero no en una sola máquina.** En nuestro clúster gestionado funcionó sin fallos durante 18 minutos y sin retardo perceptible para dos personas reales que entraron con navegadores normales. Ese clúster utiliza un enrutamiento multimedia mult.servidor a medida que **no forma parte de la instalación open source en un solo servidor** (más detalles abajo).

En resumen: **empiece con un servidor y crezca solo cuando lo necesite.** La mayoría de centros educativos, creadores y equipos nunca necesitan más. Cuando lo necesite, siga la [guía de despliegue escalable](/docs/developer-guide/scalable-setup).

## Cómo leer esta página

- **Vía no técnica:** lea los resúmenes, la sección «qué significa esto para usted» y omita las tablas.
- **Vía técnica:** léalo todo, sobre todo [Metodología](#metodología-cómo-lo-probamos) y [Pruébelo usted mismo](#pruébelo-usted-mismo).

Tres términos aparecen en todas partes:

- **p50 / p95:** ordene todos los tiempos de respuesta de más rápido a más lento. **p50** es el del medio — la mitad fue más rápida. **p95** es el que superó a 95 de cada 100 — muestra a los pocos con peor suerte. Por debajo de ~100 ms se percibe como instantáneo.
- **Latidos perdidos (missed heartbeats):** cada usuario pregunta «¿sigues ahí?» cada 10 segundos. Perdidos = 0 significa que nadie perdió la conexión. Cualquier valor superior indica problemas.
- **Fan-out:** cuando una persona chatea o dibuja, el servidor debe entregarlo a todos los demás. 100% significa que nadie se perdió nada.

Una ejecución se considera limpia cuando: `joined == requested`, los errores muestran `none`, latidos perdidos = 0, reconexiones = 0, fan-out ≈ 100%.

## Los tres escenarios

### 1. Portátil (peor caso)

Un portátil Lenovo (i9-13900H, 32 GB RAM) ejecutó a la vez el servidor plugNmeet, el bus de mensajes NATS, la base de datos **y** todos los usuarios simulados. Deliberadamente injusto — si funciona aquí, funciona en hardware real.

### 2. Servidor único con instalador (el que ejecutará la mayoría)

Esta es la pieza que faltaba y que muchos pedían: un servidor normal configurado exactamente como describe la documentación, con la [Guía rápida de instalación](/docs/installation).

- **Servidor plugNmeet:** OVH `b3-16-flex`, 4 vCore, 16 GB RAM, Gravelines, Francia (GRA11). Instalación completa: servidor plugNmeet + LiveKit + NATS + Redis + MariaDB + HAProxy en una sola máquina. Grabador instalado pero **sin grabar** durante las pruebas.
- **Generador de carga:** otra máquina OVH aparte, 8 vCore, 32 GB RAM, Varsovia, Polonia (WAW1), con nuestro [plugnmeet-loadtester](https://github.com/mynaparrot/plugnmeet-loadtester) de código abierto.
- **¿Por qué dos ciudades?** Para incluir latencia real de internet. El tiempo de ida y vuelta base entre el generador y el servidor fue ~25–30 ms — similar a lo que vería una audiencia europea. No es un truco en localhost.
- **Ritmo de entrada:** 1 usuario por segundo a nivel global (300 usuarios requieren al menos 5 minutos; utilizamos 10 minutos, 2 minutos para salas pequeñas y 18 minutos para el impulso de 1.000 usuarios).

Sin ajustes especiales. Cortafuegos según la [guía de Firewall](/docs/firewall). ID de sala nuevo en cada ejecución.

### 3. Clúster de producción

Nuestro propio clúster en la nube en dos zonas, solo puntos de entrada públicos. Mismo código de aplicación que el open source, pero el enrutamiento multimedia utiliza una **configuración multi-LiveKit a medida** que reparte una sala entre varios servidores multimedia. La instalación open source ejecuta una sala en un solo nodo LiveKit — esa diferencia es clave para el titular de 1.000 usuarios. El uso de recursos se mantuvo bajo en todo momento — el sentido del clúster es el margen y el reparto, no un hardware al límite.

## Resultados: portátil

| Usuarios | Entraron | Errores | Perdidos | Latido p50 / p95 | CPU portátil | Proceso servidor |
|-------|--------|--------|--------|---------------------|------------|----------------|
| 20 | 20/20 | none | 0 | 6.0 / 9.6 ms | 8% | menos del 1% de un núcleo |
| 100 | 100/100 | none | 0 | 5.1 / 9.7 ms | 14% | 1.4% |
| 300 | 300/300 | none | 0 | 5.2 / 18.3 ms | 37% | 3.7% |
| 500 | 500/500 | none | 0 | 4.4 / 27.9 ms | 53% | 6.0% |
| 1000 | 795/1000 | 146 | 673 | 9.2 / 2,719 ms | 59% | 7.9% |

Traducción: **limpio hasta 500**, y con 1.000 fue el propio portátil el que se agotó mientras el proceso del servidor se mantuvo por debajo del 8% de un núcleo. El cuello de botella fue el banco de pruebas, no plugNmeet.

## Resultados: servidor único, solo actividad de reunión (sin video aún)

Mismo formato de webinar — chat, pizarra, bloc de notas, reacciones, manos, latidos — pero sin cámaras. Así se aísla el coste de «coordinar la reunión».

| Usuarios en una sala | Entraron | Perdidos | Latido p50 / p95 | Entrega chat p50 / p95 | Puntero pizarra p50 / p95 | Fan-out |
|-------------------|--------|--------|---------------------|-------------------------|------------------------------|---------|
| 20 | 20/20 | 0 | 27.8 / 53.1 ms | 26.3 / 26.5 ms | 26.1 / 26.5 ms | 100% |
| 50 | 50/50 | 0 | 27.4 / 53.5 ms | 26.2 / 26.9 ms | 26.1 / 26.8 ms | 100% |
| 100 | 100/100 | 0 | 28.0 / 52.8 ms | 26.0 / 27.4 ms | 26.1 / 27.6 ms | 100% |
| 300 | 300/300 | 0 | 27.9 / 44.2 ms | 26.5 / 33.3 ms | 26.2 / 33.2 ms | 100% |
| 500 | 500/500 | 0 | 33.8 / 103.1 ms | 27.7 / 43.4 ms | 27.8 / 44.4 ms | ~100% (chat 99.9%, resto 100%) |
| 1000 | 901/1000 | 8,109 | 163.8 / 7,734 ms | 73.2 / 224.5 ms | 71.3 / 188.4 ms | degradado |

Notas:

- 20–100 se ejecutaron 2 minutos cada uno, 300 y 500 durante 10 minutos, 1.000 durante 18 minutos.
- Con 500, todos entraron y ningún latido se perdió, pero los p95 empiezan a subir (latido p95 ~103 ms, lista de usuarios p50 ~73 ms, p95 ~180 ms). Es el servidor avisando de que va ocupado, no de que falla.
- Con 1.000, 99 usuarios fallaron con `initialData.timeout` y el resto vio respuestas de varios segundos. Techo honesto en esta máquina de 4 vCore: **alrededor de 900 en una sala solo para actividad de reunión**.
- En el lado del servidor, NATS, LiveKit y HAProxy fueron los procesos más ocupados (picos de 1–1.6 núcleos para el proxy/bus durante el fan-out), sin saturar los 4 núcleos. El proceso de la aplicación plugNmeet se mantuvo ligero — el trabajo pesado es copiar cada mensaje a todos, y eso lo hace NATS.

## Resultados: mismo servidor único, ahora con video en directo

Después activamos cámaras con `--media video`. Notación: `publishers=2v+5a` significa que 2 usuarios publican cámara+micro y 5 solo micro; `subscribers=100/300` significa que 100 de los 300 usuarios se conectan a LiveKit, los otros 200 solo generan actividad de reunión.

| Sala | Configuración video | Entraron | Perdidos | Núcleo (chat/puntero p50) | Entrada video p50 / p95 | Viaje video p50 / p95 | Fan-out |
|------|-------------|--------|--------|-------------------------|----------------------|------------------------|---------|
| 50 usuarios | 1 cámara, los 50 mirando | 50/50 | 0 | ~26 ms | 349 / 450 ms | 25.2 / 25.7 ms | 100% |
| 20 usuarios | 10 cámaras, los 20 mirando | 20/20 | 0 | ~26 ms | 350 / 450 ms | 25.2 / 25.4 ms | 100% |
| 300 usuarios | 2 cámaras, los 300 mirando | 300/300 | 0 | ~26 ms | 357 / 395 ms | 25.2 / 27.8 ms | 100% |
| 300 usuarios (mixto) | 2 cámaras + 5 micros, 100 en video, 200 solo actividad | 300/300 | 0 | ~26 ms | 351 / 448 ms | 25.2 / 27.6 ms | 100% |

Qué significa esto en palabras sencillas:

- **Mirar es barato, publicar cuesta.** Pasar de 1 a 10 publicadores, o de 50 a 300 espectadores, no movió las latencias del núcleo. La entrada a video se mantuvo en ~350 ms y el viaje en ~25 ms.
- **Sobre los avisos TURN en los registros de video.** En las ejecuciones en un solo servidor verá `Fail to refresh permissions` / `write: broken pipe` hacia el puerto 443. Es el TURN incluido en el instalador (compartiendo el puerto 443 TCP en la misma máquina) con dificultades para renovar desde un generador lejano por TCP. No afectó a estos resultados (0 perdidos, 100% fan-out). En nuestro clúster, que utiliza un servidor TURN dedicado, no vemos estos errores — una clusterización cuidadosa con TURN separado resuelve la mayor parte. Para video en producción, mantenga abierto UDP 50000–60000 según la [guía de Firewall](/docs/firewall) y separe TURN/medios como en [Despliegue escalable](/docs/developer-guide/scalable-setup).
- Aquí **no** probamos más de 50 publicadores simultáneos. Cada cámara en directo multiplica el trabajo multimedia, así que tome estas filas como formato «webinar» (pocos ponentes, muchos espectadores), no como «todos con cámara».

## Resultados: mismo servidor único, muchas salas pequeñas

Mismos 300 o 500 usuarios totales, pero repartidos. Así son las escuelas y productos SaaS reales, no una sala gigante.

| Distribución | Entraron | Perdidos | Latido p50 / p95 | Fan-out |
|--------|--------|--------|---------------------|---------|
| 10 salas × 30 usuarios (300 total) | 300/300 | 0 | 32.7 / 58.0 ms | 100% |
| 5 salas × 100 usuarios (500 total) | 500/500 | 0 | 29.2 / 77.9 ms | 100% |

Repartir ayuda: el fan-out por mensaje es menor, las listas son más cortas y los p95 se mantienen más estables que metiendo a los 500 en una sala. Si su caso es clases o reuniones de equipo, cite esta fila.

## Resultados: clúster, 1.000 en una sala

Para completar, el titular de nuestro clúster gestionado (enrutamiento multimedia a medida entre varios servidores, mismo código de aplicación en lo demás):

- Una sola sala, **2 cámaras web en directo**, todos mirando, pizarra + chat + reacciones + manos activos, **18 minutos**.
- **0 latidos perdidos** (58,161/58,161), **0 reconexiones**, **100% fan-out** en todo tipo de mensaje.
- Pizarra p50 ~15 ms, puntero ~29 ms, chat ~29 ms, latido ~68 ms, ida y vuelta de video ~5 ms en más de 114.000 muestras.
- Servidor de aplicación ~21% de un núcleo por nodo. Cada cliente absorbió ~78 mensajes/seg de forma sostenida.
- Dos personas reales entraron con navegadores normales: **sin retardo perceptible**.

No lo compare directamente con la fila de 1.000 usuarios en un solo servidor. La diferencia está en la capa multimedia: el clúster reparte una sala entre varios backends LiveKit; la instalación open source mantiene una sala en un solo nodo LiveKit. Todo lo demás (diseño NATS, API, separación del grabador) sigue la [guía de Despliegue escalable](/docs/developer-guide/scalable-setup).

## Qué significa esto para usted

- **20–100 en una sala:** basta cualquier VPS pequeño de la [guía de Instalación](/docs/installation). Pruebe con 2 vCPU / 4 GB y crezca si lo necesita.
- **300–500 en una sala (formato webinar):** un solo servidor de 4 vCore / 16 GB va desahogado. Si graba mucho, ponga el grabador en otra máquina — la transcodificación roba CPU a las reuniones en directo (véase [Despliegue escalable](/docs/developer-guide/scalable-setup)).
- **Más de 500 en total entre salas:** el mismo servidor único sigue valiendo (5 × 100 fue limpio). Escale en vertical antes de montar un clúster.
- **Más de ~900 en una sala interactiva:** planifique un clúster, o utilice el patrón emisión: estudio privado + RTMP hacia YouTube/Facebook, con invitados que suben al escenario desde la sala de espera. Véase [Hosting large-scale events](/blog/hosting-large-scale-events-the-smart-way).
- **Regla práctica de video:** los espectadores añaden poco; cada cámara/micro extra añade trabajo multimedia real. Coloque los servidores multimedia cerca de los participantes — la geografía importa más que la CPU para la calidad del video.
- **El ancho de banda importa más que la RAM.** Nuestros documentos de instalación recomiendan un mínimo de 100 Mbits/seg; más siempre es mejor para video.

## Límites honestos: lo que no probamos

- **Grabador ON frente a OFF:** todas las filas anteriores se ejecutaron con el grabador en reposo. Grabar + transcodificar en la misma máquina reduce la capacidad. Sepárelo primero.
- **Muchos publicadores, 1.000 con video, redes lentas/móviles, eventos de varias horas:** no cubierto aquí. Son buenas pruebas de «hágalo usted mismo» — la herramienta admite `--video-publishers`, `--audio-publishers`, `--subscribers`, `--rooms` y `--disable` para darles forma.
- **Techo multimedia open source en una sala:** el LiveKit open source mantiene una sala en un nodo multimedia. Por eso el impulso a 1.000 usuarios en un solo servidor se detuvo alrededor de 900 mientras el clúster a medida llegó más lejos. Si su producto son salas individuales enormes, reserve presupuesto para trabajo de clusterización multimedia.

Si necesita cifras de alguno de estos huecos antes de decidir, díganoslo — añadimos nuevos resultados a esta página según llegan.

## Metodología: cómo lo probamos

- **Herramienta:** [plugnmeet-loadtester](https://github.com/mynaparrot/plugnmeet-loadtester). Los usuarios simulados hablan el mismo protocolo HTTP + NATS-WebSocket que el cliente web, así que el servidor no los distingue. La opción `--media` activa LiveKit con video real de imagen fija negra.
- **Comportamiento por usuario:** protocolo de entrada (`verifyToken`, `getJoinToken`, `initialData`), latido cada 10 s, listas online/de usuarios, chat, puntero de pizarra + actualizaciones de escena, sincronización del bloc, reacciones, manos. Los cursores de pizarra dominan (~80%+ de los mensajes) — una audiencia real es más silenciosa, así que estos resultados son un límite inferior, no un techo.
- **Comandos (ejemplos):**
  ```bash
  # solo actividad de reunión, 500 en una sala
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-01 --users 500 --duration 10m

  # formato webinar: 300 usuarios, 2 cámaras, todos miran
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-video --users 300 --duration 10m \
    --media video --video-publishers 2 --subscribers 300

  # mixto: 300 usuarios, 2 cámaras + 5 micros, 100 en video
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-mixed --users 300 --duration 10m \
    --media video --video-publishers 2 --audio-publishers 5 --subscribers 100

  # muchas salas: 5 salas x 100 usuarios
  ./bin/loadtest --server https://your-server.example.com \
    --api-key YOUR_KEY --api-secret YOUR_SECRET \
    --room bench-multi --rooms 5 --users 100 --duration 10m
  ```
- **Reglas que seguimos:** `--room` nuevo en cada ejecución (las salas usadas bloquean entradas), `--join-rate 1/s` por defecto, dimensione el generador con ~10 MB RAM por usuario simulado, pruebe solo servidores propios.
- **Qué registramos:** `connect`, trámites de entrada, `ping`, RTT `delivery.*` + fan-out, `mediaJoin`/`mediaRtt` cuando hay video, además de CPU/RSS del generador y carga de la máquina. Referencia completa en el [README de la herramienta](https://github.com/mynaparrot/plugnmeet-loadtester).

## Pruébelo usted mismo

No necesita nuestro hardware. Instale con la [Guía rápida de instalación](/docs/installation), abra los [puertos del Firewall](/docs/firewall) y ejecute los comandos anteriores empezando en `--users 50` y duplicando. Deténgase cuando los latidos perdidos superen 0 o el fan-out baje de ~100% — ese es el límite honesto de su servidor para ese formato.

### Los números solos no bastan — entre con navegadores reales

El generador de carga le dice si el servidor aguantó. Solo una persona puede decirle si *se sintió* bien. Haga lo que hicimos nosotros: mezcle bots con al menos **2 usuarios reales en navegadores normales** en la misma sala mientras se ejecuta la prueba.

- Los bots aportan la carga (cientos de entradas, chat, avalancha de pizarra).
- Los usuarios reales comprueban lo que los bots no pueden: sincronización de la pizarra con sus propios ojos, fluidez del video, claridad del audio y si los clics se sienten instantáneos.

Basta con abrir la URL de la sala dos veces (dos portátiles, o un portátil + un teléfono) y usarla con normalidad mientras corren los bots. Si la pizarra sigue sincronizada y el audio/video se mantiene fluido, los números y la experiencia coinciden.

### Si puede, pruebe desde otra zona

Ejecute el generador y entre con los navegadores reales desde otra ciudad o red distinta a la del servidor — eso añade latencia real de internet, como su audiencia real. Nuestras ejecuciones en un solo servidor hicieron exactamente esto (servidor en Francia, generador en Polonia, base ~25–30 ms).

Una advertencia honesta: nuestro clúster gestionado añade **enrutamiento GEO** (cada usuario se conecta a la región multimedia más cercana), que no forma parte de la instalación open source en un solo servidor. Espere mayor latencia de video en la distancia con un solo servidor — eso es geografía, no un error. Coloque los servidores multimedia cerca de los participantes cuando importe.

Lecturas relacionadas: [Despliegue escalable](/docs/developer-guide/scalable-setup) · [Instalación](/docs/installation) · [Backend Architecture Deep Dive](/blog/backend-architecture-deep-dive) · [Scaling Architecture Saves Money](/blog/scaling-architecture-saves-money) · [Hosting large-scale events](/blog/hosting-large-scale-events-the-smart-way)
