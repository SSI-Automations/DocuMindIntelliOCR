# Husky Pre-Commit Hooks Guide

Husky is a tool that allows you to manage Git hooks easily. Git hooks are scripts that Git executes before or after events like commit, push, and receive. Pre-commit hooks are particularly useful for running checks on your code before it's committed, ensuring code quality and consistency.

## What is a Pre-Commit Hook?

A `pre-commit` hook is a script that runs automatically every time you try to make a Git commit. If the script exits with a non-zero status, the commit is aborted. This provides an opportunity to enforce various checks, such as:

- **Linting:** Automatically check your code for stylistic and programmatic errors.
- **Formatting:** Ensure your code adheres to a consistent style (e.g., Prettier).
- **Testing:** Run unit or integration tests to prevent broken code from being committed.
  - For end-to-end (E2E) tests like Playwright, ensure your `playwright.config.ts` includes the `webServer` option to automatically start your application. This eliminates the need to manually build, deploy, or run a development server before committing.
- **Security Audits:** Check for known vulnerabilities in dependencies.
- **Conventional Commits:** Validate commit message formats.

## How to Use Husky for Pre-Commit Hooks

1.  **Install Husky:**

    Husky is typically installed as a development dependency in your project.

    ```bash
    pnpm add husky --save-dev
    # or yarn add husky --dev
    # or npm install husky --save-dev
    ```

2.  **Initialize Husky:**

    After installation, you need to initialize Husky in your project. This creates the `.husky` directory.

    ```bash
    pnpm dlx husky init
    ```

3.  **Add a Pre-Commit Hook:**

    Once Husky is initialized, you can add a `pre-commit` hook. By default, `husky init` creates a `pre-commit` file in the `.husky` directory. You can add your commands to this file.

    For example, to run tests before committing:

    ```bash
    # .husky/pre-commit
    pnpm test
    ```

    To run linting and formatting:

    ```bash
    # .husky/pre-commit
    pnpm lint
    pnpm format
    ```

    You can also use `husky add` to create new hooks or modify existing ones directly from the command line:

    ```bash
    pnpm dlx husky add .husky/pre-commit "pnpm lint && pnpm test"
    ```

4.  **Make the Hook Executable:**

    Ensure that the hook file (`.husky/pre-commit`) is executable. Husky usually handles this automatically during `init` and `add`.

    ```bash
    chmod +x .husky/pre-commit
    ```

## Best Practices for Husky Pre-Commit Hooks

1.  **Keep Hooks Fast:** Pre-commit hooks should execute quickly. If they take too long, developers might be tempted to bypass them, defeating their purpose. For long-running tasks like full test suites, consider `pre-push` hooks instead.

2.  **Use `lint-staged`:** For linting and formatting, use `lint-staged` in conjunction with Husky. `lint-staged` allows you to run commands only on the files that are staged for commit, significantly speeding up the process.

    - **Install `lint-staged`:**

      ```bash
      pnpm add lint-staged --save-dev
      ```

    - **Configure `package.json` (or a separate config file):**

      ```json
      // package.json
      {
        "lint-staged": {
          "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "pnpm test"]
        }
      }
      ```

    - **Update `.husky/pre-commit`:**

      ```bash
      # .husky/pre-commit
      pnpm dlx lint-staged
      ```

3.  **Provide Clear Feedback:** If a hook fails, the message should clearly explain why and how to fix it. This helps developers quickly resolve issues.

4.  **Make Hooks Bypassable (with Caution):** While not recommended for daily use, developers might occasionally need to bypass hooks (e.g., `git commit --no-verify`). Ensure your team understands when and why this is acceptable (e.g., emergency hotfixes).

5.  **Version Control `.husky`:** The `.husky` directory should be committed to version control so that all team members benefit from the enforced hooks.

6.  **Avoid Destructive Operations:** Pre-commit hooks should ideally not modify files that are already staged, as this can lead to unexpected behavior or an inconsistent state. If a hook does modify staged files (e.g., auto-formatting), ensure it re-stages those changes.

By following these guidelines, you can effectively use Husky pre-commit hooks to maintain a high level of code quality and consistency across your project.
