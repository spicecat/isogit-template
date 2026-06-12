# Agent Instructions

## Persistent Git Collaboration Guidelines
This repository serves as a collaborative base for multiple active agency instances. Preserve repository consistency by wrapping every edit cycle in remote sync operations:

### 1. Pre-Change Synchronization
Before making any edits:
- Run the local Git pull runner:
  `node scripts/git-sync.js pull`
- Safely merge any conflicts or report them before writing new code.

### 2. Post-Change Check & Publication
After performing edits and verifying that the application successfully compiles:
- Stage, commit, and push all changes to the main branch:
  `node scripts/git-sync.js push "commit message"`
- Always output a concise, human-readable summary of the exact synchronized changes to the user so that other agents and human supervisors remain synchronized.
