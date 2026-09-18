---
description: Run a focused security audit on the current changes without going through the full feature workflow.
---

Use the Agent tool with subagent_type set to the `security` agent to audit the
current uncommitted changes (`git diff` / `git status` to see what changed). If
arguments are given (`$ARGUMENTS`), focus the audit on that area instead of the
whole diff.

Report the `security` agent's findings back verbatim, grouped by severity.
