---
title: "Transmite como un Profesional: Cómo Integrar OBS en tu Sala de plugNmeet"
slug: obs-rtmp-whip-ingress
authors: [bob,simon]
tags: [obs, transmisión, rtmp, whip, características, facilidad-de-uso, profesional]
---

¿Alguna vez has querido compartir un video de alta calidad durante una reunión, pero el archivo era demasiado grande para subirlo? O tal vez tienes un video con derechos de autor que puedes mostrar, pero no puedes compartir el archivo en sí. Quizás eres un usuario avanzado que quiere crear una presentación profesional con múltiples cámaras, superposiciones y transiciones suaves usando una herramienta como OBS Studio.

Tradicionalmente, llevar este tipo de contenido profesional a una reunión en vivo ha sido complejo o imposible.

En plugNmeet, creemos que deberías poder usar las mejores herramientas para cada tarea. Es por eso que hemos incorporado una función simple pero potente llamada **Entrada de Transmisión en Vivo**. Piénsalo como si le dieras a tu reunión su propio canal de televisión privado y seguro. Puedes transmitir directamente a tu sala de reuniones desde software profesional como OBS, y tu transmisión aparece como un participante normal.

<!--truncate-->

---

## ¿Por Qué Transmitir Directamente a tu Reunión?

Esta función abre un mundo de nuevas posibilidades:

*   **Comparte Videos Grandes o Privados:** Reproduce un archivo de video de alta resolución desde tu computadora local sin tener que subirlo nunca.
*   **Producciones en Vivo Profesionales:** Usa OBS Studio para cambiar entre múltiples cámaras, compartir ventanas de aplicaciones específicas, agregar gráficos profesionales y tercios inferiores, y crear una presentación pulida al estilo de la televisión.
*   **Demostraciones Mejoradas:** Muestra un flujo de trabajo de software complejo o una sesión de codificación en vivo con toda la potencia y personalización de tu configuración de escritorio.

## Cómo Configurarlo: Una Guía Sencilla Paso a Paso

Empezar es increíblemente fácil. A continuación, te explicamos cómo hacerlo desde tu sala de plugNmeet:

1.  **Abre el Menú de Configuración:** Haz clic en el menú de tres puntos en la esquina superior derecha de tu sala de reuniones y selecciona **Configuración**.

2.  **Busca la Entrada de Transmisión en Vivo:** En el panel de configuración, navega a la pestaña **Entrada de Transmisión en Vivo**.

3.  **Elige tu Tipo de "Canal" (RTMP o WHIP):**
    Verás una opción llamada "Tipo de Entrada". Esto te permite elegir la tecnología para tu transmisión. Piénsalo como elegir entre dos tipos de cables para conectar tu cámara:
    *   **RTMP:** Este es el estándar universal y confiable. Ha sido utilizado durante años por plataformas como YouTube y Twitch y es compatible con casi todas las aplicaciones de transmisión. Es una opción excelente y fiable.
    *   **WHIP:** Este es el nuevo y moderno estándar diseñado específicamente para la comunicación en tiempo real. Generalmente es más rápido, con menos retraso entre tu transmisión y lo que ve tu audiencia. Si tu software lo admite, WHIP es la opción a prueba de futuro.

4.  **Dale un Nombre a tu Transmisión:** En el campo **Nombre para Mostrar**, puedes escribir un nombre para tu transmisión. Este es el nombre que aparecerá en la lista de participantes. Por ejemplo, "Presentación Principal" o "Cámara del Orador Invitado". Si lo dejas en blanco, se establecerá de forma predeterminada en "Emisor".

5.  **Genera tu Enlace Privado:** Haz clic en el botón **"Generar enlace"**. plugNmeet creará instantáneamente una dirección única y segura para tu transmisión privada. Verás dos campos: una **URL** y un **Secreto** (o "Clave de Transmisión").

## Conectando tu Software de Transmisión (como OBS)

Ahora, solo necesitas decirle a tu software (usaremos OBS como ejemplo) a dónde enviar la transmisión.

*   **Para RTMP (El Estándar Universal):**
    1.  En la configuración de OBS, ve a "Transmisión".
    2.  Para "Servicio," elige "Personalizado..."
    3.  Copia la **URL** de plugNmeet y pégala en el campo "Servidor" en OBS.
    4.  Copia el **Secreto** de plugNmeet y pégalo en el campo "Clave de Transmisión" en OBS.

*   **Para WHIP (La Opción Moderna):**
    1.  En la configuración de OBS, ve a "Transmisión".
    2.  Para "Servicio," elige "WHIP".
    3.  Combina la URL y el Secreto de plugNmeet en una sola línea. Por ejemplo: `https://tu-dominio-plugnmeet.com/whip/UNA_CLAVE_SECRETA_LARGA_AQUÍ`
    4.  Pega esta dirección completa y combinada en el campo "Servidor" en OBS.
    5.  **Deja en blanco el campo "Token de Portador" en OBS.**

Una vez que presiones "Iniciar Transmisión" en OBS, ¡tu transmisión aparecerá mágicamente como un nuevo participante en tu sala de plugNmeet para que todos la vean!

---

## Conclusión: Potencia Profesional, Hecha Simple

La función de Entrada de Transmisión en Vivo es un ejemplo perfecto de nuestra filosofía. Hemos tomado una tecnología potente y de nivel profesional y la hemos hecho accesible para todos con solo unos pocos clics. No necesitas ser un experto técnico para crear una presentación de alta calidad, pulida y atractiva.

Las mejores herramientas son las que se quitan de en medio y dejan que tu contenido brille.

---
**¿Listo para mejorar tus presentaciones?**

*   **Prueba nuestra [Demostración en Vivo](https://demo.plugnmeet.com/landing.html) y compruébalo tú mismo**
*   **Explora nuestro [Proyecto de Código Abierto en GitHub](https://github.com/mynaparrot/plugNmeet-server)**
*   **Lee nuestra [Guía de Implementación Escalable](/docs/developer-guide/scalable-setup)**
