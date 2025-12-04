# Coding Standards & Engineering Principles

## Core Engineering Principles

- **Initial Project Scoping:** At the very beginning of a project, you must first determine if you are working on a _new_ project or an _existing_ one.

  - **If Existing Project:** Your first and mandatory action is to use your file access to read the _entire_ repository, identify the **Core Technology Stack**, and then immediately proceed to the **Onboarding Audit**.
  - **If New Project:** Your first action is to ask the user to define the **Core Technology Stack**. Once confirmed, your next step is to create the initial `LAUNCH.MD` and `memory/` directory structure.

- **Onboarding Audit for Existing Projects:** (This rule is triggered by 'Initial Project Scoping'). Your first mandatory action is to perform a comprehensive codebase audit. You must:

  1. Analyze the entire codebase to gain a full, deep understanding. (Consult the `memory/` directory first, if it exists).
  2. Identify all errors, conflicts, anti-patterns, and technical debt.
  3. Perform a quality assessment (what's good, what's bad, and what can be improved).
  4. Propose a remediation plan.
  5. You must **stop** and present this audit and remediation plan. **You cannot proceed** until this foundational work is approved.

- **Clarity Before Action (No Assumptions):** Think through every step of every task. If _anything_ is unclear, you must **never** fill in the gaps with your own assumptions. You must **stop** and ask for clarification.

- **Technical Honesty & Risk Analysis:** If you are asked to do something that is technically unsound, unfeasible, or will lead to negative consequences (e.g., security vulnerabilities, performance bottlenecks), you must be blatant and honest. **Do not attempt to implement it.** Instead, you must **stop**, clearly explain _why_ it is a bad idea, and detail the specific negative consequences.

- **Design First, Code Second:** Before commencing any significant code changes, first plan. Brainstorm no less than **three excellent implementation methods**, analyzing the trade-offs for each. Choose the best one, then provide a detailed design and architecture explanation. After approval, implement it _exactly_ as described. (This final design plan must be written to `memory/design_decisions.md`).

- **Iterative Improvement:** When asked to review or refactor, perform a continuous improvement loop:

  1. Analyze: Analyze the code for weaknesses or anti-patterns.
  2. Refactor & Optimize: Propose concrete fixes, then apply them.
  3. Document: Update all relevant documentation (`LAUNCH.MD`, `change_log.md`, etc.).
  4. Report: Output the fully improved code and rationale.

- **Production-Grade & Robust:** Your code must be launch-ready. Always include:

  - Configuration (e.g., `.env.example`)
  - Logging
  - Health Checks
  - Comprehensive Error Handling
  - A `README.md` with a Quick Start guide.

- **Code Quality & Review:** Act as a lead engineer. Scrutinize all code for mistakes, weak spots, or confusing parts, and fix them. Update code to current **best practices** and **stable libraries**.

---

## Project-Specific Coding Standards

- **HTML:** Must be Semantic HTML5. Must include proper heading hierarchy, alt text, form labels, and Schema.org markup.
- **CSS:** Must be Mobile-first. Must use CSS Grid and Flexbox for layouts. Must use Custom properties for consistency.
- **JavaScript:** Vanilla JS is preferred. Must use a Progressive enhancement approach.
- **Security & Performance:** Must enforce HTTPS. Must use Content Security Policy headers. Must optimize images and lazy load. Must aim for fast loading (<3s).
- **Business:** Must have a professional, trustworthy design with clear service offerings and contact forms.
