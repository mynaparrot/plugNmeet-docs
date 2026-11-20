---
title: "Docs MCP Server | plugNmeet Documentation for AI Clients"
description: "Connect Claude, Cursor, VS Code, or any MCP client to the plugNmeet docs MCP server to search and read this documentation directly."
keywords: [mcp, model context protocol, docs mcp, claude, cursor, vs code, ai documentation, docs search]
sidebar_position: 6
sidebar_label: Docs MCP Server
---

# Docs MCP Server

The docs MCP server exposes this documentation to AI assistants through the [Model Context Protocol](https://modelcontextprotocol.io). Instead of relying on a model's training data, clients can search the docs and read whole pages while answering questions or writing code.

Remote endpoint: `https://docs-mcp.plugnmeet.org/mcp`

## Tools

| Tool | Arguments | Purpose |
| --- | --- | --- |
| `search_docs` | `query`, `limit` (1-20, default 5), `section` (`docs`/`blog`), `locale` (`en`/`es`) | Ranked matches with title, URL, description, and a body snippet. |
| `list_docs` | `section`, `locale` | Every page grouped by category. |
| `get_docs_content` | `path` (site path or full URL), `locale` | Full Markdown of one page plus its source link. |

## Client Setup

### Claude

Add `https://docs-mcp.plugnmeet.org/mcp` as a remote MCP server URL in a custom connector.

### Cursor / VS Code

Add the server to `mcp.json`:

```json
{
  "mcpServers": {
    "plugnmeet-docs": {
      "url": "https://docs-mcp.plugnmeet.org/mcp"
    }
  }
}
```

### stdio-only clients

Clients that only support stdio can bridge to the remote endpoint with `mcp-remote`:

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
