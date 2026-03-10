# Social Post Automation with n8n

Public portfolio repository for an AI-assisted social content automation workflow built with `n8n`.

This project showcases how to design, sanitize, and publish a production-style workflow that:

- schedules recurring social post generation for `Threads` and `X`
- uses multiple LLM stages to generate, refine, and diversify short-form content
- references spreadsheet-based content sources and posting history
- applies branch-based content strategy for different engagement goals
- publishes through API calls and updates workflow counters automatically
- ships with a sanitized public export suitable for GitHub sharing

## Why This Repository Exists

This repository is designed to be a strong public artifact for portfolio scoring platforms such as `LAPRAS` and `Findy`.

It demonstrates practical engineering skills beyond toy code:

- workflow automation design
- prompt architecture for multi-stage generation
- operational thinking around scheduling, retries, and state tracking
- secure open-source publication through credential and identifier sanitization
- documentation for reproducibility and reviewability

## Project Highlights

### 1. End-to-end workflow design
The workflow coordinates scheduling, content retrieval, AI generation, post-processing, publishing, and counter updates inside one `n8n` flow.

### 2. Multi-branch content strategy
The automation uses branching to vary post style and engagement intent, rather than generating the same format every time.

Example strategy directions:

- comment-oriented posts
- empathy-oriented posts
- share-oriented posts
- save-oriented posts

### 3. Multi-model orchestration
The workflow combines multiple AI stages so that one model can generate raw ideas and another can refine tone, pacing, and hook quality.

### 4. Security-conscious publication
The public export was sanitized before publication. Sensitive values such as tokens, spreadsheet IDs, credential references, and instance identifiers are removed or replaced with placeholders.

## Repository Structure

```text
workflows/
  threads-x-autopost-sanitized.json
scripts/
  sanitize-n8n-workflow.mjs
n8n-discord-anime-image-generator/
  README.md
  workflow.sanitized.json
```

## Main Workflow

File:
[`workflows/threads-x-autopost-sanitized.json`](workflows/threads-x-autopost-sanitized.json)

What it contains:

- scheduled triggers for multiple posting times per day
- Google Sheets reads for content source and workflow counters
- branching logic for multiple content-generation patterns
- LLM-based generation and refinement nodes
- API publishing flow for Threads
- write-back steps for operational bookkeeping

## Sanitization Script

File:
[`scripts/sanitize-n8n-workflow.mjs`](scripts/sanitize-n8n-workflow.mjs)

This script converts a private `n8n` export into a GitHub-safe public artifact by redacting:

- access tokens
- credential IDs and names
- spreadsheet IDs and cached URLs
- internal instance identifiers
- account-specific naming where appropriate

### Run

```bash
node scripts/sanitize-n8n-workflow.mjs <private-workflow.json> <public-output.json>
```

## Technical Stack

- `n8n`
- `JavaScript / Node.js`
- `Google Sheets`
- `Anthropic Claude`
- `Google Gemini`
- `Threads API`

## Portfolio Value

This repository emphasizes the kind of work often valued in product and automation roles:

- designing reliable internal tooling
- connecting SaaS systems through automation
- building AI-powered content pipelines
- documenting real implementation tradeoffs
- treating secret management as part of engineering quality

## Safe Publishing Notes

This repository intentionally includes sanitized exports only.
Do not commit raw workflow exports that contain:

- real API tokens
- real credential bindings
- real spreadsheet IDs
- internal instance metadata

## Future Improvements

- split generation prompts by engagement goal more explicitly
- externalize prompts into versioned template files
- add automated validation for placeholder leakage before commit
- add snapshot tests for sanitization output

## License

This repository is shared for portfolio and educational purposes.

