---
title: "Cerrando la Brecha: Cómo la Marcación SIP Conecta tus Reuniones con Cualquier Teléfono"
slug: sip-dial-in-for-video-conferencing
authors: [bob]
tags: [sip, voip, telefonía, integración, accesibilidad, característica, moderador, administrador]
date: 2026-01-21
---

Todos hemos estado allí: una reunión crucial está a punto de comenzar, pero un participante clave tiene una conexión a Internet irregular, está de viaje o simplemente no tiene acceso a una computadora. En un mundo cada vez más dependiente de las videollamadas, ¿cómo te aseguras de que todos puedan participar, incluso si no pueden unirse en línea?

En Plug-N-Meet, creemos en la inclusión. Es por eso que estamos emocionados de presentar la **Marcación SIP**, una potente función que permite a los participantes unirse al audio de tus reuniones de video usando cualquier teléfono estándar. Sin Internet, no hay problema.

Esta función cierra la brecha sin problemas entre tu conferencia en línea y la red telefónica tradicional, asegurando que cada voz pueda ser escuchada, independientemente de su conectividad.

<!--truncate-->

---

### El Problema: Cuando Internet no es una Opción

Si bien la videoconferencia basada en WebRTC es increíblemente potente, depende de una conexión a Internet estable. Esto puede ser una barrera para:
*   **Viajeros:** En la carretera, en un coche o en áreas con mala conexión Wi-Fi.
*   **Ubicaciones Remotas:** Participantes en regiones con infraestructura de Internet limitada.
*   **Necesidades de Accesibilidad:** Personas que prefieren o requieren acceso telefónico.
*   **Participación Solo de Audio Simple:** A veces, todo lo que necesitas es escuchar y hablar, sin el video.

### La Solución: La Marcación SIP de Plug-N-Meet

Nuestra función de Marcación SIP integra tus reuniones de Plug-N-Meet con la red telefónica global. Funciona configurando una **Puerta de Enlace SIP** que actúa como un puente, permitiendo que las llamadas telefónicas tradicionales se conecten directamente a tu conferencia en línea.

#### Cómo Funciona para los Participantes (Simple y Familiar)

1.  Un participante recibe un número de teléfono estándar y un PIN único para la reunión.
2.  Marcan el número desde cualquier teléfono (móvil o fijo).
3.  Ingresan el PIN cuando se les solicita.
4.  Se conectan instantáneamente al audio de la reunión, pudiendo escuchar y hablar con todos en la sesión en línea.

#### Cómo Funciona para los Moderadores (Control Fácil)

Los moderadores tienen control total sobre el servicio de marcación SIP desde la reunión:
*   **Habilitar/Deshabilitar:** Iniciar o detener el servicio de marcación para la sesión actual.
*   **Ver Información:** Ver el/los número(s) de marcación activos y el PIN.
*   **Compartir al Instante:** Con un solo clic, publicar los detalles de la marcación directamente en el chat público para todos los participantes en línea.
*   **Opciones de Privacidad:** Elegir enmascarar el número de marcación en la lista de participantes, mostrando solo los últimos cuatro dígitos para mayor privacidad.

### Inmersión Técnica: Potenciando la Conexión

Bajo el capó, Plug-N-Meet aprovecha el robusto proyecto **[livekit/sip](https://github.com/livekit/sip)** como su puerta de enlace SIP. Este componente es responsable de gestionar la conexión entre tu reunión y un proveedor de troncales SIP externo.

#### Para Administradores: La Configuración del Servidor es Clave

Para habilitar la Marcación SIP, tu administrador del sistema debe realizar una configuración única en el lado del servidor:
1.  **Configuración de `config.yaml`:** La sección `livekit_sip_info` en el archivo `config.yaml` de tu servidor de Plug-N-Meet debe configurarse con los detalles de tu proveedor de SIP.
2.  **Proveedor de SIP Externo:** Necesitarás una cuenta con un proveedor de troncales SIP (p. ej., Twilio, SignalWire, etc.) para manejar las llamadas telefónicas reales hacia y desde la red telefónica pública conmutada (PSTN).

#### Consideraciones de Seguridad: Cifrado del Tramo Telefónico

Si bien el flujo de audio SIP en sí no puede ser cifrado de extremo a extremo (ya que debe atravesar la red telefónica tradicional), la conexión entre tu puerta de enlace SIP y tu proveedor de SIP *puede* ser asegurada. El servicio `livekit/sip` admite `SIPMediaEncryption` (SRTP), que cifra el flujo de audio a través de Internet. Es responsabilidad del administrador habilitar esto y asegurarse de que su proveedor de SIP elegido lo admita.

#### Incompatibilidad con E2EE

Es importante tener en cuenta que la puerta de enlace SIP debe procesar audio sin cifrar para conectar la llamada. Debido a esto, **la Marcación SIP se deshabilita automáticamente para cualquier sala donde el Cifrado de Extremo a Extremo (E2EE) esté activo**. Esto garantiza que la integridad de tus sesiones E2EE nunca se vea comprometida.

### Conclusión: Ampliando tu Alcance

La función de Marcación SIP de Plug-N-Meet es más que una simple conveniencia; es una herramienta poderosa para la inclusión y la accesibilidad. Asegura que tus reuniones puedan llegar a una audiencia más amplia, proporcionando una conexión de audio confiable incluso cuando el acceso a Internet es un desafío.

Al cerrar la brecha entre la telefonía en línea y la tradicional, Plug-N-Meet te permite conectarte con todos, en todas partes.

---

**¿Listo para ampliar el alcance de tu reunión?**

*   **Aprende cómo habilitar la Marcación SIP al crear una sala a través de la [API de Creación de Sala](/docs/api/room/create).**
*   **Comprende las implicaciones de seguridad en nuestra [Descripción General de Seguridad](/docs/security-overview).**
*   **Explora el [repositorio de GitHub de livekit/sip](https://github.com/livekit/sip) para obtener instrucciones de configuración detalladas.**
*   **[Prueba la Demostración en Vivo](https://demo.plugnmeet.com/landing.html) para experimentar las características de Plug-N-Meet.**
