# Privacy Policy Generator — Developer Guide

**Repository:** https://github.com/victorycross/BrightPath-Technologies
**Sub-app path:** `privacy-tools/`
**Stack:** React 19 · TypeScript 5.9 · Vite 7 · Tailwind CSS v4
**Last updated:** 2026-02-07

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Project Structure](#2-project-structure)
3. [Architecture Overview](#3-architecture-overview)
4. [State Management](#4-state-management)
5. [Generation Pipeline](#5-generation-pipeline)
6. [Form Patterns](#6-form-patterns)
7. [Component Patterns](#7-component-patterns)
8. [Styling Conventions](#8-styling-conventions)
9. [Adding a Jurisdiction](#9-adding-a-jurisdiction)
10. [Adding a Processor Category](#10-adding-a-processor-category)
11. [Adding a Wizard Step](#11-adding-a-wizard-step)
12. [Adding a Standalone Tool](#12-adding-a-standalone-tool)
13. [Adding a Section to Generated Output](#13-adding-a-section-to-generated-output)
14. [Testing and Linting](#14-testing-and-linting)
15. [Deployment](#15-deployment)
16. [Code Conventions](#16-code-conventions)

---

## 1. Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Local Development

```bash
cd privacy-tools
npm install
npm run dev        # http://localhost:5173/privacy-tools/
```

### Build

```bash
npm run build      # tsc -b && vite build → ./dist/
npm run preview    # Preview production build
npm run lint       # ESLint check
```

### Repository Context

This app lives inside the `BrightPath-Technologies` monorepo. The parent repo hosts the main BrightPath site. Both apps are deployed to GitHub Pages as a single artifact — the main site at `/` and this app at `/privacy-tools/`.

The `core/` directory contains the regulatory engine, originally developed as a standalone CLI tool (`privacy-disclaimer-agent`). It was copied into this repo to make the web app self-contained. The source-of-truth for regulatory logic is at `~/Documents/04-Projects/privacy-disclaimer-agent/src/`.

---

## 2. Project Structure

```
privacy-tools/
├── core/                          # Regulatory engine
│   ├── core/                      # Pipeline functions
│   │   ├── regulatory-mapper.ts   # Stage 1: input → requirements
│   │   ├── disclaimer-builder.ts  # Stage 2: requirements → sections
│   │   └── section-assembler.ts   # Section builder functions (15)
│   ├── data/
│   │   ├── enums.ts               # All enums and label maps
│   │   ├── types.ts               # Zod schemas and TypeScript types
│   │   └── regulations/           # One file per jurisdiction (7)
│   ├── templates/renderers/
│   │   └── markdown.renderer.ts   # Stage 3: sections → Markdown string
│   └── utils/validators.ts
│
├── src/
│   ├── App.tsx                    # View routing (home|wizard|entity-role|processor-discovery)
│   ├── main.tsx                   # Entry point (StrictMode)
│   ├── index.css                  # Tailwind v4 theme variables
│   │
│   ├── state/                     # Global state
│   │   ├── disclaimer-context.tsx # React Context provider + useDisclaimer() hook
│   │   ├── disclaimer-reducer.ts  # Reducer, action types, initial state
│   │   └── profile-storage.ts     # localStorage persistence for org profiles
│   │
│   ├── hooks/
│   │   └── use-disclaimer-preview.ts  # Memoized generation pipeline
│   │
│   ├── components/
│   │   ├── home/HomePage.tsx          # Landing page with feature tiles
│   │   ├── layout/
│   │   │   ├── Header.tsx             # Navigation, tools dropdown
│   │   │   └── Layout.tsx             # Responsive two-column layout
│   │   ├── wizard/
│   │   │   ├── WizardPanel.tsx        # Step orchestration + validation gating
│   │   │   ├── StepIndicator.tsx      # Progress bar
│   │   │   └── StepNavigation.tsx     # Back/Next buttons
│   │   ├── steps/                     # Wizard step components (1–6)
│   │   │   ├── EntityRoleDetermination.tsx  # Decision tree (used inline + standalone)
│   │   │   ├── ProcessorDiscovery.tsx       # Processor helper (used inline + standalone)
│   │   │   ├── entity-role-tree.ts          # Decision tree data structure
│   │   │   └── processor-categories.ts      # 12 processor category definitions
│   │   ├── tools/                     # Standalone tool wrappers
│   │   ├── preview/                   # Live preview panel
│   │   └── shared/                    # Reusable components (ExportActions, JurisdictionPicker)
│   │
│   ├── utils/
│   │   ├── download.ts                # downloadMarkdown(), copyToClipboard(), buildFilename()
│   │   ├── minimal-input-builder.ts   # Constructs ValidatedInput from minimal data
│   │   ├── role-implications.ts       # Static regulatory text per role per jurisdiction
│   │   └── standalone-renderers.ts    # Markdown renderers for standalone exports
│   │
│   ├── types/views.ts                 # ActiveView type
│   └── lib/utils.ts                   # cn() class merger (clsx + tailwind-merge)
│
├── vite.config.ts                 # base: '/privacy-tools/', aliases
├── tsconfig.app.json              # @core alias, included files
├── package.json
└── index.html
```

### Path Aliases

| Alias | Target | Example |
|---|---|---|
| `@/*` | `./src/*` | `import { useDisclaimer } from '@/state/disclaimer-context.tsx'` |
| `@core/*` | `./core/*` | `import { Jurisdiction } from '@core/data/enums.js'` |

Both configured in `vite.config.ts` (runtime) and `tsconfig.app.json` (type checking).

---

## 3. Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  User Interaction                                       │
│  (Step1–Step6 components dispatch actions)               │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│  DisclaimerReducer                                      │
│  State: { jurisdictions, orgProfile, dataPractices }    │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│  useDisclaimerPreview(state)                useMemo     │
│                                                         │
│  1. Normalize state (fill boolean defaults)             │
│  2. ValidatedInputSchema.safeParse()                    │
│     └─ if invalid → { isValid: false }                  │
│  3. mapRegulations(input)         → MappedRequirement[] │
│  4. buildDisclaimer(reqs, input)  → { sections, meta }  │
│  5. renderMarkdown(sections, meta) → string             │
│                                                         │
│  Returns: { markdown, sections, metadata, isValid }     │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│  PreviewPanel / Step6Generate / ExportActions            │
│  Renders markdown, offers download/copy                 │
└─────────────────────────────────────────────────────────┘
```

### View Routing

No React Router. Views switch via `useState<ActiveView>` in `App.tsx`:

```typescript
type ActiveView = 'home' | 'wizard' | 'entity-role' | 'processor-discovery';
```

The `Layout` component conditionally shows the preview panel only when `activeView === 'wizard'`.

### Component Communication

- **Wizard steps** read from and dispatch to `DisclaimerContext` (global state)
- **Standalone tools** manage their own local state, optionally writing back to context via "Apply to Wizard"
- **Inline helpers** (EntityRoleDetermination, ProcessorDiscovery) communicate with their parent step via callback props

---

## 4. State Management

### Context + Reducer Pattern

```typescript
// Provider wraps entire app in App.tsx
<DisclaimerProvider>
  <Layout ... />
</DisclaimerProvider>

// Any component can access state:
const { state, dispatch } = useDisclaimer();
```

### State Shape

```typescript
interface DisclaimerState {
  currentStep: number;                 // 1–6
  jurisdictions: Jurisdiction[];
  orgProfile: Partial<OrgProfile>;     // Partial during editing
  dataPractices: Partial<DataPractices>;
}
```

### Actions

| Action | Payload | Merge Behavior |
|---|---|---|
| `SET_STEP` | `number` | Replaces `currentStep` |
| `SET_JURISDICTIONS` | `Jurisdiction[]` | Replaces `jurisdictions` |
| `SET_ORG_PROFILE` | `Partial<OrgProfile>` | Shallow merge into `orgProfile` |
| `SET_DATA_PRACTICES` | `Partial<DataPractices>` | Shallow merge into `dataPractices` |
| `SET_THIRD_PARTY` | `{ thirdPartySharing, crossBorderTransfers }` | Atomic replace of both fields |
| `RESET` | — | Returns initial state |

### Why `SET_THIRD_PARTY` Exists

Third-party sharing and cross-border transfers are conceptually linked. Updating one without the other can create inconsistent state (e.g., cross-border destinations referencing recipients that were just removed). The `SET_THIRD_PARTY` action updates both atomically.

### State Is Ephemeral

Wizard state lives in memory only. Refreshing the page clears everything. Profile persistence via localStorage is implemented (`profile-storage.ts`) but not wired into the wizard UI — there's no save/load button.

---

## 5. Generation Pipeline

### Three Stages

```
mapRegulations(input)          →  MappedRequirement[]
buildDisclaimer(reqs, input)   →  { sections: DisclaimerSection[], metadata }
renderMarkdown(sections, meta) →  string
```

### Stage 1: Regulatory Mapping

`core/core/regulatory-mapper.ts`

Iterates `input.jurisdictions`, calls each module's `mapRequirements(input)`, concatenates all results. No filtering or deduplication at this stage.

Each regulation module (e.g., `core/data/regulations/pipeda.ts`) returns 15–35 `MappedRequirement` entries, each tagged with:
- `topic: TopicCategory` — used by section builders to filter
- `subtopic: string` — used for finer-grained filtering
- `disclaimerLanguage: string` — pre-interpolated with org-specific values

### Stage 2: Section Assembly

`core/core/section-assembler.ts`

Iterates `SECTION_ORDER` (15 section IDs). For each, looks up a builder function in `SECTION_BUILDERS` and calls it. Builders filter requirements by `topic`/`subtopic` and construct `DisclaimerSection` objects. Builders can return `null` to skip conditional sections (e.g., children's privacy when `collectsChildrensData = false`).

### Stage 3: Markdown Rendering

`core/templates/renderers/markdown.renderer.ts`

Converts sections into a Markdown string with:
- YAML frontmatter (title, date, jurisdictions, requirement count)
- Table of contents
- Section content with emphasis formatting
- Jurisdiction callouts (H3 under H2 when multi-jurisdiction)
- De-duplicated statutory references appendix

### Hook Integration

`useDisclaimerPreview` wraps the full pipeline in `useMemo`, keyed on `[jurisdictions, orgProfile, dataPractices]`. It normalizes optional booleans to defaults, validates with `safeParse()`, and returns the result or a "not valid" sentinel.

---

## 6. Form Patterns

### No Form Library in Steps

Steps don't use React Hook Form. They dispatch directly to context on every change:

```typescript
function update(partial: Partial<OrgProfile>) {
  dispatch({ type: 'SET_ORG_PROFILE', payload: partial });
}

<input
  value={org.legalName ?? ''}
  onChange={(e) => update({ legalName: e.target.value })}
/>
```

### Checkbox Array Toggle

Used throughout for multi-select checkboxes (jurisdictions, data categories, consent mechanisms):

```typescript
function toggle(item: T) {
  const next = selected.includes(item)
    ? selected.filter(x => x !== item)     // remove
    : [...selected, item];                  // add
  dispatch({ type: 'SET_...', payload: next });
}
```

### Dynamic List CRUD

Used for processing purposes, recipients, and cross-border destinations:

```typescript
// Add with defaults
function addItem() {
  update({ items: [...items, { field1: '', field2: '' }] });
}

// Remove by index
function removeItem(i: number) {
  update({ items: items.filter((_, idx) => idx !== i) });
}

// Update field at index
function updateItem(i: number, field: string, value: unknown) {
  const next = [...items];
  next[i] = { ...next[i], [field]: value };
  update({ items: next });
}
```

### Nested Object Update

For DPO contact and EU representative (objects nested inside `orgProfile`):

```typescript
function updateDpo(field: string, value: string) {
  const dpo = org.dpoContact ?? { title: '', email: '' };
  update({ dpoContact: { ...dpo, [field]: value } } as Partial<OrgProfile>);
}
```

### Auto-Generated Rows

Retention schedule auto-generates a row per data category. Runs on render, preserves existing entries:

```typescript
// In Step3DataPractices render body:
if (categories.length > 0 && retention.length !== categories.length) {
  const newRetention = categories.map(cat => {
    const existing = retention.find(r => r.dataCategory === cat);
    return existing ?? { dataCategory: cat, period: 'Duration of account relationship plus 2 years' };
  });
  update({ retentionSchedule: newRetention });
}
```

---

## 7. Component Patterns

### Inline Helper Toggle

EntityRoleDetermination and ProcessorDiscovery appear both as standalone tools and as inline helpers within wizard steps:

```typescript
const [showHelper, setShowHelper] = useState(false);

// Toggle link
<button onClick={() => setShowHelper(true)}>Help me determine</button>

// Inline render
{showHelper && (
  <HelperComponent
    onComplete={(result) => {
      applyResult(result);
      setShowHelper(false);
    }}
    onDismiss={() => setShowHelper(false)}
  />
)}
```

This pattern keeps the helper self-contained. The parent only provides callbacks for "done" and "cancel".

### Standalone Tool Wrapper

Each standalone tool (`EntityRoleStandalone`, `ProcessorDiscoveryStandalone`) manages its own multi-phase flow with local state:

```typescript
type Phase = 'determine' | 'result' | 'export';
const [phase, setPhase] = useState<Phase>('determine');

switch (phase) {
  case 'determine': return <DeterminationUI onComplete={...} />;
  case 'result':    return <ResultUI onExport={...} />;
  case 'export':    return <ExportActions markdown={...} />;
}
```

Tools can optionally write results back to wizard context via "Apply to Wizard" buttons.

### Empty State Pattern

Components that depend on generated content show a placeholder when data is invalid:

```typescript
if (!isValid || !markdown) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Icon className="text-muted-foreground/40" />
      <p className="text-sm font-medium text-muted-foreground">Title</p>
      <p className="text-xs text-muted-foreground/70">Instructional text</p>
    </div>
  );
}
```

### Success Feedback

Copy-to-clipboard uses a 2-second timeout for visual confirmation:

```typescript
const [copied, setCopied] = useState(false);

async function handleCopy() {
  const ok = await copyToClipboard(content);
  if (ok) {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
}

// In JSX:
{copied ? <Check className="text-green-600" /> : <Copy />}
{copied ? 'Copied' : 'Copy'}
```

### Click-Outside Dropdown

The Header tools dropdown uses a ref + effect pattern:

```typescript
const [open, setOpen] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }
  if (open) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [open]);
```

### Review Card with Edit Navigation

Step5Review uses cards that jump to specific wizard steps:

```typescript
function goToStep(step: number) {
  dispatch({ type: 'SET_STEP', payload: step });
}

<ReviewCard title="Jurisdictions" step={1} onEdit={goToStep}>
  {/* read-only content */}
</ReviewCard>
```

---

## 8. Styling Conventions

### Tailwind CSS v4

Theme defined in `src/index.css` using OKLch color space CSS custom properties. Key semantic tokens:

| Token | Use |
|---|---|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary/helper text |
| `bg-primary` | Primary buttons, active states |
| `bg-accent` | Hover backgrounds |
| `border-border` | Default borders |
| `bg-muted` | Muted backgrounds |
| `text-destructive` | Error text |

### Class Composition

Use `cn()` from `@/lib/utils` for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-md border p-2 text-sm cursor-pointer',
  isActive && 'border-primary bg-primary/5',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />
```

### Responsive Breakpoints

Mobile-first. Key breakpoints used:

| Prefix | Width | Usage |
|---|---|---|
| (none) | All | Base mobile styles |
| `sm:` | 640px | 2-column grids, show labels |
| `lg:` | 1024px | Preview panel visible, wider layouts |

### Common UI Patterns

```typescript
// Selected/unselected checkbox card
className={`... ${selected ? 'border-primary bg-primary/5' : ''}`}

// Nested section indentation
<div className="space-y-4 pl-4 border-l-2 border-primary/20">

// Hover reveal (e.g., CTA text on feature tiles)
<span className="opacity-0 transition-opacity group-hover:opacity-100">

// Scrollable container with max height
<div className="max-h-[60vh] overflow-y-auto">
```

### Icons

All icons from `lucide-react`. Standard sizing:

| Context | Size |
|---|---|
| Inline with text | `h-4 w-4` |
| Section headers | `h-5 w-5` |
| Hero/empty state | `h-10 w-10` |

---

## 9. Adding a Jurisdiction

### Step 1: Add the Enum

`core/data/enums.ts`:

```typescript
export enum Jurisdiction {
  // ... existing
  NEW_JURISDICTION = 'new_jurisdiction',
}

export const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  // ... existing
  [Jurisdiction.NEW_JURISDICTION]: 'New Jurisdiction Name',
};
```

### Step 2: Create the Regulation Module

`core/data/regulations/new-jurisdiction.ts`:

```typescript
import type { ValidatedInput } from '../types.js';
import type { MappedRequirement } from '../types.js';
import { Jurisdiction, TopicCategory, DataCategory } from '../enums.js';

export const newJurisdictionModule = {
  id: Jurisdiction.NEW_JURISDICTION,
  fullName: 'Full Legal Name of the Act',
  shortName: 'Short Name',
  effectiveDate: '2024-01-01',
  sourceUrl: 'https://...',

  mapRequirements(input: ValidatedInput): MappedRequirement[] {
    const requirements: MappedRequirement[] = [];
    const orgName = input.orgProfile.legalName;

    // Unconditional requirements
    requirements.push({
      id: 'NEW-001',
      jurisdiction: Jurisdiction.NEW_JURISDICTION,
      topic: TopicCategory.ENTERPRISE_REQUIREMENTS,
      subtopic: 'Accountability',
      statutoryReference: 'Act, Section X',
      obligationType: 'disclosure',
      requirementText: 'Description of the obligation',
      disclaimerLanguage: `${orgName} complies with...`,
      conditionalOn: [],
      priority: 'required',
    });

    // Conditional requirements
    if (input.dataPractices.collectsChildrensData) {
      requirements.push({ /* children's requirement */ });
    }

    return requirements;
  },
};
```

### Step 3: Register the Module

`core/data/regulations/index.ts`:

```typescript
import { newJurisdictionModule } from './new-jurisdiction.js';

const REGULATION_MODULES = new Map([
  // ... existing
  [Jurisdiction.NEW_JURISDICTION, newJurisdictionModule],
]);
```

### Step 4: Add Role Implications

`src/utils/role-implications.ts`:

```typescript
[Jurisdiction.NEW_JURISDICTION]: {
  jurisdictionLabel: 'New Jurisdiction',
  controllerText: 'As a controller under the New Act, ...',
  processorText: 'As a processor under the New Act, ...',
  jointControllerText: 'As a joint controller under the New Act, ...',
},
```

### Step 5: Verify

```bash
npm run build    # TypeScript checks all enum references
```

The jurisdiction automatically appears in Step 1, JurisdictionPicker, and all standalone tools.

---

## 10. Adding a Processor Category

`src/components/steps/processor-categories.ts`:

```typescript
{
  id: 'new_category',
  label: 'Category Display Name',
  category: 'Formal category name (used in recipient field)',
  purpose: 'What this processor does with personal data',
  examples: 'Vendor A, Vendor B, Vendor C',
  suggestedDataCategories: [
    DataCategory.PERSONAL_IDENTIFIERS,
    DataCategory.DEVICE_TECHNICAL,
  ],
},
```

Add it to the `PROCESSOR_CATEGORIES` array. No other files need changes — the ProcessorDiscovery component renders from this array.

---

## 11. Adding a Wizard Step

### Step 1: Create the Component

`src/components/steps/Step7NewStep.tsx`:

```typescript
import { useDisclaimer } from '@/state/disclaimer-context.tsx';

export function Step7NewStep() {
  const { state, dispatch } = useDisclaimer();
  // ... component logic
}
```

### Step 2: Add to WizardPanel

`src/components/wizard/WizardPanel.tsx`:

1. Update `TOTAL_STEPS` constant
2. Add step label to `STEPS` array
3. Add rendering case: `{step === 7 && <Step7NewStep />}`
4. Add validation logic to `canAdvance()` if needed

### Step 3: Update StepIndicator

If the step indicator auto-generates from the `STEPS` array, no changes needed. Otherwise update the step labels.

### Step 4: Update Review

Add a review card in `Step5Review.tsx` (or renumber steps if inserting mid-sequence).

---

## 12. Adding a Standalone Tool

### Step 1: Create the Tool Component

`src/components/tools/NewToolStandalone.tsx`:

```typescript
interface NewToolStandaloneProps {
  onClose: () => void;
}

export function NewToolStandalone({ onClose }: NewToolStandaloneProps) {
  type Phase = 'input' | 'result' | 'export';
  const [phase, setPhase] = useState<Phase>('input');

  switch (phase) {
    case 'input':  return <InputPhase onComplete={() => setPhase('result')} />;
    case 'result': return <ResultPhase onExport={() => setPhase('export')} onClose={onClose} />;
    case 'export': return <ExportActions markdown={...} filename={...} documentTitle={...} />;
  }
}
```

### Step 2: Add the View Type

`src/types/views.ts`:

```typescript
export type ActiveView = 'home' | 'wizard' | 'entity-role' | 'processor-discovery' | 'new-tool';
```

### Step 3: Add Routing

`src/App.tsx`:

```typescript
case 'new-tool':
  return <NewToolStandalone onClose={() => setActiveView('home')} />;
```

### Step 4: Add to Home Page

`src/components/home/HomePage.tsx` — add entry to `FEATURES` array:

```typescript
{
  id: 'new-tool' as const,
  icon: SomeIcon,
  title: 'New Tool',
  description: 'What this tool does.',
  cta: 'Launch Tool',
},
```

### Step 5: Add to Header Dropdown

`src/components/layout/Header.tsx` — add entry to `TOOLS` array:

```typescript
{
  id: 'new-tool' as ActiveView,
  label: 'New Tool',
  description: 'Brief description for dropdown',
  icon: SomeIcon,
},
```

---

## 13. Adding a Section to Generated Output

### Step 1: Add Section ID

`core/core/section-assembler.ts` — add to `SECTION_ORDER`:

```typescript
const SECTION_ORDER = [
  // ... existing
  'new-section',
];
```

### Step 2: Create the Builder Function

```typescript
function buildNewSection(
  input: ValidatedInput,
  requirements: MappedRequirement[]
): DisclaimerSection | null {
  // Filter relevant requirements
  const reqs = requirements.filter(r =>
    r.topic === TopicCategory.SOME_TOPIC && r.subtopic.includes('keyword')
  );

  if (reqs.length === 0) return null;  // Skip if no requirements match

  const paragraphs: SectionParagraph[] = [
    p('Introductory text for this section.'),
    ...reqs.map(r => p(r.disclaimerLanguage)),
  ];

  return {
    id: 'new-section',
    heading: 'New Section Title',
    order: 0,  // Set by assembleSections()
    paragraphs,
    jurisdictionCallouts: buildJurisdictionCallouts(reqs),
    citations: reqs.map(citation),
  };
}
```

### Step 3: Register the Builder

```typescript
const SECTION_BUILDERS: Record<string, SectionBuilder> = {
  // ... existing
  'new-section': buildNewSection,
};
```

The section will automatically appear in generated Markdown at the position defined in `SECTION_ORDER`.

---

## 14. Testing and Linting

### Linting

```bash
npm run lint
```

ESLint configuration (`eslint.config.js`):
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` (exhaustive deps, hook naming)
- `eslint-plugin-react-refresh` (HMR-compatible exports)

### Type Checking

```bash
npx tsc -b         # Separate from build — runs type check only
```

### No Test Runner Currently Configured

The web app does not have tests. The CLI agent project (`privacy-disclaimer-agent`) uses Vitest. To add tests:

1. Install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Add config to `vite.config.ts`:
   ```typescript
   test: {
     environment: 'jsdom',
     globals: true,
   }
   ```
3. Add script: `"test": "vitest"` to `package.json`
4. Create test files alongside components: `Component.test.tsx`

### Manual Testing Checklist

| Scenario | Verify |
|---|---|
| Single jurisdiction | Output contains only that jurisdiction's requirements |
| All 7 jurisdictions | Output contains jurisdiction callouts (not inline) for rights section |
| Third-party sharing disabled | "Data Sharing" section shows "We do not share" language |
| Cross-border disabled | "Cross-Border" section absent from output |
| Children's data enabled | "Children's Privacy" section appears |
| Cookies enabled | "Cookies" section appears |
| ADM enabled | "Automated Decisions" section appears |
| GDPR + no EU rep | EU Representative section absent in Step 2 |
| GDPR + EU rep filled | EU Representative contact in output |
| Standalone entity role | Memo includes decision path and regulatory implications |
| Standalone processor discovery | Disclosure includes provider registry table |
| Export download | File downloads with correct filename |
| Export copy | Clipboard contains full Markdown |

---

## 15. Deployment

### Automatic

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`):

1. Builds main site (`npm run build` at repo root)
2. Builds privacy-tools (`npm run build` in `privacy-tools/`)
3. Copies `privacy-tools/dist/` into main `dist/privacy-tools/`
4. Deploys merged `dist/` to GitHub Pages

### Manual Verification

After push, verify:

```bash
# Check workflow status
gh run list --repo victorycross/BrightPath-Technologies --limit 3

# Verify deployed assets
curl -sI https://brightpathtechnology.io/privacy-tools/
# Should return 200 with content-type: text/html

curl -sI https://brightpathtechnology.io/privacy-tools/assets/index-*.js
# Should return 200 with content-type: application/javascript
```

### Critical Configuration

| Setting | Value | Impact if Wrong |
|---|---|---|
| `vite.config.ts` → `base` | `'/privacy-tools/'` | All asset URLs break (404s for JS/CSS) |
| `CNAME` | `brightpathtechnology.io` | Custom domain stops working |
| Workflow → `node-version` | `'22'` | Build fails (Vite 7 requires Node 22+) |
| Workflow → `--legacy-peer-deps` | On main site only | Main site npm ci fails (Radix deps) |

---

## 16. Code Conventions

### File Naming

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase `.tsx` | `StepIndicator.tsx` |
| Utilities | kebab-case `.ts` | `minimal-input-builder.ts` |
| Data files | kebab-case `.ts` | `processor-categories.ts` |
| Types | kebab-case `.ts` | `views.ts` |

### Imports

- Named exports preferred over default exports (except `App.tsx`)
- Use `@/` alias for `src/` imports
- Use `@core/` alias for `core/` imports
- Import types with `type` keyword: `import type { Jurisdiction } from '@core/data/enums.js'`

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { useDisclaimer } from '@/state/disclaimer-context.tsx';

// 2. Types/interfaces (at top of file)
interface ComponentProps {
  onClose: () => void;
}

// 3. Component (named export)
export function Component({ onClose }: ComponentProps) {
  // 3a. Hooks
  const { state, dispatch } = useDisclaimer();
  const [local, setLocal] = useState(false);

  // 3b. Derived state
  const isValid = state.jurisdictions.length > 0;

  // 3c. Handlers
  function handleClick() { ... }

  // 3d. Render
  return ( ... );
}

// 4. Sub-components (private to file)
function HelperComponent({ ... }) { ... }
```

### State Updates

- Always use immutable patterns (spread, filter, map)
- Never mutate state objects directly
- Use `as Partial<T>` for complex nested updates where TypeScript needs help
- Nullish coalescing (`??`) for defaults on optional fields

### Error Handling

- Zod `safeParse()` for validation (never `parse()` — no thrown exceptions)
- `try/catch` for clipboard API (async, can be rejected)
- Explicit `null` returns from section builders (not undefined)
- No error boundaries currently — unhandled errors show React's default error screen

---

*For operational support procedures, see the [L1 Support Guide](./L1-SUPPORT-GUIDE.md) and [L2/L3 Support Guide](./L2-L3-SUPPORT-GUIDE.md).*
