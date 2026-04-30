---
title: Guía de Inicio Rápido con PHP | Cree una Reunión de Video con plugNmeet
description: Un tutorial de inicio rápido para desarrolladores de PHP que muestra cómo usar el SDK de PHP de plugNmeet para crear y unirse a una sala de videoconferencia segura en minutos.
keywords: [php, tutorial, inicio rápido, sdk php, código de ejemplo, integración, webrtc php, video api php]
sidebar_position: 1
sidebar_label: Inicio Rápido con PHP
---

# Inicio Rápido con PHP: Crear y Unirse a una Reunión

Este tutorial proporciona un ejemplo completo y paso a paso de cómo utilizar la biblioteca `plugNmeet-sdk-php` para crear una nueva sala de reuniones y generar un token de acceso seguro para un usuario.

La lógica sigue un flujo de trabajo común: verificar si una sala ya existe, crearla si no es así, y luego generar una URL para que un usuario pueda unirse.

<img src="/img/tutorials/quick_join_flow.png" width="400" alt="Flujo lógico de unión rápida" loading="lazy"/>

---

## Requisitos Previos

Antes de comenzar, asegúrese de tener lo siguiente:

- Un servidor de PlugNmeet en funcionamiento con su clave de API y secreto.
- La última versión de la biblioteca [plugNmeet-sdk-php](https://github.com/mynaparrot/plugNmeet-sdk-php/releases) descargada.

---

## Paso 1: Configuración Inicial

Primero, cree un archivo PHP (por ejemplo, `quickJoin.php`) e incluya la clase `plugNmeetConnect.php` del SDK. Luego, cree un objeto de configuración con los datos de su servidor.

```php
<?php
require __DIR__ . "/plugNmeetConnect.php";

// Paso 1: Configuración
$config = new stdClass();
$config->plugnmeet_server_url = "http://localhost:8080"; // La URL de su servidor
$config->plugnmeet_api_key = "plugnmeet"; // Su clave de API
$config->plugnmeet_secret = "zumyyYWqv7KR2kUqvYdq4z4sXg7XTBD2ljT6"; // Su secreto de API

$connect = new plugNmeetConnect($config);
```

---

## Paso 2: Definir Parámetros de la Sala y del Usuario

A continuación, defina los parámetros básicos para la sala que desea crear y el usuario que se unirá. El array `$roomMetadata` le permite personalizar cada aspecto de las funciones de la sala, desde habilitar cámaras web hasta establecer permisos de bloqueo predeterminados.

```php
// Paso 2: Definiciones de la sala y el usuario
$roomId = "sala01"; // Debe ser único. También puede usar $connect->getUUID();
$max_participants = 0; // 0 = sin límite
$user_full_name = "Su Nombre";
$userId = "su-id-de-usuario-unico"; // Debe ser único para cada usuario.
$isAdmin = true;

// Definir todas las características para esta sala específica.
$roomMetadata = array(
    "room_features" => array(
        "allow_webcams" => true,
        "mute_on_start" => false,
        "allow_screen_share" => true,
        "allow_rtmp" => true,
        "allow_view_other_webcams" => true,
        "allow_view_other_users_list" => true,
        "admin_only_webcams" => false,
        "enable_analytics" => true,
        "room_duration" => 0, // en minutos. 0 = sin límite
        "allow_virtual_bg" => true,
        "allow_raise_hand" => true,
        // si es falso, deberá proporcionar un ID de usuario único
        "auto_gen_user_id" => true,
        "recording_features" => array(
            "is_allow" => true,
            "is_allow_cloud" => true,
            "is_allow_local" => true,
            "enable_auto_cloud_recording" => false
        ),
        "chat_features" => array(
            "is_allow" => true,
            "is_allow_file_upload" => true
        ),
        "shared_note_pad_features" => array(
            "is_allow" => true
        ),
        "whiteboard_features" => array(
            "is_allow" => true,
            //"preload_file" => "https://midominio.com/libro_de_texto.pdf"
        ),
        "external_media_player_features" => array(
            "is_allow" => true
        ),
        "waiting_room_features" => array(
            "is_active" => false,
        ),
        "breakout_room_features" => array(
            "is_allow" => true,
            "allowed_number_rooms" => 2
        ),
        "display_external_link_features" => array(
            "is_allow" => true,
        ),
        "ingress_features" => array(
            "is_allow" => true,
        ),
        "polls_features" => array(
            "is_allow" => true,
        ),
        "insights_features" => array(
            "is_allow" => true,
            "transcription_features" => array(
                "is_allow" => true,
                "is_allow_translation" => true,
                "is_allow_speech_synthesis" => true,
            ),
            "chat_translation_features" => array(
                "is_allow" => true,
            ),
            "ai_features" => array(
                "is_allow" => true,
                "ai_text_chat_features" => array(
                    "is_allow" => true,
                ),
                "meeting_summarization_features" => array(
                    "is_allow" => true,
                )
            )
        ),
        "end_to_end_encryption_features" => array(
            "is_enabled" => false,
            "enabled_self_insert_encryption_key" => false,
            "included_chat_messages" => false,
            // esto puede consumir más CPU para el usuario final.
            // no lo habilite a menos que sea realmente necesario
            "included_whiteboard" => false,
        ),
    ),
    "default_lock_settings" => array(
        "lock_microphone" => false,
        "lock_webcam" => false,
        "lock_screen_sharing" => true,
        "lock_whiteboard" => true,
        "lock_shared_notepad" => true,
        "lock_chat" => false,
        "lock_chat_send_message" => false,
        "lock_chat_file_share" => false,
        "lock_private_chat" => false // el usuario siempre puede enviar mensajes privados al moderador
    ),
    // copyright_conf solo funcionará si la configuración del servidor
    // se ha establecido en true para `allow_override`, de lo contrario, se ignorará
    "copyright_conf" => array(
        "display" => true,
        "text" => "Desarrollado por <a href=\"https://www.plugnmeet.org\" target=\"_blank\">plugNmeet</a>"
    )
);
```

---

## Paso 3: El Flujo Lógico - Verificar, Crear, Unirse

Los siguientes bloques de código implementan la lógica central.

### 3.1 Verificar si la Sala está Activa

Primero, consultamos la API para determinar si una sala con el `$roomId` especificado ya existe y está activa.

```php
$isRoomActive = false;
$output = new stdClass();
$output->status = false;

try {
    $res = $connect->isRoomActive($roomId);
    if (!$res->getStatus()) {
        $output->msg = $res->getMsg();
    } else {
        $isRoomActive = $res->getIsActive();
        $output->status = true;
    }

} catch (Exception $e) {
    $output->msg = $e->getMessage();
}
```

### 3.2 Si no, Crear la Sala

Si la sala no está activa, procedemos a crearla utilizando los parámetros que definimos anteriormente.

```php
if (!$isRoomActive && $output->status) {
    try {
        $create = $connect->createRoom($roomId, "Sala de Prueba", $roomMetadata, "Bienvenido a la sala", "", "", $max_participants);

        $isRoomActive = $create->getStatus();
        $output->status = $create->getStatus();
        $output->msg = $create->getMsg();
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}
```

### 3.3 Generar el Token de Acceso

Una vez que hemos confirmado que la sala está activa (ya sea porque existía o porque la acabamos de crear), podemos generar un token de acceso seguro y de un solo uso para nuestro usuario.

```php
if ($isRoomActive && $output->status) {
    try {
        $join = $connect->getJoinToken($roomId, $user_full_name, $userId, $isAdmin);

        if ($join->getStatus()) {
            $output->token = "<br>" . $join->getToken();
            $output->url = "<br>" . $config->plugnmeet_server_url . "?access_token=" . $join->getToken();
            // o puede establecer la cookie `pnm_access_token` con ese token y redirigir
        }
        $output->status = $join->getStatus();
        $output->msg = $join->getMsg();
    } catch (Exception $e) {
        $output->msg = $e->getMessage();
    }
}
```

---

## Paso 4: Redirigir al Usuario

Después de generar con éxito el token de acceso, la URL completa de la reunión estará en la variable `$output->url`. Ahora puede redirigir a su usuario a esta URL para que se una a la reunión.

```php
if ($output->status) {
    header("Location: " . $output->url);
    exit;
} else {
    echo $output->msg;
}
```

---

## Próximos Pasos

Esta guía de inicio rápido utiliza el método más simple para que un usuario entre en una sala. Para una experiencia más integrada, puede construir una interfaz de cliente personalizada utilizando el método de la API [getClientFiles()](/docs/api/get-client-files). Esto le permite alojar el cliente en su propia página sin necesidad de usar un iframe.

Consulte el archivo [conference.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/conference.php) en nuestro SDK de PHP para ver un ejemplo completo.
