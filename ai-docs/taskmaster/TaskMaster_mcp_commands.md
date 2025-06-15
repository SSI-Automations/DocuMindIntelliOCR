Task Master AI MCP Integration Guide for Cursor

This document outlines how to integrate and effectively utilize the Task Master AI MCP tool within Cursor, optimizing your development workflow through AI-assisted tasks.

⸻

🔧 Setup Instructions

1. Install Task Master AI Globally

npm install -g task-master-ai

2. Configure MCP in Cursor
   • Create or Edit MCP Configuration:
   • Global Scope:
   • Linux/macOS: ~/.cursor/mcp.json
   • Windows: %USERPROFILE%\.cursor\mcp.json
   • Project Scope:
   • <project_folder>/.cursor/mcp.json
   • Example Configuration:

{
"mcpServers": {
"taskmaster-ai": {
"command": "npx",
"args": ["-y", "--package=task-master-ai", "task-master-ai"],
"env": {
"ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY",
"PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY",
"OPENAI_API_KEY": "YOUR_OPENAI_API_KEY",
"GOOGLE_API_KEY": "YOUR_GOOGLE_API_KEY",
"MISTRAL_API_KEY": "YOUR_MISTRAL_API_KEY",
"OPENROUTER_API_KEY": "YOUR_OPENROUTER_API_KEY",
"XAI_API_KEY": "YOUR_XAI_API_KEY",
"AZURE_OPENAI_API_KEY": "YOUR_AZURE_API_KEY",
"OLLAMA_API_KEY": "YOUR_OLLAMA_API_KEY"
}
}
}
}

Replace placeholder API keys with actual values.

3. Enable Task Master in Cursor
   • Open Cursor Settings (Ctrl+Shift+J)
   • Navigate to the MCP tab
   • Enable task-master-ai by toggling it on

4. Initialize Task Master
   • In the AI chat pane of Cursor:

Initialize taskmaster-ai in my project

5. Set Up Your Product Requirements Document (PRD)
   • New Projects: Create PRD at .taskmaster/docs/prd.txt
   • Existing Projects: Use scripts/prd.txt or migrate using:

task-master migrate

⸻

💬 Common MCP Commands

Interact naturally using these commands:
• Parse Requirements:

Can you parse my PRD at scripts/prd.txt?

    •	Plan Next Step:

What's the next task I should work on?

    •	Implement a Task:

Can you help me implement task 3?

    •	Expand a Task:

Can you help me expand task 4?

    •	Change AI Models:

Change the main, research and fallback models to <model_name>, <model_name> and <model_name> respectively.

⸻

⚠️ Known Issues & Workarounds
• Outdated Task Information: MCP server might occasionally retrieve outdated task data. Restart the MCP server if this happens:

cursor restart-mcp

Using equivalent CLI commands (e.g., task-master next, task-master show <id>) can help ensure you’re accessing up-to-date task information.

⸻

By integrating Task Master AI with Cursor through MCP, we aim to enhance productivity, streamline project management, and leverage AI to support and accelerate our development tasks.
