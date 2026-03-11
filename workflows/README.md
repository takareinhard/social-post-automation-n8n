# Workflows

## threads-x-autopost-sanitized.json

Sanitized public export of an `n8n` workflow for AI-assisted social posting.

Capabilities:

- scheduled execution multiple times per day
- spreadsheet-backed content input and counters
- branching generation strategy for multiple engagement patterns
- LLM-based draft generation and refinement
- post publication flow for Threads
- write-back updates for operational state

Sensitive values have been redacted for safe publication.

## wordpress-ai-rewrite-stable.json

Public `n8n` workflow for refreshing published WordPress articles with Brave Search and Claude.

Capabilities:

- daily scheduled execution
- fetch one published article at a time in ascending date order
- enrich the rewrite prompt with web search results
- rewrite article body while preserving HTML structure
- publish the refreshed content back to WordPress
- store processed progress with `Static Data`
