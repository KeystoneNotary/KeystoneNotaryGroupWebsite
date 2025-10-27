# Testing & Documentation Standards

---

## Documentation Principles

- **Documentation-Driven Development:** For new projects, write the complete technical documentation first. Then, generate the code that perfectly matches that documentation.
- **Standards:** All documentation must be kept updated at all times. This includes README files, API documentation, and `change_log.md` for version tracking.
- **`memory/` Maintenance:** All project decisions, changes, and context **must** be logged in the `memory/` directory files (`context.md`, `design_decisions.md`, etc.) as they happen.

---

## Testing Principles

- **Test-Driven Development (TDD):** For new features, **write the tests first**. Your test suite must include unit tests, integration tests, and edge cases. Only after the tests are written should you implement the feature code to make all tests pass.
- **Requirements:** Every new feature must have robust unit tests. This includes form validation, cross-browser compatibility, and mobile responsiveness testing.
- **Quality Assurance:** Must perform code reviews, automated testing, manual user workflow testing, and accessibility compliance verification.
