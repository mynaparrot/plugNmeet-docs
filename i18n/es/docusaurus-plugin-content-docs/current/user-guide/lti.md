---
title: Integración LTI para LMS | Use plugNmeet con Canvas, Chamilo, etc.
description: Una guía para conectar plugNmeet a cualquier Sistema de Gestión del Aprendizaje (LMS) compatible con LTI, como Canvas, Chamilo u otros, para la educación en línea.
keywords: [lti, lms, sistema de gestión de aprendizaje, canvas, chamilo, e-learning, integración]
sidebar_position: 7
sidebar_label: Integración LTI
---

# Integración con cualquier LMS usando LTI

Learning Tools Interoperability (LTI) es un protocolo estándar que le permite conectar de forma segura Plug-N-Meet a prácticamente cualquier Sistema de Gestión del Aprendizaje (LMS) como Canvas, Moodle, Chamilo y otros.

Este método es ideal si no existe un plugin dedicado para su plataforma o si su institución restringe la instalación de plugins personalizados. Permite a los instructores y estudiantes unirse a las reuniones y ver las grabaciones directamente desde la página de su curso.

---

## Parte 1: Detalles Generales de Configuración de LTI

Esta sección contiene la información necesaria para **cualquier** integración LTI.

### Credenciales Requeridas

Para conectar cualquier plataforma compatible con LTI, necesitará las siguientes tres piezas de información. La **Clave de Consumidor** y el **Secreto Compartido** deben obtenerse de la configuración de la API de su propio servidor PlugNmeet.

```
URL de Lanzamiento: https://su-plug-n-meet.com/lti/v1
Clave de consumidor: [Su Clave de API de plugNmeet]
Secreto compartido: [Su Secreto de API de plugNmeet]
```

Para pruebas temporales, puede usar el servidor de demostración público:

```
URL de Lanzamiento: https://demo.plugnmeet.com/lti/v1
Clave de consumidor: plugnmeet
Secreto compartido: zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6
```

**Nota:** Se recomienda encarecidamente permitir que la herramienta LTI envíe el `nombre del lanzador`; de lo contrario, el usuario aparecerá en la reunión con un nombre vacío.

### Descripción General de la Interfaz de Usuario

- **Vista del Instructor/Moderador:** Cuando un usuario con rol de instructor inicia la herramienta LTI, verá una vista administrativa que le permitirá gestionar las sesiones y ver las grabaciones.

![lti1.png](/img/lti/lti1.png)

- **Vista del Estudiante/Asistente:** Cuando un estudiante inicia la herramienta, verá una página simple para unirse a la sesión en vivo actual.

![lti3.png](/img/lti/lti3.png)

### Parámetros Personalizados Opcionales

Puede pasar estos parámetros opcionales durante la configuración de LTI en su LMS para personalizar la experiencia de la sala de reuniones.

| Campo                 | Tipo    | Descripción                                                                 |
| :-------------------- | :------ | :-------------------------------------------------------------------------- |
| `room_duration`         | Número  | Duración de la sesión en minutos. `0` significa sin límite.                            |
| `allow_polls`           | Booleano | `true` (predeterminado) o `false`                                                 |
| `allow_shared_note_pad` | Booleano | `true` (predeterminado) o `false`                                                 |
| `allow_breakout_room`   | Booleano | `true` (predeterminado) o `false`                                                 |
| `allow_recording`       | Booleano | `true` (predeterminado) o `false`                                                 |
| `allow_rtmp`            | Booleano | `true` (predeterminado) o `false`                                                 |
| `mute_on_start`         | Booleano | `false` (predeterminado) o `true`                                                 |
| `primary_color`         | Cadena  | Color primario de la interfaz en código hexadecimal (p. ej., `#004D90`).                      |
| `secondary_color`       | Cadena  | Color secundario de la interfaz en código hexadecimal.                                      |
| `background_color`      | Cadena  | Color de fondo de la interfaz en código hexadecimal.                                     |
| `custom_logo`           | Cadena  | Un enlace HTTPS directo a una imagen de logotipo (p. ej., `https://midominio.com/logo.png`). |

---

## Parte 2: Ejemplos de Integración con LMS

Esta sección proporciona ejemplos paso a paso para Sistemas de Gestión del Aprendizaje populares.

### Ejemplo con Canvas LMS

Este ejemplo demuestra cómo agregar Plug-N-Meet como una aplicación LTI externa en Canvas.

1.  Como administrador, navegue a **Configuración > Aplicaciones** en su curso de Canvas.
2.  Haga clic en **Ver Configuraciones de la Aplicación** y luego en **+Aplicación**.
3.  Para el **Tipo de Configuración**, seleccione **Entrada Manual**.
4.  Llene los campos con sus credenciales LTI de PlugNmeet (Nombre, Clave de Consumidor, Secreto Compartido y URL de Lanzamiento).
5.  Haga clic en **Enviar**. La aplicación PlugNmeet ahora estará disponible como una herramienta externa para tareas y módulos.

![lti-canvas-1.png](/img/lti/lti-canvas-1.png)

### Ejemplo con Chamilo LMS

1.  Como administrador, vaya a la página de **Complementos** y habilite el complemento **IMS/LTI**.
2.  Navegue a un curso y haga clic en el icono del lápiz para editar su configuración.
3.  Vaya a la sección **IMS/LTI** y haga clic en **Configurar herramientas externas**.
4.  Haga clic en **Agregar herramienta externa** y llene el formulario con sus credenciales LTI de PlugNmeet.
5.  Después de guardar, **plugNmeet** aparecerá como una herramienta disponible en la sección de **Interacción** de su curso.

![lti-chamilo-8.png](/img/lti/lti-chamilo-8.png)

### Ejemplo con Moodle LMS

Este método LTI es una excelente alternativa si su proveedor de alojamiento de Moodle no permite la instalación de plugins de actividad personalizados.

1.  Como administrador, vaya a **Administración del sitio > Plugins > Gestionar herramientas**.
2.  Haga clic en **Configurar una herramienta manualmente**.
3.  Llene el formulario con sus credenciales LTI de PlugNmeet (Nombre de la herramienta, URL de la herramienta, Clave de consumidor, Secreto compartido).
4.  Haga clic en **Guardar cambios**.
5.  Ahora, cualquier creador de cursos puede agregar esto a su curso. Active el **Modo de edición** en un curso, haga clic en **Añadir una actividad o un recurso** y seleccione **Herramienta externa**.
6.  En el menú desplegable **Herramienta preconfigurada**, seleccione la herramienta **plugNmeet** que acaba de crear.
7.  Dé un nombre a la actividad, guarde y estará lista para sus estudiantes.

![lti-moodle-3.png](/img/lti/lti-moodle-3.png)
![lti-moodle-4.png](/img/lti/lti-moodle-4.png)
![lti-moodle-5.png](/img/lti/lti-moodle-5.png)
![lti-moodle-12.png](/img/lti/lti-moodle-12.png)
![lti-moodle-13.png](/img/lti/lti-moodle-13.png)
---

## Preguntas Comunes y Solución de Problemas

**¿Cuál es la diferencia entre usar LTI y el plugin dedicado de Moodle?**
El complemento dedicado de Moodle ofrece una integración más profunda con las funciones de Moodle, como las calificaciones y los permisos. Sin embargo, el método LTI es una solución universal que funciona para casi cualquier LMS y es una excelente alternativa si no puede instalar plugins personalizados.

**¿Por qué recibo un error de 'Autenticación Fallida'?**
Esto casi siempre significa que la **Clave de Consumidor** o el **Secreto Compartido** son incorrectos. Verifique dos veces que ha copiado estos valores correctamente de la configuración de la API de su servidor PlugNmeet y que están ingresados correctamente en su LMS.
