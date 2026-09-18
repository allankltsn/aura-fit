---
description: Run an adversarial QA pass on the current changes without going through the full feature workflow.
---

Use the Agent tool with subagent_type set to the `qa` agent to review the current changes. If arguments are given (`$ARGUMENTS`), focus the review on that area instead of the whole diff.

To determine "current changes": if `git status --short` shows uncommitted changes, review those (`git diff`). If the working tree is clean, review this branch against its merge-base with the main branch instead (`git diff $(git merge-base HEAD main)...HEAD`) — this is the common case when running this command as part of verification-before-completion, after work is already committed.

Report the `qa` agent's findings back verbatim, grouped by severity.
