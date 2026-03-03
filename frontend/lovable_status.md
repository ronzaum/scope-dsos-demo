# Lovable Demo — Current Status

## State
Disconnected. The Lovable demo is a standalone frontend — it renders the UI but does not pull live data from the API server.

## Design spec
Full spec lives at `frontend/lovable_prompts/LOVABLE_PROMPT.md`. Defines:
- 4 pages: Overview, Clients, Terminal, Playbook
- Dark theme (Linear meets Vercel aesthetic)
- Design tokens, navigation, component structure
- Fallback data pattern (hardcoded data if API unreachable)

## What it does today
- Displays a static dashboard with placeholder/fallback data
- Shows the intended UX for deployment operations visibility
- Demonstrates the information architecture and layout

## What it doesn't do yet
- Does not connect to `api/server.js`
- Does not reflect live file changes
- No natural language querying
- No template/report browsing
- No real-time pattern surfacing

## Next step
Review the Lovable demo together (it's in git), compare against the requirements in this folder, and figure out the proper build path to connect it to live data.
