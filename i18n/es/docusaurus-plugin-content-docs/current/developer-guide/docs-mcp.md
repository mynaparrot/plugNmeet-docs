---
title: "Servidor MCP de documentación | Documentación de plugNmeet para clientes de IA"
description: "Conecte Claude, Cursor, VS Code o cualquier cliente MCP al servidor MCP de documentación de plugNmeet para buscar y leer esta documentación directamente."
keywords: [mcp, model context protocol, mcp de documentación, claude, cursor, vs code, documentación para ia, búsqueda en documentación]
sidebar_position: 6
sidebar_label: Servidor MCP de documentación
---

# Servidor MCP de documentación

El servidor MCP de documentación pone esta documentación a disposición de los asistentes de IA mediante el [Model Context Protocol](https://modelcontextprotocol.io). En lugar de depender de los datos con los que se entrenó el modelo, los clientes pueden buscar en la documentación y leer páginas completas mientras responden preguntas o escriben código.

Punto de conexión remoto: `https://docs-mcp.plugnmeet.org/mcp`

## Herramientas

| Herramienta | Argumentos | Finalidad |
| --- | --- | --- |
| `search_docs` | `query`, `limit` (1-20, 5 por defecto), `section` (`docs`/`blog`), `locale` (`en`/`es`) | Coincidencias ordenadas por relevancia con título, URL, descripción y un fragmento del contenido. |
| `list_docs` | `section`, `locale` | Todas las páginas agrupadas por categoría. |
| `get_docs_content` | `path` (ruta del sitio o URL completa), `locale` | Markdown completo de una página junto con el enlace a su código fuente. |

## Configuración del cliente

### Claude

Añada `https://docs-mcp.plugnmeet.org/mcp` como URL de servidor MCP remoto en un conector personalizado.

### Cursor / VS Code

Añada el servidor a `mcp.json`:

```json
{
  "mcpServers": {
    "plugnmeet-docs": {
      "url": "https://docs-mcp.plugnmeet.org/mcp"
    }
  }
}
```

### Clientes que solo admiten stdio

Los clientes que solo admiten stdio pueden conectarse al punto de conexión remoto mediante `mcp-remote`:

```json
{
  "mcpServers": {
    "plugnmeet-docs": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://docs-mcp.plugnmeet.org/mcp"]
    }
  }
}
```
