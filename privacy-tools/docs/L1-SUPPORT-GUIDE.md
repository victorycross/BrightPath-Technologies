# Privacy Policy Generator — L1 Support Guide

**Application:** Privacy Policy Generator
**URL:** https://brightpathtechnology.io/privacy-tools/
**Version:** 1.0
**Last updated:** 2026-02-07

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [System Requirements](#2-system-requirements)
3. [Application Architecture](#3-application-architecture)
4. [Home Page](#4-home-page)
5. [Privacy Policy Wizard](#5-privacy-policy-wizard)
6. [Entity Role Determination Tool](#6-entity-role-determination-tool)
7. [Processor Discovery Tool](#7-processor-discovery-tool)
8. [Export and Download](#8-export-and-download)
9. [Common Issues and Troubleshooting](#9-common-issues-and-troubleshooting)
10. [Known Limitations](#10-known-limitations)
11. [Escalation Criteria](#11-escalation-criteria)

---

## 1. Application Overview

The Privacy Policy Generator is a client-side web application that produces regulatory-precise privacy policies, entity role determination memos, and third-party processor disclosures. All processing occurs in the user's browser — no data is transmitted to a server.

### Supported Regulatory Frameworks

| Jurisdiction | Regulation | Status |
|---|---|---|
| Canada (Federal) | PIPEDA | Supported |
| Quebec | Law 25 (An Act to modernize legislative provisions as regards the protection of personal information) | Supported |
| Alberta | PIPA (Personal Information Protection Act) | Supported |
| British Columbia | PIPA (Personal Information Protection Act) | Supported |
| European Union | GDPR (General Data Protection Regulation) | Supported |
| California | CCPA (California Consumer Privacy Act) | Supported |
| California | CPRA (California Privacy Rights Act) | Supported |

### Three Core Tools

| Tool | Purpose | Output |
|---|---|---|
| Privacy Policy Wizard | 6-step guided workflow producing a full privacy policy | Markdown privacy policy with YAML frontmatter |
| Entity Role Determination | Decision-tree assessment of controller / processor / joint controller status | Determination memo with statutory references |
| Processor Discovery | Identify third-party service providers receiving personal data | Processor disclosure with regulatory requirements |

---

## 2. System Requirements

- **Browser:** Any modern browser (Chrome, Firefox, Safari, Edge — current or previous major release)
- **JavaScript:** Must be enabled
- **Screen size:** Responsive; optimized for desktop (1024px+). Fully functional on mobile. Live preview panel visible only on screens 1024px and wider.
- **Network:** Required only for initial page load. No network needed during use.
- **Accounts:** None required. No authentication.

---

## 3. Application Architecture

### Key Characteristics

- **Client-side only.** The app runs entirely in the browser. No user data leaves the device.
- **No backend.** Static files served via GitHub Pages. No API calls, no database.
- **Local storage.** Organization profiles can be saved to the browser's localStorage under the key `privacy-agent-profiles`. Clearing browser data removes saved profiles.
- **No cookies.** The application does not set cookies.

### Navigation Model

The app has four views, switched via a top-level state variable (no URL routing):

| View | Accessed From | Content |
|---|---|---|
| Home | Logo click, Home button | Feature tiles and regulatory resource links |
| Wizard | "Start Wizard" tile on home page | 6-step privacy policy generation workflow |
| Entity Role | Tools dropdown or "Determine Role" tile | Standalone entity role determination |
| Processor Discovery | Tools dropdown or "Discover Processors" tile | Standalone processor discovery |

**Navigation elements:**
- **Logo / title** (top-left): Returns to Home from any view
- **Home button** (top-right): Shown when not on the Home view; returns to Home
- **Tools dropdown** (top-right): Launches Entity Role or Processor Discovery as standalone tools

---

## 4. Home Page

### Feature Tiles

Three tiles in a responsive grid. Each launches a different tool:

1. **Privacy Policy Wizard** — "Full 6-step guided wizard to generate a regulatory-precise privacy policy."
2. **Entity Role Determination** — "Determine whether your organization acts as a Data Controller, Data Processor, or Joint Controller."
3. **Third-Party Processor Discovery** — "Identify third-party service providers your organization shares personal data with."

### Regulatory Resources

Links to external regulatory authority sites, organized into two groups:

**Canadian Privacy Law:**
- Office of the Privacy Commissioner (OPC)
- PIPEDA full text
- Quebec Commission d'acces a l'information (CAI)
- Alberta OIPC
- BC OIPC
- OSFI B-13 (Technology and Cyber Risk Management)

**International and Frameworks:**
- GDPR official text
- CCPA / CPRA (California AG)
- NIST AI Risk Management Framework
- NIST Privacy Framework

**Support note:** These are external links. If a user reports a broken link, verify the target URL is still active before escalating.

---

## 5. Privacy Policy Wizard

### Overview

A 6-step sequential wizard that collects organizational details, data practices, and third-party sharing arrangements, then generates a complete privacy policy in Markdown format.

**Step indicator** at the top shows all 6 steps. Completed steps display a checkmark. The current step is highlighted. Users navigate with Back/Next buttons.

### Step 1: Jurisdictions

**Purpose:** Select which privacy regulations apply.

- Presents 7 jurisdiction checkboxes (PIPEDA, Quebec Law 25, Alberta PIPA, BC PIPA, GDPR, CCPA, CPRA)
- Unsupported jurisdictions (if any are added in future) show "(coming soon)" and are disabled
- **Validation:** At least 1 jurisdiction must be selected to proceed

**Common issues:**
- User doesn't know which jurisdictions apply → Advise them to consult their legal/compliance team. The tool does not provide jurisdictional applicability advice.

### Step 2: Organization Profile

**Purpose:** Capture legal entity details and privacy officer contact.

**Required fields (marked with *):**
- Legal name
- Entity type (Data Controller / Data Processor / Joint Controller)
- Industry sector
- Headquarters country
- Privacy Officer / DPO title and email

**Optional fields:**
- Trading / brand name
- Website URL
- Headquarters province/state
- DPO name, phone, address

**Conditional section — EU Representative (GDPR Art. 27):**
- Appears only when GDPR is selected in Step 1
- Fields: Name, Email, Address

**"Help me determine" link:**
- Opens the Entity Role Determination decision tree inline below the entity type dropdown
- Same 4-question decision tree as the standalone tool
- Selecting an outcome populates the entity type field automatically

**Common issues:**
- User unsure about entity type → Direct them to the "Help me determine" link on the entity type field
- EU Representative section not visible → Confirm GDPR was selected in Step 1

### Step 3: Data Practices

**Purpose:** Define what personal data is collected, how, and why.

**Sections:**
1. **Data categories** — 12 checkboxes (personal identifiers, financial, health, biometric, geolocation, behavioral, employment, education, sensitive personal, children's, device/technical, user-generated)
2. **Data sources** — 5 checkboxes (direct, third-party, automated, public, social media)
3. **Processing purposes** — Dynamic list. Each entry has: purpose type dropdown, legal basis dropdown, optional description. Users add/remove entries.
4. **Retention periods** — Auto-generated rows for each selected data category. Each row has a text field for retention duration.
5. **Consent mechanisms** — 5 checkboxes (opt-in, opt-out, granular, cookie banner, double opt-in)
6. **Additional practices** — 4 toggles (cookies/tracking, children's data, automated decision-making, DPIAs)

**Validation:** At least 1 data category, 1 processing purpose, and 1 consent mechanism required.

**Common issues:**
- Retention period fields not appearing → Ensure at least one data category is selected
- User can't remove a processing purpose → Click the X button on the right side of each purpose row

### Step 4: Third Parties

**Purpose:** Define third-party data sharing and cross-border transfers.

**Main toggle:** "We share personal information with third parties"

**When enabled:**
- **Recipients list** — Dynamic. Each recipient has: category, purpose, country (optional), data categories (multi-select). Add/remove entries.
- **"Help me identify third-party processors"** link — Opens Processor Discovery inline (same component as standalone tool)
- **Additional flags:**
  - "Sell" personal information (CCPA definition)
  - Share for cross-context behavioral advertising (CPRA)

**Cross-Border Transfers toggle:** "We transfer personal information outside our headquarters country"

**When enabled:**
- **Destinations list** — Dynamic. Each destination has: country, transfer mechanism (dropdown with 6 options: adequacy decision, SCCs, BCRs, explicit consent, contractual necessity, comparable protection), data categories.

**Common issues:**
- Processor Discovery added recipients but user can't see them → Scroll down in the recipients list; they are appended at the bottom
- Transfer mechanism options unclear → These are legal mechanisms; advise consulting legal counsel

### Step 5: Review

**Purpose:** Summary of all selections before generation.

- Shows 4 review cards (Jurisdictions, Organization, Data Practices, Third-Party & Transfers)
- Each card has an "Edit" button that jumps to the relevant step
- Displays validation status: "Ready to generate" with requirement/section counts if valid
- Error banner if required fields are missing

**Common issues:**
- "Some required fields are missing" error → User must go back to the indicated step(s) and complete required fields. The Edit button on each card jumps to the right step.

### Step 6: Generate

**Purpose:** Render and export the final privacy policy.

- Displays the generated privacy policy in a scrollable preview
- Shows metadata: organization name, requirement count, section count, generation date
- **Download** button: Saves as `.md` file (filename: `{org-name}-privacy-policy.md`)
- **Copy** button: Copies full Markdown to clipboard; shows "Copied" confirmation for 2 seconds

**Footer disclaimer:** "This document does not constitute legal advice. Review with qualified legal counsel before publication."

**Common issues:**
- "Cannot generate — required fields are missing" → Go back through steps and complete all required fields
- Download not working → Check browser download settings; the app creates a Blob URL and triggers download via anchor click
- Copied text includes YAML frontmatter → This is expected. The frontmatter contains metadata (title, org name, jurisdictions, date). Users can remove it before publishing.

---

## 6. Entity Role Determination Tool

### Standalone Mode

Accessed from: Home page tile ("Determine Role") or Tools dropdown.

**Three phases:**

#### Phase 1: Determine

Presents a decision tree of up to 4 yes/no questions:

| # | Question | Yes → | No → |
|---|---|---|---|
| 1 | Does your organization determine why personal data is collected? | Q2 | Q3 |
| 2 | Does your organization determine how personal data is processed? | Q3a | Joint Controller |
| 3 | Does another organization instruct you on what personal data to collect and how to process it? | Processor | Q4 |
| 3a | Do you share these decisions about purposes and means with another organization? | Joint Controller | Controller |
| 4 | Do you share decision-making about data processing purposes with another organization? | Joint Controller | Processor |

Each question includes contextual help text explaining the concept.

**Navigation:**
- "Back to previous question" link (available after answering Q1)
- "Cancel" link (closes the tool)

#### Phase 2: Result

Displays the determined role with its explanation:

| Role | Explanation Summary |
|---|---|
| Data Controller | Independently determines purposes and means of processing. Primary accountability. |
| Data Processor | Processes on behalf of and under instructions from a controller. Requires DPA. |
| Joint Controller | Jointly determines purposes and/or means with another organization. Requires Art. 26 arrangement. |

**Actions available:**
- **Jurisdiction Picker** — Select jurisdictions for the export memo's regulatory implications
- **Export Memo** — Generates and displays a determination memo (requires jurisdictions selected)
- **Apply to Wizard** — Sets the entity type in the wizard's organization profile
- **Done** — Returns to Home
- **Start Over** — Resets the determination

#### Phase 3: Export

Displays the generated memo with Download and Copy buttons. The memo includes:
- Document metadata (YAML frontmatter)
- Determined role and explanation
- Decision path (questions asked and answers given)
- Jurisdiction-specific regulatory implications with statutory references

### Inline Mode (within Wizard Step 2)

Same decision tree, but:
- Triggered by the "Help me determine" link on the entity type dropdown
- "Use this role" populates the entity type field directly
- No jurisdiction picker or export capability in inline mode

---

## 7. Processor Discovery Tool

### Standalone Mode

Accessed from: Home page tile ("Discover Processors") or Tools dropdown.

**Four phases:**

#### Phase 1: Setup

- **Jurisdiction Picker** — Select applicable jurisdictions
- **Data Category Checkboxes** — Select which data categories the organization collects
- Both must have at least one selection to continue

#### Phase 2: Discovery

Presents 12 processor category cards in a selectable grid:

| # | Category | Examples |
|---|---|---|
| 1 | Cloud infrastructure / hosting | AWS, Azure, GCP |
| 2 | Email / communication services | SendGrid, Mailchimp, Twilio |
| 3 | Payment processing | Stripe, PayPal, Square |
| 4 | Analytics and tracking | Google Analytics, Mixpanel, Hotjar |
| 5 | Customer relationship management | Salesforce, HubSpot |
| 6 | Advertising / marketing platforms | Google Ads, Meta/Facebook, LinkedIn |
| 7 | Human resources / payroll | ADP, Workday, BambooHR |
| 8 | IT security / monitoring | Okta, CrowdStrike, Datadog |
| 9 | Legal / compliance services | External counsel, audit firms |
| 10 | Customer support platforms | Zendesk, Intercom, Freshdesk |
| 11 | AI / ML service providers | OpenAI, Anthropic, Google AI (Gemini), Cohere, Hugging Face, AWS Bedrock |
| 12 | AI-embedded SaaS tools | Microsoft Copilot, Otter.ai, Grammarly, Notion AI, Adobe Firefly, Zoom AI Companion |

Users select applicable categories, then click "Customize {N} selection(s)" to proceed.

**Customization sub-phase:**
- Each selected processor shows editable fields: category name, purpose, country, and data categories
- Data categories are pre-populated with suggested defaults but can be modified
- Users can remove individual processors
- Click "Add {N} recipient(s)" to finalize

#### Phase 3: Results

- Lists all identified processors with their details
- **Export Disclosure** — Generates a processor disclosure document
- **Apply to Wizard** — Adds processors as recipients in wizard Step 4
- **Done** — Returns to Home
- **Start Over** — Resets to Phase 1

#### Phase 4: Export

Displays the generated disclosure with Download and Copy buttons. The disclosure includes:
- Provider list with purposes and data categories
- Regulatory requirements filtered to third-party sharing obligations
- Statutory references per selected jurisdiction

### Inline Mode (within Wizard Step 4)

Same discovery flow, but:
- Triggered by "Help me identify third-party processors" link
- "Add recipients" directly populates the wizard's recipients list
- No jurisdiction picker or standalone export; uses jurisdictions from Step 1

---

## 8. Export and Download

### Output Formats

All exports are Markdown (.md) with YAML frontmatter.

| Document | Filename Pattern | Content |
|---|---|---|
| Privacy Policy | `{org-name}-privacy-policy.md` | Full policy with all sections, statutory references |
| Role Determination Memo | `role-determination-YYYY-MM-DD.md` | Decision path, outcome, regulatory implications |
| Processor Disclosure | `processor-disclosure-YYYY-MM-DD.md` | Provider registry, regulatory requirements |

### Export Actions

Two export methods available on all tools:

| Action | Behavior |
|---|---|
| **Download** | Creates a `.md` file and triggers browser download |
| **Copy** | Copies full Markdown to clipboard. Button shows "Copied" with green checkmark for 2 seconds. |

### YAML Frontmatter

All generated documents begin with a YAML frontmatter block (between `---` delimiters) containing metadata: title, organization name, jurisdictions, generation date, and requirement counts. This is standard Markdown metadata and can be stripped before publishing.

---

## 9. Common Issues and Troubleshooting

### Page Load Issues

| Symptom | Likely Cause | Resolution |
|---|---|---|
| Blank white page | JavaScript disabled or blocked | Verify JS is enabled. Check for browser extensions blocking scripts. |
| Page loads but styles missing | CSS failed to load | Hard refresh (Ctrl+Shift+R / Cmd+Shift+R). Check network tab for 404s on `.css` assets. |
| 404 error at `/privacy-tools/` | GitHub Pages deployment pending or failed | Check deployment status at github.com/victorycross/BrightPath-Technologies/actions. Allow up to 10 minutes for propagation. |

### Wizard Issues

| Symptom | Likely Cause | Resolution |
|---|---|---|
| "Next" button disabled | Required fields not completed on current step | Review step requirements (see Step details above). All required fields must be filled. |
| EU Representative section not visible | GDPR not selected | Go to Step 1 and select GDPR. |
| Retention period fields not appearing | No data categories selected | Go to Step 3 and select at least one data category. |
| "Cannot generate" error on Step 6 | Incomplete required fields in earlier steps | Go to Step 5 (Review) to see which sections are incomplete. Use Edit buttons to fix. |
| Preview panel not visible | Screen width below 1024px | Preview only shows on desktop-width screens. Use Download or Copy to see output on smaller screens. |
| Live preview not updating | Data may not pass validation | Complete all required fields. Preview generates only when the full input set validates against the schema. |

### Export Issues

| Symptom | Likely Cause | Resolution |
|---|---|---|
| Download button no response | Browser blocking popup/download | Check browser download settings. Try a different browser. |
| Copy button doesn't confirm | Clipboard API not available | Some browsers restrict clipboard access on HTTP. The app is served over HTTPS so this should work. Try granting clipboard permission. |
| Downloaded file empty | Edge case in generation | Re-try. If reproducible, escalate with steps to reproduce. |

### Data Persistence Issues

| Symptom | Likely Cause | Resolution |
|---|---|---|
| Wizard data lost on refresh | App state is in-memory (not auto-saved) | This is expected behavior. Wizard progress is not persisted across page reloads. Users should export before navigating away. |
| Saved profiles missing | Browser data cleared | Profiles stored in localStorage. Clearing browser data, switching browsers, or using private/incognito mode removes them. |

---

## 10. Known Limitations

| Limitation | Detail |
|---|---|
| No URL routing | The app does not use URL paths for views. Refreshing the page returns to the Home view. Browser back button does not navigate between wizard steps. |
| No auto-save | Wizard progress is held in memory only. A page refresh clears all entered data. |
| English only | All output and UI in English. No multi-language support. |
| Markdown output only | Export format is Markdown. No PDF, DOCX, or HTML export. |
| No collaborative editing | Single-user, single-session. No sharing, commenting, or team features. |
| Pre-defined processor list | The 12 processor categories are fixed. Users can customize details but cannot add entirely new categories outside the provided list. Custom recipients can be added manually in the wizard. |
| Client-side only | No server-side validation, no audit trail, no version history. |
| Not legal advice | The tool generates template text based on regulatory frameworks. Output must be reviewed by qualified legal counsel. |

---

## 11. Escalation Criteria

Escalate to L2/development if:

1. **Build or deployment failure** — GitHub Actions workflow at `victorycross/BrightPath-Technologies` fails on push to `main`
2. **Regulatory content error** — User identifies incorrect statutory references, missing requirements, or inaccurate regulatory language in generated output
3. **Data loss** — User reports generated content is empty, truncated, or contains placeholder/garbage text
4. **Rendering failure** — App loads but specific components fail to render (check browser console for JavaScript errors)
5. **Jurisdiction gap** — User requires a jurisdiction not currently supported
6. **Accessibility complaint** — Screen reader or keyboard navigation issues
7. **Security concern** — Any report of data being transmitted externally (this should not happen; the app is fully client-side)

### Escalation Information to Collect

- Browser name and version
- Operating system
- Screen size / device type
- Steps to reproduce the issue
- Screenshots of the error state
- Browser console errors (F12 → Console tab)
- Which jurisdictions, data categories, and entity type were selected (if applicable)

---

*This guide covers the Privacy Policy Generator v1.0 deployed at brightpathtechnology.io/privacy-tools/. For the application source code, see the `privacy-tools/` directory in the [BrightPath-Technologies repository](https://github.com/victorycross/BrightPath-Technologies).*
