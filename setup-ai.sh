#!/usr/bin/env bash
# Installs the AI config files into the places VS Code, Claude Code and Copilot read them.
# Run once from the project root: bash setup-ai.sh
set -e
mkdir -p .claude/agents .vscode .github
cp ai/config/claude-agents/*.md .claude/agents/
cp ai/config/mcp.json .mcp.json
cp ai/config/vscode-mcp.json .vscode/mcp.json
cp ai/config/copilot-instructions.md .github/copilot-instructions.md
echo "Done. Installed: .claude/agents (5), .mcp.json, .vscode/mcp.json, .github/copilot-instructions.md"
