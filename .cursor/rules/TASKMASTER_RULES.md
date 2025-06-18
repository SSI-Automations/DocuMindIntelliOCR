# TaskMaster AI Rules

## Initialization and Setup

### ALWAYS follow TaskMaster's built-in workflow:
1. **Initialize project first**: Use `mcp__taskmaster-ai__initialize_project` 
2. **Parse PRD to create tasks**: Use `mcp__taskmaster-ai__parse_prd`
3. **Never manually create or edit `tasks.json`** - this causes validation errors

## Task Structure Requirements

TaskMaster expects this exact JSON structure:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task description",
      "details": "Implementation details",
      "testStrategy": "Testing approach",
      "priority": "high|medium|low",
      "dependencies": [2, 3],
      "status": "pending|in-progress|done|review|deferred|cancelled",
      "subtasks": []
    }
  ]
}
```

### ❌ NEVER use nested structures like:
```json
{
  "master": {
    "tasks": [...]
  }
}
```

## Task Management Commands

### Use TaskMaster's built-in commands only:
- `add_task` - Add new tasks
- `update_task` - Modify existing tasks  
- `set_task_status` - Change task status
- `get_tasks` - Retrieve tasks
- `next_task` - Get next available task

### Validation Commands:
- `get_tasks` - Verify tasks are readable
- `next_task` - Confirm TaskMaster can process tasks
- `validate_dependencies` - Check for circular dependencies

## Troubleshooting

If you get "No valid tasks found" error:
1. Check if tasks.json uses correct flat array structure
2. Reinitialize project: `initialize_project`
3. Re-parse PRD: `parse_prd` with `force: true`
4. Verify with `get_tasks` and `next_task`

## File Management

- TaskMaster manages `.taskmaster/tasks/tasks.json` automatically
- Never edit task files manually
- Use TaskMaster commands for all task operations
- PRD should be in `.taskmaster/docs/prd.txt`

## Best Practices

1. Always initialize TaskMaster before creating tasks
2. Use `parse_prd` to generate initial tasks from requirements
3. Use TaskMaster commands for all task modifications
4. Validate tasks work with `next_task` before proceeding
5. Keep PRD updated in `.taskmaster/docs/prd.txt`