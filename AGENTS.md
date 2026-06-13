## Version Control

- Do not create NodeJS or shell scripts (such as `git-sync.js`) to run Git actions
- Always run isomorphic-git commands directly via CLI (`npx isogit <command>`).

### Setup Repository
*(Note: Sourcing `.env` is not required in AI Studio)*
```bash
export $(grep -v '^#' .env | xargs)
npm i -D isomorphic-git && \
npx isogit clone --url="$GIT_ORIGIN" --dir=. --noCheckout && \
npx isogit setConfig --path="user.name" --value="$GIT_USER_NAME" && \
npx isogit setConfig --path="user.email" --value="$GIT_USER_EMAIL" && \
npx isogit checkout --ref=main --force
```

### Pre-Change Pull

Pull latest changes and resolve any conflicts before starting work:

```bash
npx isogit pull
```

### Post-Change Push

After testing, stage, commit, and push all changes:

```bash
npx isogit add . && \
npx isogit commit --message "Your commit message" && \
npx isogit push
```

## Development Guidelines

Prioritize long-term maintainability, clean architecture, and testing over
backwards compatibility.

  - Document design decisions in docs/architecture.md
  - Keep business logic in pure, stateless, unit-testable functions.
  - Restructure and clean up code whenever it improves overall codebase health.
  - Enforce modularity, strict type safety, and eliminate redundant or dead code.
