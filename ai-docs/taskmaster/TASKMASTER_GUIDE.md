# TaskMaster AI: Project-Specific Usage Guide

This guide outlines the best practices for leveraging TaskMaster AI within this project. It covers how to use TaskMaster for both large, PRD-driven features and smaller, ad-hoc implementations, ensuring consistency, efficiency, and high-quality outputs.

## 1. Best Practices for Using TaskMaster AI

To get the most out of TaskMaster AI, adhere to the following best practices:

- **Start with a Clear PRD for Large Features**: For major features or epics, always begin by defining a comprehensive Product Requirements Document (PRD). Place your PRD in the `.taskmaster/docs/` directory. TaskMaster's `parse_prd` tool is designed to ingest these documents and generate a structured `tasks.json` file, forming the backbone of your project plan.
- **Iterative Task Breakdown**: After initial task generation, use `analyze_project_complexity` to identify complex tasks. Then, use `expand_task` with the `--research` and `--force` flags to break down these tasks into detailed subtasks. This ensures a granular plan for implementation.
- **Log Implementation Progress via `update_subtask`**: This is crucial for maintaining a rich, timestamped history of your development journey. Before implementing a subtask, explore the codebase and plan your changes. Then, use `update_subtask` to log:
  - Proposed code changes (diffs), file paths, and line numbers.
  - Reasoning behind design choices.
  - Any challenges encountered or solutions discovered.
  - Specific successful code snippets or configurations.
  - Decisions made, especially if confirmed with user input.
    Continuously update the subtask with new findings as you progress, creating a detailed audit trail.
- **Utilize Dependency Management**: Clearly define task dependencies using `add_dependency`. This ensures tasks are worked on in the correct order, preventing bottlenecks and ensuring a logical flow of development. Regularly `validate_dependencies` to maintain integrity.
- **Regularly Update Task Status**: Keep task statuses (`pending`, `in-progress`, `done`, `review`, `deferred`, `cancelled`) accurate using `set_task_status`. This provides real-time visibility into project progress.
- **Generate Task Files**: After any significant changes to `tasks.json` (e.g., parsing PRD, adding/expanding tasks), run `generate` to create or update the individual Markdown task files in the `tasks/` directory. These files serve as human-readable summaries of each task.
- **Leverage AI for Research**: When using AI-powered tools like `parse_prd`, `analyze_project_complexity`, `add_task`, `update_task`, `update_subtask`, or `expand_task`, always consider using the `--research` flag. This enables TaskMaster to use a dedicated research model (like Perplexity AI) for more informed and comprehensive outputs.
- **Consult `next_task` for Prioritization**: Before starting new work, always run `next_task` to identify the most logical task to work on, considering dependencies and priorities.
- **Commit Code and Update Rules**: Once a subtask or task is complete, commit your code with a clear Git message. If new patterns, conventions, or best practices emerged during implementation, update or create new rules in the `.cursor/rules/` directory to ensure continuous improvement.

## 2. What Not to Do

Avoid these actions to prevent issues and ensure TaskMaster's effectiveness:

- **Do NOT Manually Edit `tasks.json`**: This file is managed by TaskMaster AI. Manual edits can lead to inconsistencies and data corruption. Always use the provided MCP tools or CLI commands to modify tasks.
- **Do NOT Over-Automate Small, Simple Tasks**: For very simple, one-off tasks that don't require AI-driven breakdown or dependency tracking, direct implementation might be more efficient than creating a formal TaskMaster entry. Use your judgment.
- **Do NOT Neglect Status Updates**: Leaving tasks with outdated statuses can lead to a skewed view of project progress and block dependent tasks from being identified as "next."
- **Do NOT Ignore Dependency Warnings**: If `validate_dependencies` flags issues, address them promptly using `fix_dependencies` or by manually adjusting relationships. Circular dependencies can halt progress.
- **Do NOT Over-Rely on AI without Review**: While powerful, AI-generated content (tasks, subtasks, details) should always be reviewed for accuracy, completeness, and alignment with project goals. Adjust as needed.
- **Do NOT Skip PRD for Large Features**: Attempting to manage a large, complex feature without a foundational PRD can lead to a disorganized task list and scope creep.

## 3. How to Yield the Best Outputs

- **Provide Detailed and Clear Prompts**: When using AI-powered tools (e.g., `add_task`, `update_task`, `update_subtask`, `expand_task`), provide as much context and detail in your prompts as possible. The more specific your input, the better the AI's output will be.
- **Format Your PRD Properly**: For `parse_prd`, ensure your PRD (`.taskmaster/docs/prd.txt`) is well-structured with clear sections for overview, features, technical architecture, and logical dependency chains. Use markdown headings and bullet points for readability. Refer to `.taskmaster/templates/example_prd.txt` as a template.
- **Use Research Capabilities Wisely**: The `--research` flag in AI-powered tools provides more informed outputs. Use it when you need deeper analysis or external context for task generation, updates, or complexity analysis.
- **Iterate on Task Definitions**: Don't expect perfect tasks on the first pass. Use `update_task` and `update_subtask` to refine titles, descriptions, and details as your understanding of the implementation evolves.
- **Maintain Accurate Configuration**: Ensure your `.taskmaster/config.json` (managed via `models` tool/CLI) is correctly set up, especially regarding AI models and parameters. This directly impacts the quality of AI-generated content.

## 4. Using TaskMaster for Small Features vs. Large Features (PRD-based)

TaskMaster is flexible and can be adapted to various scales of work:

### For Large Features (PRD-based Workflow):

1.  **Create a Comprehensive PRD**: Document the entire feature in a PRD file (e.g., `new_feature_prd.txt`) in `.taskmaster/docs/`. Include overview, core features, UX, technical architecture, development roadmap, and logical dependency chain.
2.  **Parse the PRD**: Run `parse_prd --input=.taskmaster/docs/new_feature_prd.txt` (and ideally `--research`) to generate the initial `tasks.json` with top-level tasks.
3.  **Analyze Complexity**: Use `analyze_project_complexity` to identify tasks requiring deeper breakdown.
4.  **Expand Complex Tasks**: Use `expand_task --id=<task_id> --force --research` to generate detailed subtasks for identified complex tasks.
5.  **Iterative Implementation & Logging**: Follow the iterative subtask implementation workflow outlined in "Best Practices," using `update_subtask` to log progress and findings.
6.  **Manage Dependencies**: Actively use `add_dependency`, `remove_dependency`, `validate_dependencies`, and `fix_dependencies` to ensure a smooth flow between tasks and subtasks across the entire feature.
7.  **Generate & Review Task Files**: Regularly `generate` task files for easy review and understanding of the evolving project plan.

### For Small Features or Ad-Hoc Tasks (Non-PRD based):

Sometimes, a full PRD is overkill for a small bug fix or a minor enhancement. For these scenarios, you can use TaskMaster more directly:

1.  **Add a New Task Directly**: Use `add_task --prompt="Implement X feature with Y details..."` to create a new top-level task. Provide a descriptive prompt that encapsulates the goal, description, details, and test strategy. Consider `--research` if the task has some technical unknowns.
2.  **Break Down Manually (Optional)**: If the small feature still benefits from subtasks, you can manually add them using `add_subtask --parent=<task_id> --title="Subtask title" --description="..."`. Alternatively, if the prompt for `add_task` was comprehensive enough, TaskMaster might generate subtasks automatically, or you can use `expand_task` on it if it becomes unexpectedly complex.
3.  **Use `update_task` / `update_subtask` for Refinement**: As with large features, use `update_task` or `update_subtask` to append notes, code snippets, or new findings during implementation.
4.  **Set Status & Complete**: Mark the task/subtask `in-progress` and then `done` once completed using `set_task_status`.
5.  **Generate Task Files**: Run `generate` to reflect the new task in the markdown files.

By following this guide, you will be able to leverage TaskMaster AI efficiently for managing your health coach AI beta project, whether you're tackling a major new feature or a small improvement.
