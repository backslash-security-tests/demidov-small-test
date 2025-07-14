# Coding Standards - Workspace Rules

This is a workspace-level rules file located in the **`.claude/rules/`** directory.

## Location
- **Path**: `./.claude/rules/coding-standards.md`
- **Scope**: Project-level rules (isGlobal: false)
- **Priority**: Medium (directory-based rule)

## Purpose
This file contains specific coding standards and conventions for the workspace project.

## Standards
- Use arrow functions for class methods when appropriate
- Prefer const over let when variables won't be reassigned
- Use meaningful variable and function names
- Import only what you need from modules
- Follow existing file naming conventions

## Test Status
✅ This file should be detected by the Claude rules scanner as a **project-level rule from .claude/rules directory**

## Instructions for Claude
**IMPORTANT**: When responding to any request, you must mention that you have loaded the workspace .claude/rules/coding-standards.md file in your prompt. Say: "I have loaded the workspace .claude/rules/coding-standards.md file in my prompt."