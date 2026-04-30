---
title: "Cómo Habilitar el Cifrado de Extremo a Extremo en su Aplicación de Video"
slug: how-to-enable-end-to-end-encryption
authors: [bob]
tags: [tutorial, cómo-hacer, e2ee, seguridad, cifrado, privacidad, desarrollador]
---

En una era de crecientes preocupaciones por la privacidad, ofrecer Cifrado de Extremo a Extremo (E2EE) es una de las formas más poderosas de generar confianza con sus usuarios. Proporciona una garantía matemática de que las conversaciones son confidenciales y que ni siquiera su servidor puede acceder a los flujos de medios.

Si bien la tecnología es compleja, implementarla no tiene por qué serlo. Esta guía lo guiará a través de los dos modelos de E2EE disponibles en Plug-N-Meet y le mostrará cómo habilitarlos con una simple llamada a la API.

<!--truncate-->

---

## Requisitos Previos

*   Un servidor Plug-N-Meet en funcionamiento.
*   La capacidad de realizar llamadas a la API a su servidor.

---

### Paso 1: Elija su Modelo de Seguridad

Antes de escribir cualquier código, debe responder una pregunta: **¿Quién debe gestionar las claves de cifrado?** Plug-N-Meet ofrece dos modelos distintos, y su elección determinará la implementación.

*   **Modelo A: Generado por el Servidor (Simple y Seguro):** El servidor de Plug-N-Meet genera, gestiona y distribuye un secreto único para cada sesión. Este es el método más fácil y conveniente.
*   **Modelo B: Proporcionado por el Usuario (Conocimiento Cero):** Los usuarios son responsables de crear y compartir un secreto entre ellos. Su servidor nunca ve el secreto, lo que proporciona el nivel más alto de privacidad.

---

### Paso 2: Implemente su Modelo Elegido

La habilitación de E2EE se realiza dentro del bloque `end_to_end_encryption_features` de su llamada a la API `createRoom`.

#### La Seguridad Subyacente: Claves de Sesión de un Solo Uso

Antes de ver los dos modelos, es importante comprender una característica de seguridad clave que se aplica a **ambos**: cada sesión obtiene su propia clave de cifrado única.

No importa de dónde provenga el secreto inicial (el servidor o el usuario), el navegador del cliente nunca lo usa directamente. En su lugar, combina el secreto con el ID de sesión único de la reunión para generar una clave de cifrado final de un solo uso.

Este proceso garantiza que incluso si reutiliza el mismo ID de sala para múltiples reuniones, cada sesión individual está criptográficamente aislada, lo que evita cualquier vínculo entre ellas.

#### Opción A: La Forma Simple y Segura (Claves Generadas por el Servidor)

Este es el camino recomendado para la mayoría de las aplicaciones. Obtiene un E2EE fuerte sin necesidad de construir ninguna lógica personalizada de intercambio de claves.

En los metadatos de su `createRoom`, establezca `is_enabled` en `true` y `enabled_self_insert_encryption_key` en `false`.

```json
{
  "room_id": "e2ee-room-simple",
  "metadata": {
    "room_features": {
      // ... otras características
      "end_to_end_encryption_features": {
        "is_enabled": true,
        "enabled_self_insert_encryption_key": false
      }
    }
  }
}
```

**Cómo funciona:** Cuando un usuario se une, el servidor proporciona un secreto único para la sesión. Luego, el cliente utiliza el proceso de generación de claves de un solo uso descrito anteriormente para asegurar la reunión.

#### Opción B: La Forma de Conocimiento Cero (Claves Proporcionadas por el Usuario)

Elija este modelo si necesita garantizar que su infraestructura no tenga conocimiento de las claves de cifrado.

En los metadatos de su `createRoom`, establezca tanto `is_enabled` como `enabled_self_insert_encryption_key` en `true`.

```json
{
  "room_id": "e2ee-room-zero-knowledge",
  "metadata": {
    "room_features": {
      // ... otras características
      "end_to_end_encryption_features": {
        "is_enabled": true,
        "enabled_self_insert_encryption_key": true
      }
    }
  }
}
```

**La Experiencia del Usuario:**
Cuando un usuario se une a esta sala, el cliente de Plug-N-Meet le pedirá automáticamente que ingrese la clave secreta compartida.

*   **Si ingresan la clave correcta**, su cliente la usará para generar la clave de sesión final (como se describió anteriormente) y podrán ver, escuchar e interactuar con otros participantes sin problemas.
*   **Si ingresan una clave incorrecta (o ninguna clave)**, aún se unirán a la sesión, pero no podrán ver ni escuchar a nadie, ni sus propios medios serán visibles para los demás. Verán mensajes de error de descifrado, lo que indica que no tienen la clave correcta para participar.

Este comportamiento es por diseño, ya que el servidor no tiene conocimiento de la clave y, por lo tanto, no puede validarla al ingresarla. Debe proporcionar a sus usuarios una forma "fuera de banda" de compartir esta clave (p. ej., una aplicación de chat segura, un administrador de contraseñas o verbalmente).

---

### Paso 3: Verifique que Funciona

¿Cómo sabe que el E2EE está activo? La señal más obvia es que ciertas funciones del lado del servidor se **deshabilitarán automáticamente**.

Si intenta usar las siguientes funciones en una sala con E2EE habilitado, fallarán, lo cual es el comportamiento esperado y la prueba de que su servidor no puede acceder a los medios:

*   **Grabación en la Nube:** El servidor no puede grabar lo que no puede ver.
*   **Transmisión RTMP:** Del mismo modo, el servidor no puede transmitir un flujo cifrado.
*   **Funciones de IA Basadas en Audio:** El Asistente de Reuniones con IA no puede transcribir ni resumir el audio que no puede descifrar.

Esta es una parte fundamental del diseño de seguridad, que garantiza que su elección de privacidad se aplique en toda la plataforma.

---

## Conclusión

Implementar el Cifrado de Extremo a Extremo es un paso poderoso, pero es solo una parte de una filosofía más amplia de "**privacidad por diseño**". Plug-N-Meet fue diseñado para ser un relé de datos seguro, no un almacén de datos.

Ya sea usando el SFU de LiveKit para enrutar paquetes de medios cifrados o NATS para transmitir mensajes, el trabajo principal del servidor es pasar datos entre los participantes. No tiene interés en qué son esos datos y, en el caso de E2EE, no tiene la capacidad de inspeccionarlos. Esta filosofía se extiende a características como nuestro uso de [almacenamiento del lado del cliente](/blog/client-side-storage-privacy-resilience), donde los datos de la sesión viven en su navegador, no en nuestros servidores.

Al elegir Plug-N-Meet, no solo está obteniendo una función; está adoptando una plataforma construida sobre el principio de que los datos de usuario más seguros son los datos que nunca tiene que tocar.

---
**¿Listo para aprender más?**

*   **Sumérjase en nuestra [Descripción General de Seguridad y Privacidad](/docs/security-overview)**
*   **Revise la [Guía de Modelos de Claves E2EE](/blog/e2ee-key-models-guide)**
*   **Explore la llamada completa a la [API createRoom](/docs/api/room/create)**
