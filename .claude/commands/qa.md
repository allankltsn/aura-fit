---
description: Run an adversarial QA pass on the current changes without going through the full feature workflow.
---

Use the Agent tool with subagent_type set to the `qa` agent to review the current
uncommitted changes (`git diff` / `git status` to see what changed). If arguments
are given (`$ARGUMENTS`), focus the review on that area instead of the whole diff.

Report the `qa` agent's findings back verbatim, grouped by severity.
