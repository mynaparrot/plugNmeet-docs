---
title: API para Unirse a la Sala | Referencia de la API de plugNmeet
description: Documentación del punto final de la API para generar un token para unirse a una sala de videoconferencia. Aprenda a agregar participantes y establecer roles de moderador o asistente.
keywords: [api, unirse a la sala, obtener token, token de acceso, unirse a la reunión, api de sala, punto final]
sidebar_position: 2
sidebar_label: Unirse
---

# Unirse a la Sala

Punto final: `/room/getJoinToken`

Este punto final genera un token temporal que otorga a un usuario acceso a una sala específica. Antes de sumergirse en los parámetros, aquí hay algunos conceptos clave a tener en cuenta:

*   **Ciclo de Vida del Token**: El token generado es de corta duración (su período de validez se establece en la configuración de su servidor) y está diseñado para un **uso único**. Debe consumirlo inmediatamente redirigiendo al usuario a la URL de la reunión. **No almacene este token para uso futuro.**

*   **Unicidad del ID de Usuario**:
    *   Plug-N-Meet requiere que cada participante en una sesión tenga un `user_id` único.
    *   Si creó la sala con `auto_gen_user_id: false` (el valor predeterminado), usted es responsable de proporcionar un `user_id` único para cada usuario.
    *   Si un nuevo usuario se une con un `user_id` que ya está activo en la sala, el participante existente con ese ID será desconectado automáticamente. Esto es útil para permitir que los usuarios cambien de dispositivo sin problemas.

*   **Existencia de la Sala**: Solo puede generar un token de unión para una sala que ya ha sido creada y está actualmente activa.

## Parámetros de Solicitud

| Campo                   | Tipo   | Requerido | Descripción                                 |
| ----------------------- | ------ | -------- | ------------------------------------------- |
| room_id                 | string | Sí      | El ID de la sala a la que desea unirse.        |
| [user_info](#información-del-usuario) | object | Sí      | Información sobre el usuario que se une a la sala.|

### Información del Usuario

| Campo                           | Tipo    | Requerido | Descripción                                                  |
| --------------------------------| ------- | -------- | ------------------------------------------------------------ |
| name                            | string  | Sí      | El nombre para mostrar del usuario.                                |
| user_id                         | string  | Sí      | Un identificador único para el usuario. **Nota:** Si la sala se creó con `auto_gen_user_id: true`, este valor se almacenará como `ex_user_id` y se asignará un ID aleatorio al usuario para la sesión. |
| is_admin                        | boolean | Sí      | Si es `true`, el usuario se unirá como moderador con privilegios elevados. Si es `false`, se unirá como un participante estándar. |
| is_hidden                       | boolean | No       | Si es `true`, el usuario se unirá como espectador. No aparecerá en la lista de participantes y no podrá interactuar. |
| [user_metadata](#metadatos-del-usuario) | object  | Sí      | Metadatos adicionales sobre el usuario.                          |

### Metadatos del Usuario

| Campo                                                           | Tipo    | Requerido | Descripción                                                                                                    |
| --------------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| profile_pic                                                     | string  | No       | URL de la foto de perfil del usuario.                                                                             |
| preferred_lang                                                  | string  | No       | Idioma preferido para el cliente Plug-N-Meet. Vea los valores admitidos [aquí](https://github.com/mynaparrot/plugNmeet-client/blob/main/src/helpers/languages.ts). Ejemplo: es-ES, bn-BD, de-DE, etc. |
| record_webcam                                                   | boolean | No       | Controla si la cámara web de este usuario se incluye en las grabaciones del lado del servidor. El valor predeterminado es `true`. Establézcalo en `false` para excluirlo. |
| ex_user_id                                                      | string  | No       | Si está vacío, se utilizará el valor de `user_id`.                                                                 |
| extra_data                                                      |  map  | No       | Un mapa de pares clave-valor personalizados. Tanto las claves como los valores deben ser cadenas. p. ej. `{"key": "value"}`|.                                                                         |
| [lock_settings](/docs/api/room/create#configuraciones-de-bloqueo-predeterminadas)    | object  | No       | Configuraciones de bloqueo para el usuario.                                                                                    |

### Ejemplo

```json
{
  "room_id": "room01",
  "user_info": {
    "name": "Su Nombre",
    "user_id": "Su-ID-de-Usuario-Único",
    "is_admin": true,
    "is_hidden": false,
    "user_metadata": {
      "profile_pic": "https://profile.pic/im.jpg",
      "lock_settings": {
        "lock_microphone": false,
        "lock_webcam": false,
        "lock_screen_sharing": true,
        "lock_chat": false,
        "lock_chat_send_message": false,
        "lock_chat_file_share": false
      }
    }
  }
}
```

## Respuesta

| Campo  | Tipo    | Posición | Descripción               |
| ------ | ------- | -------- | ------------------------- |
| status | boolean | raíz     | Indica si la solicitud fue exitosa. |
| msg    | string  | raíz     | Mensaje de respuesta.         |
| token  | string  | raíz     | El token de unión.           |

### Usando el Token de Unión

Una vez que reciba el `token`, puede otorgar al usuario acceso a la sala de reuniones. Hay dos formas de pasar el token al cliente Plug-N-Meet:

1.  **Como un parámetro de URL (recomendado)**: Pase el token en la cadena de consulta como `access_token`.
2.  **Como una cookie**: Establezca una cookie llamada `pnm_access_token` con el token como su valor.

El método del parámetro de URL es el más sencillo. Aquí hay un ejemplo:

```
https://Su-Servidor-Plug-N-Meet.com/?access_token=<TOKEN AQUÍ>
```

Si está alojando los archivos estáticos de [plugNmeet-client](https://github.com/mynaparrot/plugNmeet-client) en otro lugar, también debe pasar el token de la misma manera. Por ejemplo, si sus archivos estáticos están en un directorio de `conference`:

```
https://Su-Dominio.com/conference/?access_token=<TOKEN AQUÍ>
```

**Nota:** También puede usar la API [getClientFiles](/docs/api/get-client-files) para recuperar todos los archivos CSS y JS necesarios para mostrar la interfaz manualmente. Esto le permite incrustar el cliente Plug-N-Meet en cualquier lugar sin preocuparse por los archivos de compilación estáticos.

## Diseño Personalizado

Puede agregar un parámetro de consulta adicional llamado `custom_design` al enlace de unión para aplicar un diseño único para cada usuario. El valor de `custom_design` debe ser una cadena JSON codificada en URL.

Para obtener una lista completa de los parámetros admitidos y sus descripciones, consulte la sección **[Parámetros de Diseño](/docs/developer-guide/design-customisation#parámetros-de-diseño)** en nuestra Guía del Desarrollador.

**Ejemplo:**

```
https://Su-Dominio.com/conference/?access_token=<TOKEN AQUÍ>&custom_design=%7B%22primary_color%22%3A%22%23004D90%22%2C%22secondary_color%22%3A%22%2324AEF7%22%7D
```
