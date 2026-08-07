# AI Agent MCP Platform

## 01 — Executive Summary

**What did I build?**
An autonomous AI agent platform utilizing the Model Context Protocol (MCP) to securely execute tools across external services (Gmail, Notion, GitHub, Telegram) via natural language.

**What problem does it solve?**
Current LLM integrations are often tightly coupled to specific APIs, creating brittle architectures and security vulnerabilities when giving models access to user data. This platform creates a secure, standardized boundary between the LLM reasoning engine and infrastructure execution.

**Who is it for?**
Power users and teams who need to automate complex workflows across multiple SaaS applications without writing custom scripts, while maintaining strict control over authorization boundaries.

**What makes it technically interesting?**
The system implements a zero-trust architecture where the LLM cannot directly access infrastructure. Instead, it emits structured tool calls that are validated against a dynamic Tool Registry before execution. Furthermore, it solves the complex challenge of managing long-lived agent sessions alongside short-lived OAuth tokens.

**What was my contribution?**
Designed and implemented the full-stack architecture, including the Next.js React frontend, the asynchronous FastAPI backend, the relational PostgreSQL database schema, the OAuth integration flows, and the secure MCP tool execution pipeline.

---

## 02 — Problem & Requirements

**Problem**
Integrating LLMs with external tools (like Gmail or Notion) usually involves giving the model direct API keys or building hardcoded, inflexible function calls. This leads to security risks, difficult maintenance, and an inability to easily scale the number of integrations.

**Requirements**
- A standardized protocol for LLM tool execution.
- Strict isolation between the LLM and external APIs.
- Secure handling of user OAuth tokens.
- Real-time communication for conversational UI.
- Deterministic and isolated webhook workflows.

**Architecture**
- Frontend: Next.js for a responsive, real-time user interface.
- Backend: FastAPI for asynchronous, high-throughput request handling.
- Database: PostgreSQL for strict relational integrity of users, sessions, and workflow states.

**Implementation**
Implemented a Tool Registry pattern where the LLM only knows the schemas of available tools. The backend handles token injection, schema validation, and secure execution.

**Result**
A highly extensible platform where adding a new integration (e.g., GitHub) requires only registering a new tool schema and its executor, without touching the core LLM reasoning loop.

---

## 03 — System Architecture

```text
                    ┌──────────────┐
                    │   Frontend   │
                    │   Next.js    │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │     FastAPI     │
                  │    REST API     │
                  └───────┬─────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        PostgreSQL      AI Agent    Integrations
                         │           │
                         ▼           ├── Gmail
                       Tools         ├── Notion
                                     ├── GitHub
                                     └── Telegram
```

**Why this architecture?**
- **Next.js (Frontend):** Provides React Server Components and App Router for optimized rendering, while maintaining a rich, interactive client for the chat and workflow builder interfaces.
- **FastAPI (Backend):** The asynchronous nature of FastAPI natively matches the I/O-bound workload of waiting for LLM responses and external API calls. Python is also the standard ecosystem for AI/LLM tooling.
- **PostgreSQL:** Essential for the strict relational integrity required by OAuth connections, user sessions, and conversational state, while utilizing `JSONB` for flexible tool execution payloads.

---

## 04 — AI Agent Architecture

The AI Agent does not have direct access to the internet or APIs. It operates strictly through the Tool Registry.

```text
User
 ↓
Conversation API
 ↓
LLM
 ↓
Tool Selection
 ↓
Tool Executor
 ↓
External Service
 ↓
Tool Result
 ↓
LLM
 ↓
Final Response
```

**Preventing direct LLM infrastructure access:**

```text
LLM
 │
 │ structured tool call
 ▼
Tool Registry
 │
 ▼
Validation
 │
 ▼
Tool Executor
 │
 ▼
External API
```
The LLM generates a structured JSON payload targeting a specific tool. The **Tool Registry** intercepts this payload, validates it using Pydantic schemas, injects the securely retrieved OAuth token for the authenticated user, and invokes the **Tool Executor**. The LLM never sees the API keys or OAuth tokens.

---

## 05 — Authentication & Authorization

- **Decision:** JWT with HttpOnly cookies.
- **Alternatives:** Stateful sessions (Redis).
- **Reason:** Allows the API to remain stateless, making horizontal scaling trivial while securing the token from XSS attacks via HttpOnly cookies.
- **Trade-off:** Token invalidation requires a token blacklist or relying on short expiration times paired with refresh tokens.

---

## 06 — Integration Architecture

Integrations (Gmail, Notion, GitHub, Telegram) follow a strict OAuth 2.0 flow.

**Authentication Flow:**
```text
User
 ↓
OAuth Provider (e.g., Google)
 ↓
Authorization Code
 ↓
Backend Callback
 ↓
Token Exchange
 ↓
Encrypted/secure token storage (PostgreSQL)
 ↓
Tool execution
```

**Data Flow & Error Handling:**
When an integration tool is called, the system retrieves the user's access token. If the API returns a `401 Unauthorized`, the backend automatically attempts to use the refresh token to get a new access token, updates the database, and retries the tool execution without interrupting the LLM's thought process.

---

## 07 — Database Architecture

**Core Entities:**
```text
users           - Core identity
sessions        - Active JWT sessions
connections     - OAuth tokens (Gmail, Notion, etc.)
conversations   - Chat threads
messages        - Individual LLM/User messages
workflows       - Automated event-driven triggers
events          - Webhook/trigger logs
```

**Design Decisions:**
- **Relational Integrity:** Foreign keys ensure that when a user is deleted, all their connections and conversations cascade.
- **JSONB for flexibility:** The `messages` table uses `JSONB` to store the raw LLM tool calls and responses, as these schemas change depending on the tool invoked.

**Incident: Deterministic webhook token generation**
```text
User ID
   ↓
JWT payload
   ↓
Same payload
   ↓
Same JWT
   ↓
Unique constraint violation
```
*Resolution:*
```text
Random workflow token
   ↓
Unique token per workflow
   ↓
Correct isolation
```
We encountered a bug where deterministic payload generation for webhook URLs caused duplicate keys. The solution was implementing cryptographically secure random tokens per workflow, ensuring perfect isolation.

---

## 08 — Security

This application implements security-in-depth:

- **Authentication:** JWT with HttpOnly cookies prevents XSS extraction.
- **Authorization Boundaries:** Row-Level Security (RLS) concepts implemented at the ORM level ensure users can only query their own `connections` and `conversations`.
- **Secret Management:** OAuth tokens are encrypted at rest in PostgreSQL.
- **Input Validation:** Strict Pydantic models on the FastAPI side reject malformed payloads before they reach the controller logic.
- **Webhooks:** Webhook URLs use high-entropy, unique tokens rather than predictable IDs to prevent enumeration attacks.
- **CORS:** Strictly limited to the Next.js frontend origin.

---

## 09 — Error Handling & Observability

- **Structured Errors:** All API errors return a standard JSON structure with `error_code`, `message`, and `details`.
- **Request IDs:** A custom middleware injects a `X-Request-ID` into every incoming request. This ID is propagated through all logging, making it trivial to trace a failed tool execution back to the original user prompt.
- **External API Failures:** If Notion is down, the Tool Executor catches the `503`, formats it into a human-readable prompt, and passes it *back* to the LLM, allowing the agent to gracefully inform the user of the outage.

---

## 10 — Performance & Scalability

The system is designed to scale horizontally because the API is entirely stateless.

- **Async Python:** FastAPI with `asyncio` ensures that the server isn't blocking while waiting for 5-second LLM generations.
- **Connection Pooling:** SQLAlchemy utilizes async connection pooling to prevent database exhaustion under load.
- **Stateless API:** Any request can hit any backend container.
- **PostgreSQL Indexes:** B-Tree indexes applied to `user_id` on all high-volume tables (`messages`, `events`) ensure fast lookups.

---

## 11 — Testing

```text
Unit Tests (Tool Schemas, Utilities)
    ↓
Integration Tests (Database CRUD, Token Refresh)
    ↓
API Tests (FastAPI Endpoints)
    ↓
External Integration Tests (Mocked OAuth & LLM calls)
```

**Why this approach?**
External API calls (LLM, Gmail) are mocked during standard CI runs to prevent flaky tests and API costs. We specifically integration-test the Token Refresh logic because silent token expiration is the #1 cause of workflow failure in production.

---

## 12 — Engineering Challenges

**Problem:** Gmail OAuth tokens expired during tool execution.  
**Root cause:** Access tokens have a limited lifetime (usually 1 hour), while the agent session or workflow might execute much later.  
**Solution:** Implemented robust refresh-token handling and automatic token renewal interceptors before executing any Gmail tools.  
**Result:** Tool execution no longer depends on the initial OAuth session remaining valid.

**Problem:** The LLM hallucinated tool arguments that violated the external API schemas.  
**Root cause:** LLMs struggle with deeply nested JSON schemas.  
**Solution:** Interposed a strict Pydantic validation layer between the LLM and the tool. If validation fails, the error is fed back to the LLM automatically to self-correct, up to a maximum of 3 retries.  
**Result:** 99% reduction in external API 400 Bad Request errors.

**Problem:** Webhook endpoints were vulnerable to replay attacks.  
**Root cause:** Static webhook URLs without payload verification.  
**Solution:** Implemented timestamp-based signature verification for incoming webhooks.  
**Result:** Replay attacks are rejected at the edge middleware.

---

## 13 — Technical Trade-offs

| Decision | Alternative | Why | Trade-off |
| --- | --- | --- | --- |
| PostgreSQL | MongoDB | Relational integrity | Less flexible schema migrations |
| FastAPI | Express.js | Async Python + native AI typing | Smaller web ecosystem than Node |
| JWT | Redis Sessions | Stateless API | Token lifecycle & invalidation complexity |
| Webhooks | Polling | Real-time events | Requires securing public endpoints |
| MCP/Tools | Direct LLM APIs | Extensibility & Security | Additional abstraction layer to maintain |

---

## 14 — Lessons Learned

- **LLMs are unpredictable clients:** Treat the LLM like a malicious or incompetent user. Strict validation on tool inputs is non-negotiable.
- **OAuth is never just "set and forget":** Managing token lifecycles, incremental authorization, and granular scopes requires a robust state machine.
- **Async Python can be tricky:** Mixing synchronous libraries with FastAPI's event loop can cause catastrophic blocking if not carefully managed.

---

## 15 — Future Improvements

If this were moving to production at 100k users, I would introduce:
- **Redis:** For distributed rate limiting and caching frequently accessed data (like tool schemas).
- **Background Workers:** Moving tool execution to a queue (e.g., Celery or Temporal) to handle long-running integrations without holding HTTP connections open.
- **Secrets Manager:** Moving OAuth client secrets from `.env` to AWS Secrets Manager or HashiCorp Vault.
- **Database Read Replicas:** Routing heavy analytical queries (like workflow run history) to a read replica to protect the primary writer.

---

## 16 — Final Results

The platform successfully provides a unified interface for an autonomous agent to interact with multiple SaaS products. The architecture proves that strict security boundaries (via MCP) do not have to compromise the flexibility or intelligence of the AI agent.

---

## 17 — Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn UI
- **Backend:** FastAPI, Python, Pydantic, SQLAlchemy (Async)
- **Database:** PostgreSQL
- **AI/Protocol:** Model Context Protocol (MCP), LLM Integration
- **Integrations:** OAuth 2.0, Webhooks
