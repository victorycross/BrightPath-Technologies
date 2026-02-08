# Privacy Policy Generator — L2/L3 Support & Developer Guide

**Application:** Privacy Policy Generator
**URL:** https://brightpathtechnology.io/privacy-tools/
**Repository:** https://github.com/victorycross/BrightPath-Technologies
**Version:** 1.0
**Last updated:** 2026-02-07

---

## Table of Contents

1. [Repository Structure](#1-repository-structure)
2. [Build Pipeline and Dependencies](#2-build-pipeline-and-dependencies)
3. [CI/CD and Deployment](#3-cicd-and-deployment)
4. [Application Architecture](#4-application-architecture)
5. [State Management](#5-state-management)
6. [Validation Layer (Zod Schemas)](#6-validation-layer-zod-schemas)
7. [Regulatory Pipeline](#7-regulatory-pipeline)
8. [Regulation Module Anatomy](#8-regulation-module-anatomy)
9. [Section Assembly](#9-section-assembly)
10. [Markdown Rendering](#10-markdown-rendering)
11. [Standalone Tool Infrastructure](#11-standalone-tool-infrastructure)
12. [Entity Role Decision Tree](#12-entity-role-decision-tree)
13. [Processor Category Registry](#13-processor-category-registry)
14. [Enums and Constants](#14-enums-and-constants)
15. [Profile Storage](#15-profile-storage)
16. [Theming and CSS](#16-theming-and-css)
17. [Debugging Procedures](#17-debugging-procedures)
18. [Performance Considerations](#18-performance-considerations)
19. [Extending the Application](#19-extending-the-application)
20. [Incident Response Runbook](#20-incident-response-runbook)

---

## 1. Repository Structure

The privacy tools app lives inside the `BrightPath-Technologies` monorepo as a sub-application.

```
BrightPath-Technologies/
├── .github/workflows/deploy.yml   ← CI/CD (builds both apps)
├── .gitignore
├── CNAME                          ← brightpathtechnology.io
├── src/                           ← Main BrightPath site (React/JSX)
├── dist/                          ← Main site build output (committed)
├── package.json                   ← Main site dependencies
│
└── privacy-tools/                 ← Privacy Policy Generator (React/TS)
    ├── core/                      ← Regulatory engine (bundled from agent project)
    │   ├── core/
    │   │   ├── regulatory-mapper.ts
    │   │   ├── section-assembler.ts
    │   │   ├── disclaimer-builder.ts
    │   │   └── engine.ts           ← CLI orchestrator (unused by web app)
    │   ├── data/
    │   │   ├── enums.ts
    │   │   ├── types.ts            ← Zod schemas
    │   │   └── regulations/
    │   │       ├── index.ts        ← Module registry
    │   │       ├── pipeda.ts
    │   │       ├── quebec-law25.ts
    │   │       ├── alberta-pipa.ts
    │   │       ├── bc-pipa.ts
    │   │       ├── gdpr.ts
    │   │       ├── ccpa.ts
    │   │       └── cpra.ts
    │   ├── templates/renderers/
    │   │   └── markdown.renderer.ts
    │   └── utils/
    │       └── validators.ts
    ├── src/
    │   ├── App.tsx                 ← View routing
    │   ├── main.tsx                ← Entry point
    │   ├── index.css               ← Tailwind v4 theme variables
    │   ├── components/
    │   │   ├── home/HomePage.tsx
    │   │   ├── layout/{Header,Layout}.tsx
    │   │   ├── preview/{PreviewPanel,MarkdownPreview}.tsx
    │   │   ├── shared/{ExportActions,JurisdictionPicker}.tsx
    │   │   ├── steps/              ← Wizard step components
    │   │   │   ├── Step1Jurisdictions.tsx
    │   │   │   ├── Step2OrgProfile.tsx
    │   │   │   ├── Step3DataPractices.tsx
    │   │   │   ├── Step4ThirdParty.tsx
    │   │   │   ├── Step5Review.tsx
    │   │   │   ├── Step6Generate.tsx
    │   │   │   ├── EntityRoleDetermination.tsx
    │   │   │   ├── ProcessorDiscovery.tsx
    │   │   │   ├── entity-role-tree.ts
    │   │   │   └── processor-categories.ts
    │   │   ├── tools/              ← Standalone tool wrappers
    │   │   │   ├── EntityRoleStandalone.tsx
    │   │   │   └── ProcessorDiscoveryStandalone.tsx
    │   │   └── wizard/{WizardPanel,StepIndicator,StepNavigation}.tsx
    │   ├── hooks/
    │   │   └── use-disclaimer-preview.ts  ← Generation pipeline hook
    │   ├── state/
    │   │   ├── disclaimer-context.tsx     ← React Context + Provider
    │   │   ├── disclaimer-reducer.ts      ← Reducer logic
    │   │   └── profile-storage.ts         ← localStorage API
    │   ├── types/views.ts
    │   ├── utils/
    │   │   ├── download.ts
    │   │   ├── minimal-input-builder.ts
    │   │   ├── role-implications.ts
    │   │   └── standalone-renderers.ts
    │   └── lib/utils.ts            ← cn() helper (clsx + tailwind-merge)
    ├── docs/
    │   ├── L1-SUPPORT-GUIDE.md
    │   └── L2-L3-SUPPORT-GUIDE.md  ← This file
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    └── index.html
```

### Path Aliases

| Alias | Resolves To | Configured In |
|---|---|---|
| `@/*` | `./src/*` | vite.config.ts, tsconfig.app.json |
| `@core/*` | `./core/*` | vite.config.ts, tsconfig.app.json |

### Origin of `core/`

The `core/` directory is a bundled copy of `privacy-disclaimer-agent/src/` (the CLI version of this tool). It was copied into the repo so the web app is self-contained for deployment. The source-of-truth development copy lives at `/Users/davidmartin/Documents/04-Projects/privacy-disclaimer-agent/src/`. Changes to regulatory modules or core logic should be made in the agent project first, then synced to `privacy-tools/core/`.

---

## 2. Build Pipeline and Dependencies

### Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| react / react-dom | 19.2.0 | UI framework |
| zod | 3.25.76 | Schema validation for all input data |
| react-hook-form | 7.71.1 | Form state management |
| @hookform/resolvers | 5.2.2 | Zod resolver for react-hook-form |
| react-markdown | 10.1.0 | Markdown rendering in preview |
| remark-gfm | 4.0.1 | GitHub-flavored markdown (tables, strikethrough) |
| lucide-react | 0.563.0 | Icon library |
| tailwindcss | 4.1.18 | Utility-first CSS (v4, OKLch color space) |
| class-variance-authority | 0.7.1 | Variant-based component styling |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 | Conditional class merging |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| vite | 7.2.4 | Build tool and dev server |
| @vitejs/plugin-react | 5.1.1 | React Fast Refresh for Vite |
| @tailwindcss/vite | 4.1.18 | Tailwind CSS v4 Vite plugin |
| @tailwindcss/typography | 0.5.19 | Prose styles for markdown rendering |
| typescript | 5.9.3 | TypeScript compiler |
| eslint | 9.39.1 | Linting |

### Build Commands

```bash
# Development
npm run dev          # Vite dev server (default: http://localhost:5173)

# Production build
npm run build        # Runs: tsc -b && vite build
                     # Output: ./dist/

# Lint
npm run lint         # ESLint check

# Preview production build
npm run preview      # Vite preview server
```

### TypeScript Configuration

**tsconfig.app.json** (primary):
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` disabled (allows flexibility during development)
- Explicitly includes: `src/`, `core/data`, core module files, `core/templates`, `core/utils/validators.ts`

**tsconfig.node.json**:
- Target: ES2023, strict mode with `noUnusedLocals`/`noUnusedParameters` enabled
- Covers only `vite.config.ts`

### Vite Configuration

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/privacy-tools/',        // Sub-path deployment
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './core'),
    },
  },
})
```

**Critical:** The `base: '/privacy-tools/'` setting ensures all asset paths (JS, CSS, images) are prefixed with `/privacy-tools/` in the production build. Changing this breaks asset loading.

---

## 3. CI/CD and Deployment

### GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`
**Trigger:** Push to `main` branch
**Environment:** `github-pages`

```
Build Job (ubuntu-latest, Node 22):
  1. Checkout code
  2. Setup Node 22
  3. npm ci --legacy-peer-deps         ← Main site (legacy-peer-deps for Radix compatibility)
  4. npm run build                      ← Main site → ./dist/
  5. cd privacy-tools && npm ci         ← Privacy tools dependencies
  6. cd privacy-tools && npm run build  ← Privacy tools → ./privacy-tools/dist/
  7. cp -r ./privacy-tools/dist ./dist/privacy-tools  ← Merge into single artifact
  8. Upload ./dist/ as Pages artifact

Deploy Job:
  9. Deploy Pages artifact
```

### Deployment Architecture

```
GitHub Pages serves:
  brightpathtechnology.io/               → ./dist/index.html (main site)
  brightpathtechnology.io/privacy-tools/  → ./dist/privacy-tools/index.html (privacy app)
```

Both apps are independent React SPAs sharing a single GitHub Pages deployment. They do not share runtime code, state, or routing.

### DNS Configuration

`brightpathtechnology.io` resolves to GitHub Pages IPs (185.199.108-111.153). CNAME file in repo root contains `brightpathtechnology.io`.

### Deployment Troubleshooting

| Issue | Check |
|---|---|
| 404 on `/privacy-tools/` | Verify `cp -r` step in workflow; check `dist/privacy-tools/index.html` exists in artifact |
| Assets 404 | Verify `base: '/privacy-tools/'` in vite.config.ts matches deployment path |
| Main site broken | Check main site build step; `--legacy-peer-deps` may mask dependency conflicts |
| Workflow fails on npm ci | Lock file mismatch — run `npm install` locally and commit updated `package-lock.json` |
| Workflow fails on tsc | TypeScript errors — run `npx tsc -b` locally to reproduce |

---

## 4. Application Architecture

### Data Flow

```
User Input → DisclaimerReducer (state) → useDisclaimerPreview (hook)
                                              │
                                              ├── ValidatedInputSchema.safeParse()
                                              │         (Zod validation)
                                              │
                                              ├── mapRegulations(input)
                                              │         (iterates jurisdiction modules)
                                              │         → MappedRequirement[]
                                              │
                                              ├── buildDisclaimer(requirements, input)
                                              │         → assembleSections()
                                              │         → { sections, metadata }
                                              │
                                              └── renderMarkdown(sections, metadata)
                                                        → string (final Markdown)
```

### View Routing

No URL-based routing. Views are switched via `useState<ActiveView>` in `App.tsx`.

```typescript
type ActiveView = 'home' | 'wizard' | 'entity-role' | 'processor-discovery';
```

| View | Component | Preview Panel |
|---|---|---|
| `'home'` | `HomePage` | Hidden |
| `'wizard'` | `WizardPanel` | Visible (lg+ screens) |
| `'entity-role'` | `EntityRoleStandalone` | Hidden |
| `'processor-discovery'` | `ProcessorDiscoveryStandalone` | Hidden |

### Component Hierarchy

```
App
├── DisclaimerProvider (React Context)
│   └── Layout
│       ├── Header (logo, tools dropdown, home button)
│       ├── Main Content Area
│       │   ├── HomePage (when view = 'home')
│       │   ├── WizardPanel (when view = 'wizard')
│       │   │   ├── StepIndicator
│       │   │   ├── Step1–Step6 (current step)
│       │   │   └── StepNavigation
│       │   ├── EntityRoleStandalone (when view = 'entity-role')
│       │   └── ProcessorDiscoveryStandalone (when view = 'processor-discovery')
│       └── PreviewPanel (visible only in wizard view, lg+ screens)
│           └── MarkdownPreview
```

---

## 5. State Management

### DisclaimerState

```typescript
interface DisclaimerState {
  currentStep: number;              // 1-based (1–6)
  jurisdictions: Jurisdiction[];
  orgProfile: Partial<OrgProfile>;
  dataPractices: Partial<DataPractices>;
}
```

### Reducer Actions

| Action Type | Payload | Behavior |
|---|---|---|
| `SET_STEP` | `number` | Sets `currentStep` |
| `SET_JURISDICTIONS` | `Jurisdiction[]` | Replaces `jurisdictions` array |
| `SET_ORG_PROFILE` | `Partial<OrgProfile>` | Shallow merges into `orgProfile` |
| `SET_DATA_PRACTICES` | `Partial<DataPractices>` | Shallow merges into `dataPractices` |
| `SET_THIRD_PARTY` | `{ thirdPartySharing, crossBorderTransfers }` | Atomic update of both third-party fields in `dataPractices` |
| `RESET` | — | Returns `initialState` |

### Initial State

```typescript
{
  currentStep: 1,
  jurisdictions: [],
  orgProfile: {},
  dataPractices: {},
}
```

### Context API

```typescript
const { state, dispatch } = useDisclaimer();
// Throws Error if used outside DisclaimerProvider
```

**Important:** State is in-memory only. Page refresh clears all wizard progress. The `profile-storage.ts` module provides localStorage persistence for org profiles, but auto-save is not wired into the wizard flow.

---

## 6. Validation Layer (Zod Schemas)

All schemas are defined in `core/data/types.ts`. The `ValidatedInputSchema` is the top-level schema used by the generation pipeline.

### Schema Hierarchy

```
ValidatedInputSchema
├── jurisdictions: Jurisdiction[].min(1)
├── orgProfile: OrgProfileSchema
│   ├── legalName: string.min(1)
│   ├── tradingName?: string
│   ├── entityType: 'controller' | 'processor' | 'joint_controller'
│   ├── industrySector: string
│   ├── websiteUrl?: string (URL format)
│   ├── headquartersCountry: string
│   ├── headquartersProvince?: string
│   ├── dpoContact: DpoContactSchema
│   │   ├── name?: string
│   │   ├── title: string
│   │   ├── email: string (email format)
│   │   ├── phone?: string
│   │   └── address?: string
│   └── euRepresentative?: EuRepresentativeSchema
│       ├── name: string
│       ├── email: string (email format)
│       └── address: string
│
└── dataPractices: DataPracticesSchema
    ├── dataCategories: DataCategory[].min(1)
    ├── dataSources: DataSource[]
    ├── processingPurposes: ProcessingPurposeEntrySchema[].min(1)
    │   ├── purpose: ProcessingPurpose (enum)
    │   ├── legalBasis: LegalBasis (enum)
    │   └── description?: string
    ├── retentionSchedule: RetentionEntrySchema[]
    │   ├── dataCategory: DataCategory (enum)
    │   ├── period: string
    │   └── justification?: string
    ├── thirdPartySharing: ThirdPartySharingSchema
    │   ├── shares: boolean
    │   ├── recipients?: ThirdPartyRecipientSchema[]
    │   │   ├── category: string
    │   │   ├── purpose: string
    │   │   ├── dataCategories: DataCategory[]
    │   │   └── country?: string
    │   ├── sellsData: boolean
    │   └── sharesForCrossBehavioral: boolean
    ├── crossBorderTransfers: CrossBorderTransfersSchema
    │   ├── transfers: boolean
    │   └── destinations?: CrossBorderDestinationSchema[]
    │       ├── country: string
    │       ├── mechanism: TransferMechanism (enum)
    │       └── dataCategories: DataCategory[]
    ├── consentMechanisms: ConsentMechanism[]
    ├── collectsChildrensData: boolean
    ├── minimumAgeThreshold?: number
    ├── usesCookies: boolean
    ├── usesAutomatedDecisionMaking: boolean
    └── conductsDPIA: boolean
```

### Key Validation Rules

- `jurisdictions` must have at least 1 entry
- `dataCategories` must have at least 1 entry
- `processingPurposes` must have at least 1 entry
- `dpoContact.email` must be valid email format
- `orgProfile.legalName` must be non-empty
- All enum fields validate against `z.nativeEnum()`

### Validation in the Pipeline

The `useDisclaimerPreview` hook calls `ValidatedInputSchema.safeParse()` on every state change. If parsing fails, no output is generated and `isValid` returns `false`. The Zod error object is not surfaced to the user — the UI simply disables generation.

---

## 7. Regulatory Pipeline

### Pipeline Stages

```
Stage 1: mapRegulations(input)
    Input:  ValidatedInput
    Output: MappedRequirement[]
    Logic:  Iterates input.jurisdictions, calls each module's
            mapRequirements(input), concatenates all results.
            No deduplication or filtering at this stage.

Stage 2: buildDisclaimer(requirements, input)
    Input:  MappedRequirement[], ValidatedInput
    Output: { sections: DisclaimerSection[], metadata: DisclaimerMetadata }
    Logic:  Calls assembleSections() which runs 15 section builder
            functions in SECTION_ORDER. Each builder filters requirements
            by topic/subtopic and constructs a DisclaimerSection.
            Metadata includes generation timestamp, org name, version,
            jurisdiction list, and requirement count.

Stage 3: renderMarkdown(sections, metadata)
    Input:  DisclaimerSection[], DisclaimerMetadata
    Output: string (Markdown with YAML frontmatter)
    Logic:  Generates YAML frontmatter, table of contents, section
            content with emphasis and jurisdiction callouts, and a
            statutory references appendix.
```

### MappedRequirement Structure

```typescript
interface MappedRequirement {
  id: string;                    // e.g., 'PIPEDA-P4.1', 'GDPR-ART15'
  jurisdiction: Jurisdiction;
  topic: TopicCategory;          // For filtering by section builders
  subtopic: string;              // For fine-grained filtering
  statutoryReference: string;    // e.g., 'PIPEDA Schedule 1, Principle 4.1'
  obligationType: 'disclosure' | 'right' | 'safeguard' | 'process' | 'restriction';
  requirementText: string;       // Formal requirement description
  disclaimerLanguage: string;    // User-facing policy language (interpolated)
  conditionalOn: string[];       // Condition paths that triggered this requirement
  priority: 'required' | 'recommended' | 'conditional';
}
```

The `disclaimerLanguage` field is pre-interpolated with organization-specific values (org name, DPO email, etc.) at the regulation module level.

---

## 8. Regulation Module Anatomy

### Module Interface

```typescript
interface RegulationModule {
  id: Jurisdiction;
  fullName: string;
  shortName: string;
  effectiveDate: string;         // YYYY-MM-DD
  sourceUrl: string;
  mapRequirements(input: ValidatedInput): MappedRequirement[];
}
```

### Registry (`core/data/regulations/index.ts`)

```typescript
getRegulationModule(jurisdiction: Jurisdiction): RegulationModule | undefined
getAvailableRegulations(): RegulationModule[]
isRegulationSupported(jurisdiction: Jurisdiction): boolean
```

Seven modules registered: PIPEDA, Alberta PIPA, BC PIPA, Quebec Law 25, GDPR, CCPA, CPRA.

### Module Pattern (PIPEDA example)

Each module's `mapRequirements()` follows a consistent pattern:

1. **Derive state flags** from input:
   ```typescript
   const hasSensitive = input.dataPractices.dataCategories
     .some(c => SENSITIVE_CATEGORIES.includes(c));
   const shares = input.dataPractices.thirdPartySharing.shares;
   ```

2. **Push unconditional requirements** (accountability, openness, breach notification)

3. **Push per-entry requirements** (one requirement per processing purpose, per retention entry, per cross-border destination)

4. **Push conditional requirements** based on flags:
   - `hasSensitive` → express consent requirement
   - `collectsChildrensData` → children's consent requirement
   - `usesAutomatedDecisionMaking` → ADM disclosure requirement
   - `usesCookies` → cookie/tracking requirement
   - `shares` → third-party accountability requirement
   - `crossBorderTransfers.transfers` → transfer mechanism requirements

5. **Interpolate `disclaimerLanguage`** with org name, DPO contact, specific categories/purposes

### Requirement Counts by Module (approximate)

| Module | Unconditional | Per-entry | Conditional | Typical Total |
|---|---|---|---|---|
| PIPEDA | ~10 | ~5 per purpose/retention | ~5 | 20–30 |
| GDPR | ~12 | ~5 per purpose/retention/transfer | ~8 | 25–35 |
| CCPA | ~8 | ~3 per purpose | ~4 | 15–20 |
| CPRA | ~10 | ~3 per purpose | ~5 | 18–25 |
| Quebec Law 25 | ~10 | ~4 per purpose/retention | ~5 | 20–28 |
| Alberta PIPA | ~8 | ~4 per purpose/retention | ~4 | 16–22 |
| BC PIPA | ~8 | ~4 per purpose/retention | ~4 | 16–22 |

### Key Conditional Triggers

| Input Field | Triggers Requirements In |
|---|---|
| `collectsChildrensData` | All 7 modules |
| `usesCookies` | All 7 modules |
| `usesAutomatedDecisionMaking` | All 7 modules |
| `conductsDPIA` | GDPR (Art. 35) |
| `thirdPartySharing.shares` | All 7 modules |
| `thirdPartySharing.sellsData` | CCPA, CPRA |
| `thirdPartySharing.sharesForCrossBehavioral` | CPRA |
| `crossBorderTransfers.transfers` | All 7 modules |
| `euRepresentative` present | GDPR (Art. 27) |
| Sensitive data categories | PIPEDA, GDPR, Quebec Law 25 |

---

## 9. Section Assembly

### Section Order

```typescript
const SECTION_ORDER = [
  'preamble',
  'data-collection',
  'legal-basis',
  'use-of-data',
  'data-sharing',
  'cross-border',
  'retention',
  'data-subject-rights',
  'security-measures',
  'children',
  'cookies',
  'automated-decisions',
  'changes-to-policy',
  'contact',
  'jurisdiction-specific',
];
```

### Section Builder Behavior

| Section ID | Topic/Subtopic Filter | Conditional On | Returns null when |
|---|---|---|---|
| `preamble` | None | Always | Never |
| `data-collection` | `DATA_MANAGEMENT` / `Limiting collection` | Always | Never |
| `legal-basis` | Subtopic includes `consent` | Always | Never |
| `use-of-data` | Subtopic = `Identifying purposes` or `Purpose specification` | Always | Never |
| `data-sharing` | `THIRD_PARTY` topic | Always | Never (shows "We do not share" if shares=false) |
| `cross-border` | Subtopic includes `cross-border` | `transfers = true` | `transfers = false` |
| `retention` | Subtopic includes `retention` | Always | Never |
| `data-subject-rights` | `DATA_SUBJECT_RIGHTS` topic | Always | Never |
| `security-measures` | `DATA_PROTECTION` topic | Always | Never |
| `children` | Subtopic includes `children` or `age` | `collectsChildrensData` | `collectsChildrensData = false` |
| `cookies` | Subtopic includes `cookie` or `tracking` | `usesCookies` | `usesCookies = false` |
| `automated-decisions` | Subtopic includes `automated` | `usesAutomatedDecisionMaking` | `usesAutomatedDecisionMaking = false` |
| `changes-to-policy` | None (static template) | Always | Never |
| `contact` | Subtopic = `Challenging compliance` | Always | Never |
| `jurisdiction-specific` | `ENFORCEMENT` topic (excl. `Challenging compliance`) | Has matching reqs | No matching requirements |

### Multi-Jurisdiction Handling

When multiple jurisdictions are selected, the `data-subject-rights` builder groups requirements by jurisdiction and creates separate `JurisdictionCallout` entries instead of inline paragraphs. Each callout contains the jurisdiction-specific rights language.

For single-jurisdiction selections, rights are rendered as inline paragraphs without callout wrappers.

---

## 10. Markdown Rendering

### Output Structure

```
---                              ← YAML frontmatter
title: "Privacy Policy — {org}"
effective_date: "February 7, 2026"
generated: "2026-02-07T..."
version: "0.1.0"
jurisdictions:
  - "PIPEDA (Canada — Federal)"
requirement_count: 42
---

# Privacy Policy — {org}         ← H1 (preamble only)
{preamble paragraphs}

## Table of Contents
1. [Data Collection](#data-collection)
2. [Legal Basis](#legal-basis)
...

---

## 1. Data Collection               ← H2 (all other sections)
{paragraphs}

### GDPR                             ← H3 (jurisdiction callouts)
{callout body}

**Statutory References:**
- **GDPR Art. 6** — Lawful basis

---

## Statutory References              ← Appendix
- **PIPEDA Schedule 1, Principle 4.1** (PIPEDA)
- **GDPR Art. 5** (GDPR)
```

### Rendering Rules

- **Emphasis:** `normal` = plain text, `bold` = `**text**`, `italic` = `*text*`
- **Jurisdiction callouts:** Rendered as H3 under parent H2; include their own citations
- **Citations:** De-duplicated globally by `jurisdiction + reference` for the appendix
- **Section separators:** Horizontal rules (`---`) between sections
- **Preamble:** Only section rendered as H1; all others are H2

---

## 11. Standalone Tool Infrastructure

### Minimal Input Builder

`buildMinimalValidatedInput(options)` constructs a `ValidatedInput` that passes Zod validation with minimal placeholder data. Used when standalone tools need to query regulation modules without full wizard state.

**Placeholder values:**
- Org name: `'Organization'`
- Entity type: `'controller'`
- Industry: `'Technology'`
- Country: `'Canada'`
- DPO: `{ title: 'Privacy Officer', email: 'privacy@organization.example' }`

These placeholders appear only in non-relevant sections (e.g., preamble, contact). Standalone tools filter output to only the sections they need (e.g., third-party requirements for processor disclosure).

### Standalone Renderers

**`renderProcessorDisclosure(input)`**

Input: `{ recipients[], jurisdictions[], requirements[], generatedAt }`

Output sections:
1. YAML frontmatter (document_type: `third-party-processor-disclosure`)
2. Third-Party Service Providers (bulleted list per provider)
3. Processor Registry (Markdown table: Category | Purpose | Data Categories | Country)
4. Regulatory Disclosure Requirements (grouped by jurisdiction, shows `disclaimerLanguage`)
5. Statutory References (de-duplicated)
6. Legal disclaimer

**`renderRoleDeterminationMemo(input)`**

Input: `{ entityType, outcomeLabel, outcomeExplanation, decisionPath[], jurisdictions[], generatedAt }`

Output sections:
1. YAML frontmatter (document_type: `entity-role-determination`)
2. Conclusion (role determination summary)
3. Decision Path (numbered Q&A walkthrough)
4. Regulatory Implications (per jurisdiction, from `getRoleImplication()`)
5. Legal disclaimer

### Role Implications

`getRoleImplication(jurisdiction, entityType)` returns static regulatory text. Coverage: 7 jurisdictions x 3 roles = 21 entries.

Each entry is ~150–200 words of regulatory context with specific statutory references (e.g., GDPR Art. 24, 26, 28; PIPEDA Principle 4.1, 4.1.3).

---

## 12. Entity Role Decision Tree

### Tree Structure

```
q1: "Does your organization determine WHY personal data is collected?"
├── Yes → q2: "Does your organization determine HOW personal data is processed?"
│         ├── Yes → q3a: "Do you SHARE these decisions with another organization?"
│         │         ├── Yes → Joint Controller
│         │         └── No  → Controller
│         └── No  → Joint Controller
└── No  → q3: "Does ANOTHER organization instruct you on what to collect and how to process?"
          ├── Yes → Processor
          └── No  → q4: "Do you share decision-making about purposes with another org?"
                    ├── Yes → Joint Controller
                    └── No  → Processor
```

### Node Types

```typescript
type QuestionNode = {
  kind: 'question';
  id: string;
  question: string;
  helpText: string;
  yes: string;     // Next node ID
  no: string;      // Next node ID
};

type OutcomeNode = {
  kind: 'outcome';
  id: string;
  entityType: 'controller' | 'processor' | 'joint_controller';
  label: string;
  explanation: string;
};

type TreeNode = QuestionNode | OutcomeNode;
```

### Decision Path Tracking

In standalone mode, `EntityRoleStandalone` passes an `onStepComplete` callback to `EntityRoleDetermination`. Each time the user answers a question, the callback records `{ question, answer }`. This array becomes the `decisionPath` in the exported memo.

---

## 13. Processor Category Registry

12 pre-defined processor categories in `processor-categories.ts`.

```typescript
interface ProcessorCategory {
  id: string;                          // e.g., 'cloud_hosting'
  label: string;                       // Display name
  category: string;                    // Formal category for recipient
  purpose: string;                     // Pre-populated purpose text
  examples: string;                    // Comma-separated vendor names
  suggestedDataCategories: DataCategory[];
}
```

### Category Data Flow

1. User selects categories in discovery grid
2. Selected categories pre-populate customization form
3. User edits category, purpose, country, data categories per provider
4. Finalized providers become `ThirdPartyRecipient` entries
5. In wizard mode: appended to `dataPractices.thirdPartySharing.recipients`
6. In standalone mode: passed to `renderProcessorDisclosure()`

### AI-Specific Categories

Categories 11–12 were added to address AI/ML data sharing obligations:

| Category | Key Risk | Suggested Data Categories |
|---|---|---|
| `ai_ml_providers` (direct API) | Data sent to LLM APIs for inference/training | Personal identifiers, behavioral, user-generated, sensitive personal |
| `ai_embedded_saas` (embedded AI) | Data processed by AI features within SaaS tools | Personal identifiers, user-generated, employment |

These map to existing `usesAutomatedDecisionMaking` conditional requirements in all 7 regulation modules.

---

## 14. Enums and Constants

### Jurisdiction

| Enum Value | Label |
|---|---|
| `PIPEDA` | PIPEDA (Canada — Federal) |
| `QUEBEC_LAW25` | Quebec Law 25 |
| `ALBERTA_PIPA` | Alberta PIPA |
| `BC_PIPA` | BC PIPA |
| `GDPR` | GDPR (EU) |
| `CCPA` | CCPA (California) |
| `CPRA` | CPRA (California) |

### DataCategory (12)

`PERSONAL_IDENTIFIERS`, `FINANCIAL`, `HEALTH`, `BIOMETRIC`, `GEOLOCATION`, `BEHAVIORAL`, `EMPLOYMENT`, `EDUCATION`, `SENSITIVE_PERSONAL`, `CHILDRENS`, `DEVICE_TECHNICAL`, `USER_GENERATED`

### LegalBasis (6)

`CONSENT`, `CONTRACT`, `LEGAL_OBLIGATION`, `VITAL_INTERESTS`, `PUBLIC_INTEREST`, `LEGITIMATE_INTEREST`

### ProcessingPurpose (10)

`SERVICE_DELIVERY`, `ACCOUNT_MANAGEMENT`, `MARKETING_DIRECT`, `MARKETING_THIRD_PARTY`, `ANALYTICS`, `PERSONALIZATION`, `LEGAL_COMPLIANCE`, `SECURITY_FRAUD`, `RESEARCH`, `EMPLOYMENT_ADMIN`

### TransferMechanism (6)

`ADEQUACY_DECISION`, `STANDARD_CONTRACTUAL_CLAUSES`, `BINDING_CORPORATE_RULES`, `EXPLICIT_CONSENT`, `CONTRACTUAL_NECESSITY`, `COMPARABLE_PROTECTION`

### TopicCategory (8)

`DEFINITIONS`, `SCOPE`, `DATA_SUBJECT_RIGHTS`, `ENTERPRISE_REQUIREMENTS`, `DATA_PROTECTION`, `DATA_MANAGEMENT`, `ENFORCEMENT`, `THIRD_PARTY`

### ConsentMechanism (5)

`OPT_IN`, `OPT_OUT`, `GRANULAR_CONSENT`, `COOKIE_CONSENT_BANNER`, `DOUBLE_OPT_IN`

### DataSource (5)

`DIRECTLY_FROM_SUBJECT`, `THIRD_PARTY_PROVIDERS`, `AUTOMATED_COLLECTION`, `PUBLIC_SOURCES`, `SOCIAL_MEDIA`

---

## 15. Profile Storage

### API (`src/state/profile-storage.ts`)

| Function | Signature | Behavior |
|---|---|---|
| `saveProfile` | `(profile: OrgProfile, name?: string) → void` | Slugifies name, stores in localStorage |
| `loadProfile` | `(name: string) → OrgProfile \| null` | Loads and validates with `OrgProfileSchema.safeParse()` |
| `loadAllProfiles` | `() → Record<string, OrgProfile>` | Returns all profiles; empty `{}` on error |
| `deleteProfile` | `(name: string) → void` | Removes profile by slug |
| `listProfileNames` | `() → string[]` | Returns all profile slugs |

### Storage Details

- **Key:** `privacy-agent-profiles`
- **Format:** `{ "slug-name": OrgProfile, ... }`
- **Slugification:** Lowercase, replace `/[^a-z0-9]+/g` with hyphens, trim trailing hyphens
- **Validation:** Profiles are validated against `OrgProfileSchema` on load; invalid profiles return `null`
- **No auto-save:** Wizard does not auto-persist profiles. Manual save/load UI not currently implemented.

### Clearing Profiles

Profiles are lost when:
- User clears browser data / localStorage
- User switches browsers
- User uses private/incognito mode
- localStorage quota exceeded (silent failure)

---

## 16. Theming and CSS

### Tailwind v4 Configuration

The app uses Tailwind CSS v4 with OKLch color space. Theme variables are defined in `src/index.css` via CSS custom properties.

### Color Palette

| Variable | Value (OKLch) | Use |
|---|---|---|
| `--color-primary` | `oklch(0.488 0.243 264.376)` | Buttons, active states, links |
| `--color-primary-foreground` | `oklch(0.984 0.003 247.858)` | Text on primary background |
| `--color-background` | `oklch(1 0 0)` | Page background (white) |
| `--color-foreground` | `oklch(0.145 0.017 285.82)` | Primary text (near black) |
| `--color-muted` | `oklch(0.967 0.003 286.32)` | Muted backgrounds |
| `--color-muted-foreground` | `oklch(0.553 0.013 285.938)` | Secondary text |
| `--color-destructive` | `oklch(0.577 0.245 27.325)` | Error states, destructive actions |
| `--color-border` | `oklch(0.922 0.004 286.32)` | Borders and dividers |
| `--color-ring` | `oklch(0.488 0.243 264.376)` | Focus rings |

### Border Radius

| Variable | Value |
|---|---|
| `--radius-sm` | 0.25rem |
| `--radius-md` | 0.375rem |
| `--radius-lg` | 0.5rem |
| `--radius-xl` | 0.75rem |

### Typography

- Body: `system-ui, -apple-system, sans-serif`
- Markdown preview: `@tailwindcss/typography` plugin (prose styles)
- Font smoothing: `-webkit-font-smoothing: antialiased`

---

## 17. Debugging Procedures

### Generation Pipeline Failures

**Symptom:** Preview shows empty state / "Cannot generate" error

**Diagnostic steps:**

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify state has required fields:
   ```javascript
   // In React DevTools or console:
   // Check context state has:
   // - jurisdictions.length >= 1
   // - orgProfile.legalName (non-empty)
   // - orgProfile.entityType (set)
   // - orgProfile.dpoContact.title and .email (set)
   // - dataPractices.dataCategories.length >= 1
   // - dataPractices.processingPurposes.length >= 1
   ```
4. If state looks complete, the Zod schema may be rejecting a field. Check `ValidatedInputSchema.safeParse()` result:
   - Common failures: missing `thirdPartySharing.sellsData` or `thirdPartySharing.sharesForCrossBehavioral` (both required booleans)
   - Missing `crossBorderTransfers` object (must be `{ transfers: false }` at minimum)

### Regulation Module Not Producing Output

**Symptom:** Specific jurisdiction's requirements missing from output

1. Verify module is registered in `core/data/regulations/index.ts`
2. Verify `isRegulationSupported(jurisdiction)` returns `true`
3. Check module's `mapRequirements()` — conditional requirements may not be triggered (e.g., `usesAutomatedDecisionMaking = false` skips ADM requirements)
4. Check section builders — the TopicCategory or subtopic filter may not match the requirement's `topic`/`subtopic`

### Empty Sections in Output

**Symptom:** A section header appears but has no content

1. Section builders return null for conditional sections — verify the section is expected based on input
2. If the section should have content, check that regulation modules produce requirements with matching `topic` and `subtopic` strings
3. Subtopic matching uses `includes()` — verify exact substring match (case-sensitive)

### Standalone Tool Export Issues

**Symptom:** Standalone tool exports contain placeholder org name "Organization"

This is expected. Standalone tools use `buildMinimalValidatedInput()` which uses placeholder values. The placeholders should only appear in sections filtered out by the standalone renderer. If they appear in the main content, check:
1. The `TopicCategory.THIRD_PARTY` filter in `ProcessorDiscoveryStandalone.tsx`
2. The `renderProcessorDisclosure()` function — it should only include third-party sections

### Build Failures

```bash
# Reproduce locally
cd privacy-tools
npx tsc -b         # TypeScript errors
npm run build       # Full build
npm run lint        # ESLint errors
```

Common TypeScript errors:
- Missing required Zod schema fields when constructing objects
- `@core` import path issues (check alias in vite.config.ts and tsconfig.app.json)
- `.js` extensions in imports — bundler resolution handles this, but tsc may flag mismatches

---

## 18. Performance Considerations

### Generation Pipeline

- `useDisclaimerPreview` is memoized with `useMemo` on three dependencies: `jurisdictions`, `orgProfile`, `dataPractices`
- Schema validation (`safeParse()`) and full pipeline run on every dependency change
- With 7 jurisdictions selected: ~140–210 requirements mapped, 15 section builders run
- Typical generation time: <50ms (all computation, no I/O)

### Potential Bottlenecks

| Area | Risk | Mitigation |
|---|---|---|
| Schema validation | Runs on every keystroke (via state change) | Debouncing not implemented; consider if input lag occurs |
| Requirement mapping | Linear with jurisdiction count x requirement count | Acceptable for 7 jurisdictions; monitor if modules added |
| Markdown rendering | String concatenation for large policies | Single-pass, no DOM manipulation; acceptable |
| localStorage | Full read/write on every profile operation | Acceptable for typical usage (<100 profiles) |

### Bundle Size

| Asset | Size | Gzipped |
|---|---|---|
| JavaScript | ~640 KB | ~173 KB |
| CSS | ~39 KB | ~7 KB |

The JS bundle exceeds the 500 KB Vite warning threshold. If bundle size becomes a concern:
- Code-split regulation modules with dynamic `import()`
- Separate vendor chunk for React, Zod, react-markdown
- Lazy-load standalone tool views

---

## 19. Extending the Application

### Adding a New Jurisdiction

1. Create `core/data/regulations/{jurisdiction}.ts`:
   - Implement `RegulationModule` interface
   - Export module with unique `id`, `fullName`, `shortName`, `effectiveDate`, `sourceUrl`
   - Implement `mapRequirements(input)` returning `MappedRequirement[]`

2. Register in `core/data/regulations/index.ts`:
   ```typescript
   import { newModule } from './{jurisdiction}.js';
   // Add to REGULATION_MODULES map
   ```

3. Add to `core/data/enums.ts`:
   ```typescript
   // Add to Jurisdiction enum
   // Add to JURISDICTION_LABELS
   ```

4. Add role implications in `src/utils/role-implications.ts`:
   ```typescript
   // Add entry to ROLE_IMPLICATIONS with controllerText, processorText, jointControllerText
   ```

5. Rebuild and test: `npm run build`

### Adding a New Processor Category

Edit `src/components/steps/processor-categories.ts`:

```typescript
{
  id: 'new_category',
  label: 'Display Name',
  category: 'Formal category name for third-party recipient',
  purpose: 'Description of data processing purpose',
  examples: 'Vendor1, Vendor2, Vendor3',
  suggestedDataCategories: [DataCategory.PERSONAL_IDENTIFIERS, ...],
}
```

No other files need changes — the component renders from the array dynamically.

### Adding a New Section to Generated Output

1. Add section ID to `SECTION_ORDER` in `core/core/section-assembler.ts`
2. Create a builder function: `function buildNewSection(input, requirements): DisclaimerSection | null`
3. Register in `SECTION_BUILDERS` map
4. The section will automatically appear in generated Markdown via `renderMarkdown()`

### Adding a New Standalone Tool

1. Create the tool component in `src/components/tools/`
2. Add the view to `ActiveView` type in `src/types/views.ts`
3. Add routing case in `App.tsx`
4. Add tile to `HomePage.tsx`
5. Add entry to tools dropdown in `Header.tsx`

---

## 20. Incident Response Runbook

### Deployment Failed

```
1. Check: gh run list --repo victorycross/BrightPath-Technologies
2. View logs: gh run view {run-id} --repo victorycross/BrightPath-Technologies --log
3. Common causes:
   a. npm ci failure → lock file out of sync → run npm install locally, commit lock file
   b. tsc failure → TypeScript error → run npx tsc -b locally, fix errors
   c. vite build failure → import resolution → check @core alias, verify file exists
4. Fix, commit, push to main. Workflow re-triggers automatically.
```

### Site Down (404 on brightpathtechnology.io)

```
1. Verify DNS: dig +short brightpathtechnology.io A
   Expected: 185.199.108-111.153
2. Verify CNAME: cat CNAME → should be "brightpathtechnology.io"
3. Check GitHub Pages settings: gh api repos/victorycross/BrightPath-Technologies/pages
4. Check deployment: gh run list --repo victorycross/BrightPath-Technologies --limit 3
5. If DNS correct but site down → GitHub Pages outage. Check githubstatus.com.
```

### Privacy Tools Subpath 404

```
1. Verify artifact includes privacy-tools:
   gh run view {latest-run-id} --repo victorycross/BrightPath-Technologies --log
   Look for: "Merge privacy-tools into dist" step
2. Check that privacy-tools/dist/ was created during build
3. Verify cp -r step completed without errors
4. If artifact missing privacy-tools → check privacy-tools build step for errors
```

### Incorrect Regulatory Content Reported

```
1. Identify the jurisdiction and requirement (get id, e.g., 'GDPR-ART15')
2. Locate the regulation module: core/data/regulations/{jurisdiction}.ts
3. Find the requirement by id in mapRequirements()
4. Verify:
   a. statutoryReference matches the actual regulation text
   b. requirementText accurately describes the obligation
   c. disclaimerLanguage produces appropriate policy language
   d. conditionalOn triggers are correct
5. Fix the module, rebuild, test, commit, push.
```

### User Data Not Generating

```
1. Confirm all required wizard steps are completed (see L1 guide)
2. If L1 checks pass, open browser DevTools:
   a. Console tab: look for errors
   b. React DevTools: inspect DisclaimerProvider state
3. Check Zod validation: construct the input object manually and run
   ValidatedInputSchema.safeParse(input) — inspect error.issues
4. Common schema failures:
   - thirdPartySharing missing sellsData/sharesForCrossBehavioral
   - crossBorderTransfers undefined (must be { transfers: false })
   - processingPurposes empty array
   - dpoContact missing title or email
```

---

*This guide covers the Privacy Policy Generator v1.0 internals. For user-facing support procedures, see the companion [L1 Support Guide](./L1-SUPPORT-GUIDE.md). For the source code, see the `privacy-tools/` directory in the [BrightPath-Technologies repository](https://github.com/victorycross/BrightPath-Technologies).*
