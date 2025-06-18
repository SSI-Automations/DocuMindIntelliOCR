# Apidog Development Workflow for Health Coach AI

## 1. Introduction

This document outlines the standard workflow and best practices for using Apidog in the Health Coach AI project. Our API development process is **spec-first**, meaning the `health-coach-ai-api-spec.json` file serves as the single source of truth for all API endpoints, data models, and contracts.

Apidog is our chosen tool for bringing this specification to life, enabling us to visualize, test, mock, and document our API efficiently. Adhering to this workflow ensures that the frontend, backend, and AI agent are always aligned.

## 2. The Golden Rule: The Spec File is King

Any change, addition, or removal of an API endpoint **MUST** be defined in the `health-coach-ai-api-spec.json` file _before_ any implementation code is written.

- **To add a new endpoint:** First, add its definition to the spec file.
- **To change a data model:** First, update the relevant schema in the spec file.

This practice prevents discrepancies and ensures our documentation is never out of date.

## 3. Core Development Workflow

### Step 1: Syncing Your Specification with Apidog

Whenever you pull changes that modify `health-coach-ai-api-spec.json`, or after you modify it yourself, you need to sync it with the Apidog platform.

1.  **Open the Apidog App:** Select the "Health Coach AI" project.
2.  **Navigate to Settings:** Go to the project settings.
3.  **Find "Sync" or "Import":** Look for an option to re-synchronize or import from a file.
4.  **Re-upload the Spec:** Choose to "overwrite" the existing specification with the updated `health-coach-ai-api-spec.json` file from your local repository.

This ensures the Apidog project always reflects the latest contract from our codebase.

### Step 2: Visualizing and Understanding the API

Use the Apidog interface to explore the API structure. The left-hand navigation panel provides a clean, hierarchical view of all available endpoints (e.g., `/clients/{clientId}`). Clicking on an endpoint reveals:

- **HTTP Method:** `GET`, `POST`, `PUT`, etc.
- **Parameters:** Path, query, and header parameters (e.g., `clientId`).
- **Request Body:** The expected JSON structure for `POST` or `PUT` requests.
- **Responses:** All possible success and error responses with their corresponding schemas.

### Step 3: Debugging and Live Testing

Apidog is an excellent client for testing your API endpoints against your running local development server.

**Example: Testing the Login Endpoint**

1.  **Run the App:** Make sure your Next.js development server is running (`pnpm dev`).
2.  **Select the Endpoint:** In Apidog, choose the `POST /auth/login` endpoint.
3.  **Use the Correct Environment:** In the top-right corner of Apidog, ensure the **"Local Development Server"** environment (`http://localhost:3000/api/v1`) is selected.
4.  **Fill the Body:** Go to the "Body" tab in the request panel. Apidog will show a JSON template. Fill it with a valid test user's email and password.
5.  **Send the Request:** Click the "Send" button.
6.  **Analyze the Response:** The "Response" panel will display the live data from your server, including the status code, headers, and the JSON body containing the access token.

### Step 4: Using the Mock Server for Frontend Development

Apidog can generate a **mock server** based on the examples and schemas in the spec file. This is incredibly useful for frontend development, as it allows UI work to proceed without a fully functional backend.

1.  **Activate the Mock Server:** In the Apidog project, find the "Mock" or "Mocking" section.
2.  **Enable Mocking:** Activate the mock server for your project. Apidog will provide a unique URL.
3.  **Use in Frontend:** The frontend team can now make API calls to this mock URL. Apidog will return realistic, schema-compliant placeholder data, effectively decoupling frontend and backend development timelines.

## 4. Best Practices for This Project

- **Embrace Spec-First:** Reiterate that the `.json` file is the starting point for all API work.
- **Follow Naming Conventions:** When adding new endpoints or schemas, follow the existing `camelCase` for properties and `kebab-case` for paths.
- **Write Clear Descriptions:** Every endpoint and property should have a concise `summary` and `description` to make the auto-generated documentation useful.
- **Use Environments:** Always be mindful of whether you are targeting the **Local**, **Staging**, or **Production** environment within Apidog to avoid sending test data to live servers.
- **Security First:** For any new endpoint that requires authentication, remember to include the `"security": [{ "bearerAuth": [] }]` block in its definition.

## 5. How This AI Agent Uses the Apidog MCP Tool

This AI agent is equipped with tools to interact with the Apidog specification directly.

- **Tool:** `mcp_apidog_read_project_oas_ei711p`
- **Functionality:** This allows me to programmatically read the latest version of the API specification that is synced with the Apidog platform.

By using this tool, I can stay informed about the current API structure, understand available endpoints, and generate code or provide assistance that is consistent with the project's API contract. When you ask me to implement a feature that involves an API call, I can first consult the spec to get the exact endpoint, payload, and response structure right.
