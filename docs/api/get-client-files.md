---
sidebar_position: 40
---

# Get Client Files

You can request the [plugNmeet-client](https://github.com/mynaparrot/plugNmeet-client) assets (CSS and JavaScript) and embed them directly into your web application to load the Plug-N-Meet interface. This approach eliminates the need for an iframe. You can use any domain, as long as it is SSL-enabled.

For implementation examples, refer to the [conference.php](https://github.com/mynaparrot/plugNmeet-sdk-php/blob/main/examples/conference.php) file or our plugins for [Moodle](https://github.com/mynaparrot/moodle-mod_plugnmeet/blob/main/conference.php), [WordPress](https://github.com/mynaparrot/plugNmeet-WordPress/blob/main/plugnmeet/public/partials/plugnmeet-public-display-client.php), and [Joomla](https://github.com/mynaparrot/plugNmeet-Joomla/blob/main/components/com_plugnmeet/tmpl/room/conference.php).

**Endpoint:** `/getClientFiles`

**Example Request:**

```json
{}
```

## Response

| Field  | Type    | Position | Description                                 |
| :----- | :------ | :------- | :------------------------------------------ |
| status | boolean | root     | Indicates whether the request was successful |
| msg    | string  | root     | Response message                            |
| css    | array   | root     | List of required CSS files                  |
| js     | array   | root     | List of required JavaScript files           |

