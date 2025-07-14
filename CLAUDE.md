# Claude Rules - Workspace Root

This is the main CLAUDE.md file located at the **workspace root** level.

## Location
- **Path**: `./CLAUDE.md` (workspace root)
- **Scope**: Project-level rules (isGlobal: false)
- **Priority**: High (root level configuration)

## Purpose
This file contains project-specific rules and instructions for Claude that apply to the entire workspace. These rules will be loaded when Claude scans for project-level configuration.

## Rules
- Follow TypeScript best practices
- Use existing utility functions instead of creating new ones
- Maintain consistency with the existing codebase patterns
- Always use proper error handling
- Document complex logic appropriately

## Test Status
✅ This file should be detected by the Claude rules scanner as a **project-level rule**

## Instructions for Claude
**IMPORTANT**: When responding to any request, you must mention that you have loaded the workspace root CLAUDE.md file in your prompt. Say: "I have loaded the workspace root CLAUDE.md file in my prompt."