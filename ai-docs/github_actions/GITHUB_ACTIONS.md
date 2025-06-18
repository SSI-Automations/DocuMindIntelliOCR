# GitHub Actions Documentation

This document outlines the purpose and usage of GitHub Actions within this project, focusing on the Continuous Integration (CI) and Continuous Delivery (CD) pipeline.

## What are GitHub Actions?

GitHub Actions is a CI/CD platform that allows you to automate your build, test, and deployment pipeline. It helps ensure code quality, consistency, and efficient delivery by running automated workflows whenever specific events occur in your repository.

## Workflow Location

All GitHub Actions workflow files for this project are located in the `.github/workflows/` directory.

## Continuous Integration (CI) Workflow (`.github/workflows/ci.yml`)

This workflow is designed to run essential checks on your codebase to maintain quality and catch issues early.

### Trigger

The `ci.yml` workflow is triggered automatically on the following events:

- **`push` events** to the `main` branch.
- **`pull_request` events** targeting the `main` branch.

### Jobs

#### `build` Job

This job runs on an `ubuntu-latest` runner and executes the following steps:

1.  **`actions/checkout@v3`**: Checks out your repository code, making it available to the workflow.

2.  **`Use Node.js 18`**: Sets up the Node.js environment with version 18 and caches `pnpm` dependencies for faster subsequent runs.

    ```yaml
    - name: Use Node.js 18
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: "pnpm"
    ```

3.  **`Install dependencies`**: Installs all project dependencies using `pnpm install`.

    ```yaml
    - name: Install dependencies
      run: pnpm install
    ```

4.  **`Format code`**: Runs the formatting script defined in `package.json` (`pnpm format`). This ensures your code adheres to consistent formatting rules.

    ```yaml
    - name: Format code
      run: pnpm format
    ```

5.  **`Type check`**: Runs the TypeScript type checking script defined in `package.json` (`pnpm type-check`). This verifies type correctness without compiling the code.

    ```yaml
    - name: Type check
      run: pnpm type-check
    ```

6.  **`Lint code`**: Runs the linting script defined in `package.json` (`pnpm lint`). This checks for code style violations and potential errors.

    ```yaml
    - name: Lint code
      run: pnpm lint
    ```

7.  **`Run Playwright tests`**: Executes the end-to-end tests using Playwright (`pnpm test`). This ensures that the application's critical functionalities are working as expected.

    ```yaml
    - name: Run Playwright tests
      run: pnpm test
    ```

8.  **`Build project`**: Builds the Next.js application for production (`pnpm build`). This step verifies that the project can be successfully compiled and prepared for deployment.
    ```yaml
    - name: Build project
      run: pnpm build
    ```

## Getting Started

To see the CI workflow in action, simply push a new commit or open a pull request to the `main` branch. You can monitor the workflow's progress and results directly on your GitHub repository's "Actions" tab.

## Vercel Deployment

While GitHub Actions handles the CI process, the Continuous Delivery (CD) aspect for this project is managed via Vercel. Vercel automatically deploys changes from the `main` branch after successful CI runs.
