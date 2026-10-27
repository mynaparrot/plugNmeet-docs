---
title: Integración de plugNmeet con Joomla | Agregue Reuniones de Video a su Sitio
description: Cómo instalar y configurar el componente plugNmeet para agregar reuniones de video autoalojadas y funciones de conferencia a su sitio web de Joomla.
keywords: [joomla, integración con joomla, componente de joomla, videoconferencia en joomla, webrtc en joomla]
sidebar_position: 6
sidebar_label: Integración con Joomla
---

# Cómo Añadir Videoconferencias a Joomla con la Extensión Plug-N-Meet

Esta guía cubre el componente plugNmeet para Joomla. Ofrece las mismas funciones completas que los plugins de WordPress y Moodle: control total de salas, grabaciones con fusión, artefactos con exportación de analíticas y acceso basado en permisos de Joomla, todo dentro de su sitio.

---

## 1. Funciones Principales de la Integración con Joomla

- **Control total de salas:** Cree salas con todas las funciones de plugNmeet: sala de espera, salas de grupos, encuestas, pizarra, cifrado de extremo a extremo, acceso telefónico SIP e Insights con IA (transcripción, traducción de chat y resumen automático).
- **Gestión interna:** Administre salas, grabaciones y artefactos desde **Componentes > Plug N Meet**, sin salir de Joomla.
- **Grabaciones con fusión:** Liste, reproduzca, descargue, elimine y **fusione varios segmentos** en un solo MP4 desde la pantalla de Grabaciones.
- **Artefactos y analíticas:** Consulte informes de analíticas, transcripciones y resúmenes con IA por sala. Descargue las analíticas en Excel.
- **Publicación nativa de Joomla:** Las salas son elementos como artículos, con categorías y dos tipos de menú: **Sala única** y **Lista de salas**.
- **Acceso por permisos:** Controle quién puede entrar sin contraseña, quién entra como moderador y quién puede ver, reproducir, descargar o eliminar grabaciones en cada sala mediante la ACL de Joomla.

## 2. Instalación y Configuración Inicial

### Paso 2.1: Instalar la Extensión

- Desde el panel de administración de Joomla, vaya a **Sistema > Instalar > Extensiones**.
- Seleccione la pestaña **Instalar desde la Web** y busque **plugnmeet**.
- Encuentre la extensión oficial de Plug-N-Meet y haga clic en **Instalar**.

![Joomla-install.png](/img/Joomla/Joomla-install.png)

- Tras unos instantes verá la confirmación de instalación correcta.

![Joomla-success.png](/img/Joomla/Joomla-success.png)

Como alternativa, descargue el paquete desde [versiones de plugNMeet-Joomla en GitHub](https://github.com/mynaparrot/plugNMeet-Joomla) e instálelo con **Subir Archivo de Paquete**.

### Paso 2.2: Conectar con su Servidor (Ajustes de API)

Este es el paso más importante. Debe conectar la extensión a un servidor plugNmeet operativo.

- Desde el panel de administración vaya a **Sistema > Configuración Global**.
- En el menú lateral seleccione **plugNmeet**.

![Joomla-plugin-config.png](/img/Joomla/Joomla-plugin-config.png)

- Verá: **URL del Servidor**, **Clave de API**, **Secreto de API** y **Carga del cliente** (`Remoto` o `Redirección`).
- Tras la instalación vienen rellenados con credenciales de demostración. **Sustitúyalos por los datos de su propio servidor autoalojado o de plugNmeet Cloud.** El servidor demo solo sirve para pruebas temporales y tiene limitaciones.
- **Carga del cliente:** `Remoto` (predeterminado) mantiene la reunión integrada en su sitio Joomla. `Redirección` lleva al usuario a la interfaz de su servidor plugNmeet (`url-servidor/?access_token=...`), fuera del diseño de su sitio. Joomla no ofrece cliente Local como WordPress.

![Joomla-plugnmeet-config.png](/img/Joomla/Joomla-plugnmeet-config.png)

- Tras introducir sus credenciales, pulse **Guardar**.
- Aquí también están los valores globales: **Copyright** (marca del pie), **Diseño** (logotipo, colores, fondo, CSS personalizado) y **Avanzado** (simulcast, dynacast, resoluciones, preajuste de audio, códec). Las salas los heredan salvo que los cambie por sala.

---

## 3. Creación y Publicación de su Primera Reunión

### Paso 3.1: Organizar con Categorías (Opcional)

Las salas pueden agruparse con las categorías de Joomla:

- Vaya a **Componentes > Plug N Meet > Categorías de Salas** y cree categorías (por ejemplo, Clases, Reuniones).
- Asigne la categoría en el campo **Categoría** al crear la sala.
- El tipo de menú **Lista de salas** puede filtrar por una categoría.

### Paso 3.2: Crear una Sala de Reuniones

- Desde el panel de administración vaya a **Componentes > Plug N Meet > Administrar Salas**.
- Pulse **+ Nuevo** para crear una sala.

![Joomla-12.png](/img/Joomla/Joomla-12.png)

El formulario de sala incluye estas pestañas:

**Básico**
- **Título, categoría y descripción:** el título se muestra en el sitio; la descripción aparece en la página de la sala.
- **Contraseñas:** separadas para **Moderador** y **Asistente**. Deben ser distintas.
- **Mensaje de bienvenida:** se muestra en el chat al entrar.
- **Máximo de participantes:** `0` para ilimitado.

**Funciones de Sala**
Opciones principales: cámaras web, silenciar al entrar, compartir pantalla, ver otras cámaras o la lista de usuarios, solo cámaras de administradores, analíticas, fondo virtual, levantar la mano, reacciones, generar ID de usuario y duración de la sala (minutos, `0` = sin límite). **El moderador entra primero:** si se activa, los asistentes ven «la reunión aún no ha comenzado» hasta que entra un moderador; es distinto de la Sala de Espera, donde sí pueden esperar dentro.

**Funciones de Grabación**
Interruptor general más grabación en la nube, inicio automático de la grabación en la nube y grabación local.

**Chat / Notas Compartidas / Pizarra / Reproductor Externo / Mostrar Enlace Externo**
Activa cada herramienta. La pizarra admite una **URL de archivo precargado** (PDF o presentación).

**Sala de Espera**
Permite filtrar participantes antes de entrar, con mensaje personalizado.

**Salas de Grupos**
Actívelas y defina el máximo (hasta 10).

**Ingress / Difusión Externa**
Permite entrada RTMP y difusión externa (con interruptor RTMP independiente).

**Cifrado de Extremo a Extremo**
Active E2EE con opciones de clave propia, chat y pizarra. Nota: E2EE desactiva funciones del servidor como la grabación en la nube y la transcripción.

**Encuestas / Acceso Telefónico SIP**
Active encuestas. El acceso SIP añade opciones para activar al crear y ocultar el número (requiere SIP configurado en el servidor).

**Funciones de Insights**
Interruptor general más transcripción (con traducción y síntesis de voz), traducción de chat, chat de texto con IA y resumen de reunión con IA. Requieren Insights/IA activados en su servidor plugNmeet.

**Ajustes de Bloqueo Predeterminados**
Estado inicial de micrófono, cámara, compartir pantalla, pizarra, notas compartidas, chat, chat privado, envío de mensajes, envío de archivos y reacciones. Los moderadores pueden desbloquear en vivo.

**Personalización del Diseño**
Logotipo, imagen de fondo, colores primario, secundario, fondo, cabecera, pie y panel lateral, además de URL de CSS personalizado (HTTPS) por sala. Vacío = hereda los valores globales de **Diseño** en la Configuración Global.

**Ajustes Avanzados**
Anulación por sala de los valores globales de **Avanzado**: simulcast, dynacast, detener pista de micrófono al silenciar, resolución de cámara (`h90`–`h2160`), resolución de pantalla compartida, preajuste de audio (`telephone`–`musicHighQualityStereo`) y códec de video (`vp8`, `h264`, `vp9`, `av1`). Deje un campo vacío para mantener el valor global.

Pulse **Guardar** al terminar.

### Paso 3.3: Permisos

En la pestaña **Permisos** al editar una sala controle el acceso por grupo de Joomla:

- **Entrar sin contraseña** (`join.passwordless`): los grupos permitidos entran solo con su nombre.
- **Entrar como administrador** (`join.admin`): los grupos permitidos entran como moderadores incluso con contraseña de asistente o sin contraseña.
- **Ver / reproducir / descargar / eliminar grabaciones** (`recording.*`): control detallado de la lista de grabaciones. Los invitados nunca deberían poder eliminar.

![room_permission.png](/img/Joomla/room_permission.png)

Use **Componentes > Plug N Meet > Opciones > Permisos** para los valores generales del sitio.

### Paso 3.4: Mostrar la Sala en su Sitio

Dispone de dos tipos de menú en **Plug N Meet**:

**Sala única** — para una reunión concreta:

- Vaya a **Menús > Menú Principal** y pulse **+ Nuevo Elemento de Menú**.
- En **Tipo de Elemento de Menú** pulse **Seleccionar** y elija **Plug N Meet > Sala única**.

![Joomla-25.png](/img/Joomla/Joomla-25.png)

- En **Seleccionar una sala** elija la sala creada.
- Asigne un **Título** (por ejemplo, «Clase en Vivo») y pulse **Guardar**.

![Joomla-26.png](/img/Joomla/Joomla-26.png)

**Lista de salas** — para un directorio de salas:

- Elija **Plug N Meet > Lista de salas** como tipo de menú.
- Opcionalmente filtre con **Elegir una Categoría**.

---

## 4. La Experiencia del Asistente

Al pulsar el elemento de menú, el usuario ve título, descripción y formulario de acceso.

- Introduce su nombre y la contraseña de la sala, luego pulsa **Unirse**. La reunión se abre en una pestaña nueva; al cerrarla regresa con `?returned=true`.
- Los grupos con permiso **Entrar sin contraseña** no ven el campo de contraseña.
- Si tiene permiso de **Ver grabaciones**, bajo el formulario aparece la tabla de grabaciones con botones **Reproducir / Descargar / Eliminar** según sus permisos.

![Joomla-28.png](/img/Joomla/Joomla-28.png)

## 5. Gestión Posterior a la Sesión (Administración)

Todos los recursos se gestionan desde **Componentes > Plug N Meet**, sin salir de Joomla.

### Gestión de Grabaciones

Vaya a **Componentes > Plug N Meet > Grabaciones**:

1. Seleccione una sala y pulse **Mostrar**.
2. Marque segmentos con las casillas y pulse **Fusionar** para unirlos en un solo MP4 (la confirmación muestra el orden elegido).
3. Use las acciones **Reproducir / Descargar / Eliminar** por fila.

### Acceso a Artefactos

Vaya a **Componentes > Plug N Meet > Artefactos**:

1. Seleccione una sala y pulse **Mostrar**.
2. Pulse un ID de artefacto para ver su detalle: tabla de analíticas de la sala, tabla por usuario (entradas, salidas, tiempo de palabra, calidad de conexión) y resumen de la reunión si existe.
3. Use **Descargar** para archivos, **Descargar Excel** para informes de analíticas y **Eliminar** para borrar.

## 6. Configuración Avanzada

### Personalización del Diseño

- **Global:** **Sistema > Configuración Global > plugNmeet > Personalización del Diseño** — se aplica a las salas que dejan los campos vacíos.
- **Por sala:** pestaña **Personalización del Diseño** al editar la sala — prevalece sobre lo global.

![Joomla-globalcust.png](/img/Joomla/Joomla-globalcust.png)

### Calidad de Medios por Defecto

Ajuste valores razonables en **Ajustes Avanzados** por sala: cámara `h720`, pantalla `h1080fps15`, audio `music` y códec `vp8` sirven para la mayoría de sitios. Súbalos solo si su servidor y los clientes tienen ancho suficiente.

---

## 7. Seguridad y Privacidad

- **Control de datos:** usted controla el servidor (autoalojado o nube privada), así que controla sus datos.
- **Alojamiento local:** el servidor open-source de plugNmeet puede correr en su propio hardware para cargas sensibles (RGPD/HIPAA).
- **Cifrado:** todo el multimedia va cifrado con estándares WebRTC. Active **E2EE** por sala para máxima seguridad.
- **Mínimo privilegio:** reserve **Entrar como administrador** y **Eliminar grabaciones** a Mánager, Administradores y Superusuarios.

---

## Preguntas Comunes y Solución de Problemas

**¿Por qué veo un error de «API no válida» en mi página de reunión?**
Sigue usando las credenciales demo. Sustitúyalas en **Sistema > Configuración Global > plugNmeet** por los datos de su servidor.

**¿Error de «misma contraseña» al guardar?**
Las contraseñas de moderador y asistente deben ser distintas. Cambie una y guarde de nuevo.

**¿Cómo encuentro los ajustes globales tras instalar?**
Como administrador, vaya a **Sistema > Configuración Global > plugNmeet**.

**¿No aparecen grabaciones en la portada?**
El usuario necesita permiso de **Ver grabaciones** para esa sala (pestaña Permisos) y debe existir al menos una grabación en la nube para ese ID de sala.
