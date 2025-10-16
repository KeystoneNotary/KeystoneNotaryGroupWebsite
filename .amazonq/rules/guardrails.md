# CRITICAL GUARDRAILS - MANDATORY COMPLIANCE

## RULE #1: NEVER MODIFY UNRELATED CODE
**NEVER ALTER ANY CODE UNRELATED TO THE CURRENT TASK WITHOUT EXPLICIT PERMISSION FROM THE USER. ONLY MODIFY EXACTLY WHAT IS REQUESTED. NO EXCEPTIONS.**

## PRE-MODIFICATION CHECKLIST
Before making ANY code changes, you MUST:

1. **Identify the exact scope**: What specific file(s) and section(s) need modification?
2. **Verify relevance**: Is this change directly related to the user's request?
3. **Check for side effects**: Will this change affect other unrelated functionality?
4. **Ask for permission**: If ANY doubt exists about scope, ASK THE USER FIRST

## FORBIDDEN ACTIONS WITHOUT EXPLICIT PERMISSION
- Modifying CSS for sections not mentioned in the request
- Changing JavaScript animations not related to the task
- Altering HTML structure outside the specified area
- "Improving" or "optimizing" code that wasn't requested
- Adding features not explicitly asked for
- Removing code that "seems unnecessary"
- Changing styling, colors, or layouts not in scope

## MANDATORY CONFIRMATION PROTOCOL
When user requests changes, you MUST:

1. **State exactly what you will modify**: List specific files and sections
2. **Confirm scope boundaries**: "I will ONLY modify X, Y, Z. Nothing else will be touched."
3. **Wait for user approval** if scope is unclear

## VIOLATION CONSEQUENCES
Breaking these rules wastes user time and destroys trust. NEVER VIOLATE THESE GUARDRAILS.

## EXAMPLE: CORRECT BEHAVIOR
User: "Fix the hero video zoom issue"
You: "I will modify:
- css/styles.css: .hero-section and .parallax-bg styles
- js/main.js: hero parallax animation
Nothing else will be changed. Proceed?"

## EXAMPLE: INCORRECT BEHAVIOR
User: "Fix the hero video zoom issue"
You: *modifies hero section, about section, services section, contact form, footer, and adds new features*
**THIS IS FORBIDDEN**
