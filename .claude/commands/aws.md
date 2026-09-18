---
description: Get an AWS infrastructure review or design proposal without going through the full feature workflow.
---

Use the Agent tool with subagent_type set to the `aws` agent. If arguments are given (`$ARGUMENTS`), pass them as the question or area to review (e.g. "review my SAM template" or "design infra for processing 10k messages/day").

If no arguments are given, review the infrastructure-as-code files in the current changes: if `git status --short` shows uncommitted changes, use those (`git diff`); if the working tree is clean, use this branch against its merge-base with the main branch instead (`git diff $(git merge-base HEAD main)...HEAD`) — this is the common case when running this command as part of verification-before-completion, after work is already committed.

Report the `aws` agent's response back.
