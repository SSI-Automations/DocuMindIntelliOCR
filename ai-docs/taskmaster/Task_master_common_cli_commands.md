# Task Master AI CLI: Essential Commands & Workflows

This guide provides essential commands and recommended workflows to efficiently use the Task Master AI CLI tool for streamlined project and task management.

---

## 📦 Installation

**Global installation:**

```bash
npm install -g task-master-ai
```

**Local installation:**

```bash
npm install task-master-ai
```

---

## 🚀 Project Initialization

Initialize Task Master in your project:

```bash
task-master init
```

---

## 📄 Parsing Product Requirements Document (PRD)

Parse your PRD to actionable tasks:

```bash
task-master parse-prd scripts/prd.txt
```

---

## 📋 Task Management

- **List all tasks:**

```bash
task-master list
```

- **Show next task:**

```bash
task-master next
```

- **Show specific task details:**

```bash
task-master show <task_id>
```

---

## 🧠 Task Complexity Analysis

Analyze task complexity:

```bash
task-master analyze-complexity
```

**Options:**

- Specify output file:

```bash
task-master analyze-complexity --output=my-report.json
```

- Use specific AI model:

```bash
task-master analyze-complexity --model=claude-3-opus-20240229
```

- Set complexity threshold:

```bash
task-master analyze-complexity --threshold=6
```

---

## 🔄 Task Expansion

- Expand specific task:

```bash
task-master expand --id=8
```

- Expand all tasks:

```bash
task-master expand --all
```

---

## 🔗 Task Dependencies

- **Add dependency:**

```bash
task-master add-dependency --id=<task_id> --depends-on=<dependency_id>
```

- **Remove dependency:**

```bash
task-master remove-dependency --id=<task_id> --depends-on=<dependency_id>
```

- **Validate dependencies:**

```bash
task-master validate-dependencies
```

- **Fix dependencies:**

```bash
task-master fix-dependencies
```

---

## ➕ Adding Tasks

Add new task:

```bash
task-master add-task --prompt="Description"
```

- Specify dependencies:

```bash
task-master add-task --prompt="Description" --dependencies=1,2,3
```

- Set priority:

```bash
task-master add-task --prompt="Description" --priority=high
```

---

## ✅ Updating Task Status

- Mark task as in-progress:

```bash
task-master update --id=<task_id> --status=in-progress
```

- Mark task as done:

```bash
task-master update --id=<task_id> --status=done
```

---

## 🧪 Generate Task Files

Generate files from `tasks.json`:

```bash
task-master generate
```

---

## 🛠️ Additional Commands

- **Export tasks:**

```bash
task-master export [target_directory]
```

- **Import tasks:**

```bash
task-master import <filepath>
```

- **Configure CLI:**

```bash
task-master config [--no-colors]
```

---

## 🧠 Best Practices

- Begin with a detailed PRD for best results.
- Regularly review generated tasks and dependencies.
- Frequently analyze and expand complex tasks.
- Keep your task status updated.
- Use dependency validation regularly.

Following this guide will enhance productivity and maintain clarity throughout your project lifecycle using Task Master AI CLI.
