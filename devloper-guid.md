# Developer Guide

## Core Rules
- NEVER edit a frozen core file.
- Any change to core requires an Architecture Change Proposal (ACP).
- New features go into separate module folders.
- Modules communicate only through public APIs and EventBus.
- Every module must be independently replaceable.

## File Conventions
- `core/` – permanent, loaded via boot.json in order.
- `modules/<name>/` – each feature in its own folder with `module.json`.
- `themes/` – CSS files, loaded dynamically.

## Git Workflow
- `main` – production releases
- `develop` – active development
- `feature/<name>` – per module branches
- Tags: `v<major>.<minor>.<patch>-core` for core freezes

## ISCL Contract

- **Writer must never access `MRIDU.Core.Unicode` directly.**
- All script‑aware operations (cursor, selection, deletion) go through `MRIDU.Core.ISCL`.
- `MRIDU.Core.ISCL` internally depends on `MRIDU.Core.Unicode`.
- This allows the Unicode engine to be replaced or upgraded without affecting any writer module.