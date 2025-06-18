---
trigger: model_decision
description: Git Conventional Commits
globs:
---

# Git Conventional Commits

Rule for automatically committing changes made by CursorAI using conventional commits format.

<rule>
name: conventional_commits
description: Automatically commit changes made by CursorAI using conventional commits format
filters:
  - type: event
    pattern: "build_success"
  - type: file_change
    pattern: "*"

actions:

- type: execute
  command: |

  # Extract the change type and scope from the changes

  CHANGE*TYPE=""
  case "$CHANGE_DESCRIPTION" in
  *"add"_|_"create"_|_"implement"_) CHANGE_TYPE="feat";;
  _"fix"_|_"correct"_|_"resolve"_) CHANGE_TYPE="fix";;
  _"refactor"_|_"restructure"_) CHANGE_TYPE="refactor";;
  _"test"_) CHANGE_TYPE="test";;
  _"doc"_|_"comment"_) CHANGE_TYPE="docs";;
  _"style"_|_"format"_) CHANGE_TYPE="style";;
  _"perf"_|_"optimize"\_) CHANGE_TYPE="perf";;
  \*) CHANGE_TYPE="chore";;
  esac

  # Extract scope from file path

  SCOPE=$(dirname "$FILE" | tr '/' '-')

  # Commit the changes

  git add "$FILE"
      git commit -m "$CHANGE_TYPE($SCOPE): $CHANGE_DESCRIPTION"

- type: suggest
  message: |
  Changes should be committed using conventional commits format:

  Format: <type>(<scope>): <description>

  Types:

  - feat: A new feature
  - fix: A bug fix
  - docs: Documentation only changes
  - style: Changes that do not affect the meaning of the code
  - refactor: A code change that neither fixes a bug nor adds a feature
  - perf: A code change that improves performance
  - test: Adding missing tests or correcting existing tests
  - chore: Changes to the build process or auxiliary tools

  The scope should be derived from the file path or affected component.
  The description should be clear and concise, written in imperative mood.

examples:

- input: |

  # After adding a new function

  CHANGE_DESCRIPTION="add user authentication function"
  FILE="src/auth/login.ts"
  output: "feat(src-auth): add user authentication function"

- input: |
  # After fixing a bug
  CHANGE_DESCRIPTION="fix incorrect date parsing"
  FILE="lib/utils/date.js"
  output: "fix(lib-utils): fix incorrect date parsing"

metadata:
priority: high
version: 1.0
</rule>
