---
description: Get an AWS infrastructure review or design proposal without going through the full feature workflow.
---

Use the Agent tool with subagent_type set to the `aws` agent. If arguments are given
(`$ARGUMENTS`), pass them as the question or area to review (e.g. "review my SAM
template" or "design infra for processing 10k messages/day"). If no arguments are
given, review the infrastructure-as-code files changed in the current diff
(`git diff` / `git status`).

Report the `aws` agent's response back.
