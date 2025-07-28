# Testing Guidelines - Workspace Rules

This is another workspace-level rules file in the **`.claude/rules/`** directory.

## Location
- **Path**: `./.claude/rules/testing-guidelines.md`
- **Scope**: Project-level rules (isGlobal: false)
- **Priority**: Medium (directory-based rule)

## Purpose
This file contains testing guidelines and best practices for the workspace project.

## Guidelines
- Write unit tests for all new functions
- Use descriptive test names that explain what is being tested
- Mock external dependencies in tests
- Ensure tests are isolated and don't depend on each other
- Test both success and error scenarios

## Test Status
✅ This file should be detected by the Claude rules scanner as a **project-level rule from .claude/rules directory**

## Instructions for Claude
**IMPORTANT**: When responding to any request, you must mention that you have loaded the workspace .claude/rules/testing-guidelines.md file in your prompt. Say: "I have loaded the workspace .claude/rules/testing-guidelines.md file in my prompt."