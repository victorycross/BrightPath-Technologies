# Privacy Policy Generator — Data Security Support Guide

**Application:** Privacy Policy Generator
**URL:** https://brightpathtechnology.io/privacy-tools/
**Repository:** https://github.com/victorycross/BrightPath-Technologies
**Classification:** Client-side only — no backend, no data transmission
**Last updated:** 2026-02-07

---

## Table of Contents

1. [Security Posture Summary](#1-security-posture-summary)
2. [Data Inventory](#2-data-inventory)
3. [Data Flow and Lifecycle](#3-data-flow-and-lifecycle)
4. [Storage Security](#4-storage-security)
5. [Network Security](#5-network-security)
6. [Input Validation and XSS Prevention](#6-input-validation-and-xss-prevention)
7. [Third-Party Dependency Analysis](#7-third-party-dependency-analysis)
8. [Authentication and Access Control](#8-authentication-and-access-control)
9. [Generated Output Security](#9-generated-output-security)
10. [Hosting and Infrastructure Security](#10-hosting-and-infrastructure-security)
11. [Build Pipeline Security](#11-build-pipeline-security)
12. [Browser API Usage](#12-browser-api-usage)
13. [Compliance Posture](#13-compliance-posture)
14. [Threat Model](#14-threat-model)
15. [Security Controls in Place](#15-security-controls-in-place)
16. [Recommended Enhancements](#16-recommended-enhancements)
17. [Incident Response Procedures](#17-incident-response-procedures)
18. [Security Posture Assessment](#18-security-posture-assessment)

---

## 1. Security Posture Summary

The Privacy Policy Generator is a **client-side only** web application. All data processing occurs in the user's browser. No data is transmitted to any server, API, or third-party service.

| Characteristic | Status |
|---|---|
| Backend / API | None |
| Database | None |
| User authentication | None |
| Network calls | None |
| Cookies | None set |
| Analytics / telemetry | None |
| External SDKs | None |
| Data transmission | None — all local |
| Data storage | Browser localStorage only |
| Encryption at rest | None (browser default) |

**Overall security risk: LOW.** The application's attack surface is minimal by design.

---

## 2. Data Inventory

### 2.1 Data Collected by the Application

The app collects organizational metadata for generating privacy policy documents. It does **not** collect personal data about the individuals visiting the site.

#### Organization Profile Data

| Field | Type | Required | Sensitivity |
|---|---|---|---|
| Legal name | Text | Yes | Low — public business name |
| Trading name | Text | No | Low |
| Entity type | Enum | Yes | Low — organizational classification |
| Industry sector | Text | Yes | Low |
| Website URL | URL | No | Low — public URL |
| Headquarters country | Text | Yes | Low |
| Headquarters province/state | Text | No | Low |
| DPO/Privacy Officer title | Text | Yes | Low |
| DPO/Privacy Officer email | Email | Yes | Medium — business contact |
| DPO/Privacy Officer name | Text | No | Medium — individual name |
| DPO/Privacy Officer phone | Phone | No | Medium — business contact |
| DPO/Privacy Officer address | Text | No | Medium — business address |
| EU Representative name | Text | Conditional (GDPR) | Medium |
| EU Representative email | Email | Conditional (GDPR) | Medium |
| EU Representative address | Text | Conditional (GDPR) | Medium |

#### Data Practices Metadata

| Field | Type | Sensitivity |
|---|---|---|
| Jurisdictions selected | Enum array | Low |
| Data categories collected | Enum array | Low — describes what the org collects, not the data itself |
| Data sources | Enum array | Low |
| Processing purposes + legal bases | Structured array | Low |
| Retention periods | Text per category | Low |
| Third-party recipients | Structured array (category, purpose, country) | Low |
| Cross-border destinations | Structured array (country, mechanism) | Low |
| Consent mechanisms | Enum array | Low |
| Boolean flags | Booleans (cookies, children's data, ADM, DPIA) | Low |

### 2.2 Data NOT Collected

The application does **not** collect:

- Personal identifiers of site visitors (name, email, IP address)
- Financial data (credit cards, bank accounts)
- Health or medical data
- Biometric data
- Location data of visitors
- Device fingerprints or identifiers
- Browsing history or behavioral data
- Authentication credentials

### 2.3 Data Classification

| Category | Examples | Classification |
|---|---|---|
| Organization metadata | Legal name, industry, headquarters | Public / Low sensitivity |
| Contact information | DPO email, phone, address | Business confidential / Medium sensitivity |
| Data practice declarations | Categories collected, purposes, retention | Internal / Low sensitivity |
| Generated documents | Privacy policy markdown | Draft / Review before publication |

---

## 3. Data Flow and Lifecycle

### 3.1 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  USER'S BROWSER (all processing occurs here)                 │
│                                                              │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────┐ │
│  │  UI Form  │────▶│  React State  │────▶│  Generation      │ │
│  │  Inputs   │     │  (in-memory)  │     │  Pipeline        │ │
│  └──────────┘     └──────┬───────┘     │  (Zod → Map →    │ │
│                          │              │   Build → Render) │ │
│                          ▼              └────────┬─────────┘ │
│                   ┌──────────────┐               │           │
│                   │  localStorage │               ▼           │
│                   │  (optional    │        ┌────────────┐    │
│                   │   profile     │        │  Markdown   │    │
│                   │   save)       │        │  Output     │    │
│                   └──────────────┘        └──────┬─────┘    │
│                                                  │           │
│                                           ┌──────┴─────┐    │
│                                           │  Download   │    │
│                                           │  (Blob URL) │    │
│                                           │  or Copy    │    │
│                                           │  (Clipboard)│    │
│                                           └────────────┘    │
│                                                              │
│  ════════════════════════════════════════════════════════════ │
│  NOTHING LEAVES THE BROWSER. NO EXTERNAL NETWORK CALLS.     │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Data Lifecycle

| Phase | Location | Duration | Disposal |
|---|---|---|---|
| **Input** | React state (in-memory) | Current session | Cleared on page refresh or RESET action |
| **Validation** | In-memory (Zod safeParse) | Transient | Garbage collected after validation |
| **Processing** | In-memory (pipeline stages) | Transient | Garbage collected after render |
| **Preview** | React DOM (MarkdownPreview) | Current session | Unmounted on navigation |
| **Profile save** | localStorage | Indefinite | User clears browser data or calls deleteProfile() |
| **Download** | User's file system | User-controlled | User manages downloaded files |
| **Clipboard** | System clipboard | Until overwritten | Overwritten by next clipboard operation |

### 3.3 Data Retention

| Storage | Retention | User Control |
|---|---|---|
| In-memory state | Session only (cleared on refresh) | Page refresh clears all |
| localStorage profiles | Indefinite | Clear browser data, or use private/incognito mode |
| Downloaded files | User-managed | User deletes files from their system |
| Clipboard content | Until next copy | Automatic overwrite |

---

## 4. Storage Security

### 4.1 localStorage

**Key:** `privacy-agent-profiles`

**Contents:** JSON object containing organization profiles keyed by slugified name.

**Security properties:**

| Property | Status | Detail |
|---|---|---|
| Encryption at rest | Not encrypted | Stored as plaintext JSON |
| Access scope | Origin-scoped | Only accessible from `brightpathtechnology.io` origin |
| Cross-origin access | Blocked | Same-origin policy enforced by browser |
| Subdomain isolation | Yes | Other subdomains cannot access |
| Size limit | ~5–10 MB | Browser-enforced per-origin quota |
| Persistence | Survives browser restart | Cleared only by explicit user action |
| Shared computer risk | Medium | Other users of same browser profile can access |

**Validation on load:** Profiles are validated against `OrgProfileSchema` (Zod) when loaded. Invalid or tampered data returns `null` and does not crash the application.

### 4.2 No Other Storage

| Storage API | Used |
|---|---|
| sessionStorage | No |
| IndexedDB | No |
| Web SQL | No |
| Cache API | No |
| Service Workers | No |
| Cookies | No |

---

## 5. Network Security

### 5.1 Network Call Audit

**Result: Zero external network calls.**

The codebase contains:
- No `fetch()` calls
- No `XMLHttpRequest` usage
- No `axios` or HTTP client imports
- No WebSocket connections
- No Server-Sent Events
- No `navigator.sendBeacon()`
- No image/pixel tracking
- No analytics endpoints
- No error reporting services

### 5.2 External Links

The Home page contains links to regulatory authority websites. All links are:

- **Static, hardcoded URLs** — no dynamic parameters
- **No user data appended** — links contain no query strings from user input
- **Opened in new tab** — `target="_blank"`
- **Protected against opener exploitation** — `rel="noopener noreferrer"`
- **Vetted destinations** — government agencies and standards bodies only

| Link Target | Domain | Type |
|---|---|---|
| Office of the Privacy Commissioner | priv.gc.ca | Canadian federal |
| PIPEDA full text | laws-lois.justice.gc.ca | Canadian federal |
| Quebec CAI | cai.gouv.qc.ca | Quebec provincial |
| Alberta OIPC | oipc.ab.ca | Alberta provincial |
| BC OIPC | oipc.bc.ca | BC provincial |
| OSFI B-13 | osfi-bsif.gc.ca | Canadian federal |
| GDPR text | gdpr-info.eu | EU |
| CCPA/CPRA | oag.ca.gov | California |
| NIST AI RMF | nist.gov | US federal |
| NIST Privacy Framework | nist.gov | US federal |

### 5.3 CORS

Not applicable. The application makes no cross-origin requests.

---

## 6. Input Validation and XSS Prevention

### 6.1 Zod Schema Validation

All user input passes through Zod schemas before entering the generation pipeline:

- **Enum fields** validate against fixed sets of allowed values
- **Email fields** validate against Zod's `.email()` pattern
- **URL fields** validate against Zod's `.url()` pattern
- **Required strings** enforce `.min(1)` to prevent empty submissions
- **Arrays** enforce `.min(1)` for required collections (jurisdictions, data categories)
- **Nested objects** validate recursively (DPO contact, EU representative, recipients)

Invalid input causes `safeParse()` to return `{ success: false }`, which prevents the generation pipeline from running. No exceptions are thrown — the UI simply disables the generate action.

### 6.2 Markdown Rendering

User input is rendered in the preview panel via `react-markdown`:

```typescript
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

**react-markdown security properties:**

| Protection | Status |
|---|---|
| HTML tag stripping | Enabled by default — raw HTML is not rendered |
| Script injection | Blocked — `<script>` tags are stripped |
| Event handler injection | Blocked — `onclick`, `onerror` etc. are stripped |
| iframe injection | Blocked — `<iframe>` tags are stripped |
| Link sanitization | Safe — renders `<a>` elements from Markdown link syntax |
| Image sanitization | Safe — renders `<img>` from Markdown image syntax |

### 6.3 Dangerous Patterns — Not Present

| Pattern | Status |
|---|---|
| `dangerouslySetInnerHTML` | Not used anywhere in codebase |
| `eval()` | Not used |
| `new Function()` | Not used |
| `document.write()` | Not used |
| `innerHTML` assignment | Not used |
| `outerHTML` assignment | Not used |

### 6.4 Free-Text Input Fields

Most input fields are enums, booleans, or structured data. The following accept free-text:

| Field | Used In | XSS Risk |
|---|---|---|
| Legal name | Generated markdown (interpolated as text) | Low — rendered via react-markdown |
| Trading name | Generated markdown | Low |
| Industry sector | Generated markdown | Low |
| DPO name/email/phone/address | Generated markdown | Low |
| Country/province | Generated markdown | Low |
| Retention period text | Generated markdown | Low |
| Recipient category/purpose | Generated markdown | Low |
| Processing purpose description | Generated markdown | Low |

All free-text values are interpolated into Markdown strings via template literals and then rendered by react-markdown, which sanitizes the output.

---

## 7. Third-Party Dependency Analysis

### 7.1 Production Dependencies

| Package | Version | Security Category | Risk |
|---|---|---|---|
| react / react-dom | 19.2.0 | UI framework | Low — maintained by Meta |
| zod | 3.25.76 | Schema validation | Low — pure validation, no I/O |
| react-hook-form | 7.71.1 | Form state | Low — no network I/O |
| @hookform/resolvers | 5.2.2 | Zod bridge | Low |
| react-markdown | 10.1.0 | Markdown rendering | Low — sanitizes HTML by default |
| remark-gfm | 4.0.1 | GFM extension | Low — parser plugin only |
| mdast-util-gfm-table | 2.0.0 | Table parsing | Low |
| lucide-react | 0.563.0 | Icons | Low — SVG components only |
| tailwindcss | 4.1.18 | CSS framework | Low — build-time only |
| class-variance-authority | 0.7.1 | CSS utility | Low |
| clsx | 2.1.1 | Class merging | Low |
| tailwind-merge | 3.4.0 | Class dedup | Low |

### 7.2 Absence of Risky Dependencies

| Category | Libraries Checked | Found |
|---|---|---|
| Analytics | Google Analytics, gtag, ga | None |
| Error reporting | Sentry, BugSnag, LogRocket | None |
| User monitoring | Hotjar, FullStory, Heap | None |
| Product analytics | Amplitude, Mixpanel, PostHog | None |
| Data collection | Segment, mParticle | None |
| Advertising | Google Ads, Facebook Pixel | None |
| A/B testing | LaunchDarkly, Optimizely | None |

### 7.3 Dependency Audit

```bash
cd privacy-tools
npm audit
```

Run this periodically and before deployments. No `npm audit` step currently exists in the CI/CD pipeline (recommended enhancement — see Section 16).

---

## 8. Authentication and Access Control

### 8.1 Authentication

**None.** The application has no authentication mechanism:

- No login/logout
- No user accounts
- No passwords or credentials
- No JWT, OAuth, SSO, or API tokens
- No session cookies or tokens
- No session management

The application is publicly accessible. Anyone with the URL can use it.

### 8.2 Access Control

**None.** All features are available to all visitors:

- No role-based access control
- No feature gating
- No rate limiting (static site)
- No audit trail of user actions

### 8.3 Authorization

**Not applicable.** There is nothing to authorize — the app performs no server-side operations, no data mutations, and no privileged actions.

---

## 9. Generated Output Security

### 9.1 What User Data Appears in Output

Generated privacy policy documents contain:

| Data | Where in Output | Example |
|---|---|---|
| Organization legal name | Title, preamble, body | "Acme Corp" |
| DPO email | Contact section | "privacy@acme.com" |
| DPO title | Contact section | "Data Protection Officer" |
| DPO name (if provided) | Contact section | "Jane Smith" |
| DPO phone (if provided) | Contact section | "+1 555-0100" |
| DPO address (if provided) | Contact section | "123 Main St, Toronto" |
| EU Rep details (if provided) | GDPR contact section | Name, email, address |
| Industry sector | Preamble context | "Financial services" |
| Data categories | Data collection section | Enumerated list |
| Processing purposes | Use of data section | Enumerated with legal basis |
| Retention periods | Retention section | User-provided text |
| Third-party recipients | Data sharing section | Category, purpose, country |
| Transfer destinations | Cross-border section | Country, mechanism |

### 9.2 Output Format

- **Format:** Markdown (.md) with YAML frontmatter
- **YAML frontmatter:** Contains title, generation date, jurisdictions, requirement count
- **Body:** Regulatory text with statutory references
- **Not executable:** Markdown is a text format — no scripts, macros, or embedded code

### 9.3 Download Security

Downloads use the browser's Blob API:

1. Content created as in-memory Blob (`text/markdown;charset=utf-8`)
2. Object URL created (`URL.createObjectURL`)
3. Anchor element triggers download
4. Object URL revoked immediately after download
5. No server involved — file never leaves the browser until saved to disk

### 9.4 Clipboard Security

Copy-to-clipboard uses `navigator.clipboard.writeText()`:

- Requires HTTPS (enforced by GitHub Pages)
- Requires user-initiated action (button click)
- Some browsers require explicit permission
- Fails silently if permission denied (returns `false`)

### 9.5 User Responsibilities for Output

Users should:

- Review generated documents with legal counsel before publication
- Redact or verify contact information before making documents public
- Store downloaded documents securely
- Not publish drafts containing internal organizational details they wish to keep confidential

---

## 10. Hosting and Infrastructure Security

### 10.1 GitHub Pages

| Control | Status |
|---|---|
| HTTPS enforcement | Enabled (automatic) |
| TLS version | 1.2+ (GitHub-managed) |
| SSL certificate | Auto-renewed by GitHub |
| DDoS protection | GitHub's infrastructure |
| Server access | None (static files only) |
| Custom headers | GitHub defaults (limited customization) |
| CDN | GitHub's global CDN (Fastly) |
| Cache control | `max-age=600` (10 minutes) |

### 10.2 DNS and Domain

| Setting | Value |
|---|---|
| Domain | brightpathtechnology.io |
| A records | 185.199.108–111.153 (GitHub Pages) |
| CNAME file | `brightpathtechnology.io` (in repo root) |
| Subdomain takeover protection | CNAME file binds domain to this repository |

### 10.3 GitHub Pages Default Security Headers

GitHub Pages automatically sets:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Strict-Transport-Security` | Enabled |
| `Content-Security-Policy` | Default (permissive) |

---

## 11. Build Pipeline Security

### 11.1 GitHub Actions Workflow

**Trigger:** Push to `main` branch only

**Permissions (principle of least privilege):**
- `contents: read` — read repository (required for checkout)
- `pages: write` — publish to GitHub Pages
- `id-token: write` — OIDC token for Pages deployment

**Build steps:**
1. Checkout code (`actions/checkout@v4`)
2. Setup Node 22 (`actions/setup-node@v4`)
3. Install and build main site
4. Install and build privacy-tools
5. Merge build outputs
6. Upload and deploy to Pages

### 11.2 Secrets and Credentials

| Item | Status |
|---|---|
| Environment variables in build | None |
| API keys in workflow | None |
| Hardcoded credentials | None |
| Secret injection | None required |
| `.env` files | None in repository |

### 11.3 Supply Chain Protections

| Control | Status |
|---|---|
| Lock file committed | Yes (`package-lock.json`) |
| `npm ci` used (not `npm install`) | Yes — deterministic installs |
| Pinned action versions | Yes (`@v4`) |
| Build reproducibility | Yes — lock file + npm ci |
| Dependency audit in CI | Not currently configured (recommended) |

---

## 12. Browser API Usage

### 12.1 APIs Used

| API | Usage | Security Implication |
|---|---|---|
| `localStorage` | Profile persistence | Origin-scoped, plaintext storage |
| `navigator.clipboard.writeText()` | Copy to clipboard | Requires HTTPS, user-initiated |
| `URL.createObjectURL()` | File download | In-memory blob, properly revoked |
| `document.createElement('a')` | Trigger download | Standard download pattern |
| `document.addEventListener` | Click-outside detection | Event listener management |

### 12.2 APIs NOT Used

| API | Status |
|---|---|
| Geolocation | Not used |
| Camera / Microphone | Not used |
| Notifications | Not used |
| Web Workers | Not used |
| Service Workers | Not used |
| WebSockets | Not used |
| WebRTC | Not used |
| IndexedDB | Not used |
| File System Access API | Not used |
| Payment Request API | Not used |
| Credential Management API | Not used |

---

## 13. Compliance Posture

### 13.1 The App as a Data Processor

The privacy-tools application does not process personal data in the regulatory sense:

| Criterion | Assessment |
|---|---|
| Collects personal data of visitors | No |
| Transmits data to servers | No |
| Stores data remotely | No |
| Shares data with third parties | No |
| Uses cookies for tracking | No |
| Profiles or monitors users | No |

**Conclusion:** The application is not a data processor or controller for visitor data. It is a client-side tool that helps organizations draft compliance documents.

### 13.2 Regulatory Applicability

| Framework | Applicability to the App | Rationale |
|---|---|---|
| PIPEDA | Minimal | No collection of personal information from Canadian individuals |
| GDPR | Minimal | No processing of EU personal data; no cookies, tracking, or analytics |
| CCPA/CPRA | Minimal | No collection of California consumer personal information |
| Quebec Law 25 | Minimal | No personal information collected from Quebec residents |
| OSFI B-13 | Not applicable | App is not operated by a federally regulated financial institution |

### 13.3 Host Organization Obligations

BrightPath Technology (as operator of brightpathtechnology.io) should:

1. Publish a privacy notice for the website confirming the app does not collect personal data
2. Document the absence of analytics and tracking
3. Maintain transparency about localStorage usage in any site-wide privacy policy
4. Disclose that generated documents are not legal advice

### 13.4 User Obligations

Organizations using the tool to generate privacy policies must:

1. Ensure generated documents are reviewed by qualified legal counsel
2. Verify regulatory accuracy for their specific circumstances
3. Not treat generated output as a legal opinion or certification
4. Ensure their own data practices match what they describe in generated policies

---

## 14. Threat Model

### 14.1 Threat Actors and Attack Vectors

| Threat | Vector | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **XSS via user input** | Malicious Markdown in free-text fields | Low | Low | react-markdown sanitizes all HTML |
| **localStorage data theft** | Malicious browser extension or same-origin XSS | Low | Medium | Origin-scoped; CSP would reduce risk |
| **Supply chain compromise** | Malicious npm package update | Low | High | Lock files, npm ci, regular audits |
| **GitHub account compromise** | Stolen credentials push malicious code | Low | High | MFA, branch protection, code review |
| **Domain hijacking** | DNS record modification | Very low | High | CNAME file, monitor DNS records |
| **Man-in-the-middle** | HTTP downgrade attack | Very low | Medium | HTTPS enforced by GitHub Pages |
| **Shared computer data leakage** | Next user reads localStorage | Medium | Medium | No auto-clear; user should use private mode |
| **Generated document exposure** | User publishes draft with internal details | Medium | Medium | Legal disclaimer in output; user responsibility |
| **Clickjacking** | Embedding app in malicious iframe | Very low | Low | GitHub Pages sets `X-Frame-Options: DENY` |
| **Dependency vulnerability** | Known CVE in react-markdown or other dep | Low | Variable | Regular npm audit |

### 14.2 Out-of-Scope Threats

The following are outside the application's control:

- Compromise of the user's device or browser
- Physical access attacks on the user's computer
- Social engineering targeting the user
- Regulatory changes invalidating generated content
- GitHub Pages platform outages or vulnerabilities

---

## 15. Security Controls in Place

### 15.1 Design-Level Controls

| Control | Implementation |
|---|---|
| **No server** | Zero backend eliminates server-side attack surface |
| **No data transmission** | All processing local; no network exfiltration possible |
| **No authentication** | No credentials to steal or brute-force |
| **No cookies** | No session hijacking or CSRF risk |
| **No analytics** | No third-party data collection |
| **Input validation** | Zod schemas enforce type safety on all input |
| **Output sanitization** | react-markdown strips HTML from rendered content |
| **Immutable deployment** | Static files on GitHub Pages; no runtime code injection |

### 15.2 Infrastructure Controls

| Control | Implementation |
|---|---|
| **HTTPS enforcement** | GitHub Pages auto-enforces TLS |
| **HTTP security headers** | X-Content-Type-Options, X-Frame-Options, HSTS (GitHub defaults) |
| **CDN delivery** | GitHub's Fastly CDN with caching |
| **CNAME binding** | Domain locked to repository via CNAME file |
| **Minimal CI permissions** | contents:read, pages:write, id-token:write |
| **Deterministic builds** | npm ci with lock file |

### 15.3 Code-Level Controls

| Control | Implementation |
|---|---|
| **TypeScript strict mode** | Catches type errors at compile time |
| **Zod schema validation** | Runtime validation of all user input |
| **No `dangerouslySetInnerHTML`** | Eliminates direct DOM injection risk |
| **No `eval()` or `new Function()`** | Eliminates code execution from strings |
| **Blob URL cleanup** | `URL.revokeObjectURL()` called after download |
| **Click-outside handling** | Event listeners properly attached/detached |
| **ESLint enforcement** | Code quality and React Hooks rules |

---

## 16. Recommended Enhancements

### 16.1 High Priority

| Enhancement | Implementation | Effort |
|---|---|---|
| **Add npm audit to CI** | Add step in deploy.yml: `npm audit --audit-level=high` | Low |
| **Add CSP meta tag** | Add to index.html: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">` | Low |
| **Publish privacy notice** | Add privacy statement to brightpathtechnology.io confirming no data collection | Low |
| **Pin GitHub Action versions** | Change `@v4` to specific commit SHA (e.g., `actions/checkout@b4ffde...`) | Low |

### 16.2 Medium Priority

| Enhancement | Implementation | Effort |
|---|---|---|
| **localStorage encryption** | Encrypt profile JSON with a user-provided passphrase before storage | Medium |
| **Session timeout** | Clear in-memory state after 30 minutes of inactivity | Low |
| **Subresource Integrity (SRI)** | Not applicable (all deps bundled) but consider if CDN resources added | — |
| **Source map suppression** | Add `build.sourcemap: false` to vite.config.ts (verify default) | Low |
| **Dependency update policy** | Schedule monthly `npm outdated` and `npm audit` reviews | Process |

### 16.3 Low Priority

| Enhancement | Implementation | Effort |
|---|---|---|
| **Clear data button** | Add "Clear all data" to UI (calls `RESET` + `localStorage.clear()`) | Low |
| **Private browsing notice** | Suggest private/incognito mode for sensitive organizations | Low |
| **Generated document watermark** | Add "DRAFT — NOT REVIEWED BY LEGAL COUNSEL" watermark to output | Low |
| **Automated dependency updates** | Dependabot or Renovate for PR-based dependency updates | Low |

---

## 17. Incident Response Procedures

### 17.1 Dependency Vulnerability Discovered

```
1. Check: npm audit --audit-level=high
2. Identify affected package and severity
3. If critical/high:
   a. Check if vulnerability is exploitable in this context (client-side only, no network)
   b. Update package: npm install package@latest
   c. Test build: npm run build
   d. Commit updated package-lock.json
   e. Push to main (auto-deploys)
4. If moderate/low: schedule for next maintenance window
```

### 17.2 Suspected Code Injection

```
1. Verify latest commit: git log --oneline -5
2. Check for unauthorized commits: compare with known-good state
3. Review diff of suspicious commit: git diff <good-hash> HEAD
4. If malicious code found:
   a. Revert: git revert <bad-commit>
   b. Push to main (auto-deploys clean version)
   c. Review GitHub audit log for unauthorized access
   d. Rotate GitHub personal access tokens
   e. Enable/verify MFA on GitHub account
5. Audit repository collaborators and deploy keys
```

### 17.3 Domain or DNS Issue

```
1. Verify DNS records: dig +short brightpathtechnology.io A
   Expected: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
2. Verify CNAME file in repo: should contain "brightpathtechnology.io"
3. Check GitHub Pages settings: gh api repos/victorycross/BrightPath-Technologies/pages
4. If DNS records changed unexpectedly:
   a. Contact domain registrar immediately
   b. Restore correct A records
   c. Verify CNAME file integrity in repository
   d. Check for unauthorized domain transfers
```

### 17.4 localStorage Data Concern

If a user reports concern about data stored in their browser:

```
1. Confirm data is stored only in their browser, not on any server
2. Instruct user to clear application data:
   a. Open browser DevTools (F12)
   b. Application tab → Local Storage → brightpathtechnology.io
   c. Right-click → Clear
   Or: Clear all browser data via browser settings
3. Recommend using private/incognito mode for future sessions if on shared computer
4. Confirm no data was transmitted externally (the app makes zero network calls)
```

---

## 18. Security Posture Assessment

### 18.1 Summary Matrix

| Domain | Risk Level | Justification |
|---|---|---|
| Data transmission | **None** | Zero network calls; all processing is local |
| Data storage | **Low** | localStorage only; origin-scoped; plaintext but local |
| Authentication | **N/A** | No auth required; public tool |
| Input validation | **Low** | Zod schema enforcement on all input |
| Output rendering | **Low** | react-markdown sanitizes HTML; no `dangerouslySetInnerHTML` |
| Third-party dependencies | **Low** | No analytics, telemetry, or tracking; standard React ecosystem |
| Infrastructure | **Low** | GitHub Pages with HTTPS, security headers, CDN |
| Build pipeline | **Low** | No secrets; deterministic builds; minimal permissions |
| Cookies / tracking | **None** | No cookies set; no tracking of any kind |
| Compliance exposure | **Minimal** | App does not collect personal data of visitors |

### 18.2 Overall Assessment

**Security Risk Rating: LOW**

The Privacy Policy Generator is secure by design. Its client-side-only architecture eliminates entire categories of web application risk — there is no server to compromise, no API to abuse, no database to breach, and no data to exfiltrate. The application does not collect, transmit, or store personal data about its users. The primary residual risks are shared-computer localStorage access (addressable via private browsing) and supply chain dependency vulnerabilities (addressable via regular audits).

The application is a privacy-preserving tool by nature: it helps organizations write privacy policies without surveilling the people who use it.

---

*For user-facing support, see the [L1 Support Guide](./L1-SUPPORT-GUIDE.md). For technical internals, see the [L2/L3 Support Guide](./L2-L3-SUPPORT-GUIDE.md) and [Developer Guide](./DEVELOPER-GUIDE.md).*
