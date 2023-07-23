---
sidebar_position: 11
---
# Get client files

You can request [plugNmeet-client](https://github.com/mynaparrot/plugNmeet-client) files (CSS, JS) and embeded those scripts into your web application to load the interface directly. Check out one of our already implemented plugins, such as [Moodle](https://github.com/mynaparrot/moodle-mod_plugnmeet/blob/main/conference.php).

End point: `/getClientFiles`

**Example**:

```json
{}
```

## Response


| Field         | Type                  | Position | Description               |
| :-------------- | ----------------------- | ---------- | :-------------------------- |
| status        | boolean               | root     | The status of the request |
| msg           | string                | root     | Response message          |
| css | array | root     |          All required CSS files                 |
| css | array | root     |         All required JS files                  |

