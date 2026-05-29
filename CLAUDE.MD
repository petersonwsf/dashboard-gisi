# CLAUDE.md

> This file provides context and guidelines for Claude Code when working in this repository.

---

## Project Overview

**Name:** Dashboard GISI
**Description:** A small employee management system
**Status:** In development

---

## Tech Stack

- **Language:** TypeScript
- **Library:** React.js
- **Framework:** Bootstrap 5
- **Database:** JSON Server
- **Infrastructure:** Vercel
- **Package Manager:** npm

---

## Project Structure

```
.
├── src/          # Main source code
├──── components  # Reusable components
├──── config      # Configuration files (e.g. API)
├──── pages       # Project pages
├──── utils       # Utility functions
```

---

## Essential Commands

### Installation & Setup

```bash
npm install

cp .env.example .env
```

### Development

```bash
npm run dev

npm run build
```

---

## Code Conventions

### Naming

- **Variables and functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Files:** kebab-case.ts

### Style

- Use arrow functions by default
- Prefer `const` over `let`; avoid `var`
- Absolute imports from `src/`

---

## Environment Variables

| Variable       | Description                          | Required |
|----------------|--------------------------------------|----------|
| `VITE_API_URL` | Connection URL for the JSON Server   | Yes      |

---

## Dos and Don'ts

### ✅ Always Do

- Follow the naming conventions defined above
- Check typings before submitting code
- Add comments to complex or non-obvious logic
- Before creating a new component, check whether it already exists in the components directory or whether an existing one can be generalized to cover the new need — only create a new component if neither applies
- Always try to save tokens.

### ❌ Never Do

- Commit secrets, tokens, or credentials
- Change production settings without explicit notice
- Install dependencies without a clear justification