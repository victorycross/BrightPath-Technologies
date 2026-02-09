import { FileText, Building2, Users, Cookie, ExternalLink, Shield, ArrowRight, Scale, Globe } from 'lucide-react';
import type { ActiveView } from '@/types/views.ts';

interface HomePageProps {
  onNavigate: (view: ActiveView) => void;
}

const FEATURES = [
  {
    id: 'wizard' as const,
    icon: FileText,
    title: 'Privacy Policy Wizard',
    description:
      'Full 6-step guided wizard to generate a regulatory-precise privacy policy. Select jurisdictions, define your data practices, and export a publication-ready document.',
    cta: 'Start Wizard',
  },
  {
    id: 'entity-role' as const,
    icon: Building2,
    title: 'Entity Role Determination',
    description:
      'Determine whether your organization acts as a Data Controller, Data Processor, or Joint Controller. Export a determination memo with jurisdiction-specific regulatory obligations.',
    cta: 'Determine Role',
  },
  {
    id: 'processor-discovery' as const,
    icon: Users,
    title: 'Third-Party Processor Discovery',
    description:
      'Identify third-party service providers your organization shares personal data with. Generate a standalone processor disclosure with regulatory references.',
    cta: 'Discover Processors',
  },
  {
    id: 'cookie-disclaimer' as const,
    icon: Cookie,
    title: 'Cookie Disclaimer Generator',
    description:
      'Generate a jurisdiction-specific cookie policy for your website. Define cookie categories, consent mechanisms, and export a publication-ready cookie disclaimer.',
    cta: 'Generate Cookie Policy',
  },
];

interface RegulatoryLink {
  label: string;
  description: string;
  url: string;
  region: 'canada' | 'international';
}

const REGULATORY_LINKS: RegulatoryLink[] = [
  {
    label: 'Office of the Privacy Commissioner',
    description: 'OPC — Federal privacy oversight',
    url: 'https://www.priv.gc.ca',
    region: 'canada',
  },
  {
    label: 'PIPEDA',
    description: 'Full text of the Act',
    url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/',
    region: 'canada',
  },
  {
    label: 'Quebec CAI',
    description: "Commission d'acc\u00e8s \u00e0 l'information (Law 25)",
    url: 'https://www.cai.gouv.qc.ca',
    region: 'canada',
  },
  {
    label: 'Alberta OIPC',
    description: 'Office of the Information and Privacy Commissioner',
    url: 'https://www.oipc.ab.ca',
    region: 'canada',
  },
  {
    label: 'BC OIPC',
    description: 'Office of the Information and Privacy Commissioner',
    url: 'https://www.oipc.bc.ca',
    region: 'canada',
  },
  {
    label: 'OSFI B-13',
    description: 'Technology and Cyber Risk Management',
    url: 'https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/technology-cyber-risk-management',
    region: 'canada',
  },
  {
    label: 'GDPR',
    description: 'General Data Protection Regulation',
    url: 'https://gdpr-info.eu',
    region: 'international',
  },
  {
    label: 'CCPA / CPRA',
    description: 'California Attorney General',
    url: 'https://oag.ca.gov/privacy/ccpa',
    region: 'international',
  },
  {
    label: 'NIST AI RMF',
    description: 'AI Risk Management Framework',
    url: 'https://www.nist.gov/artificial-intelligence/risk-management-framework',
    region: 'international',
  },
  {
    label: 'NIST Privacy Framework',
    description: 'Privacy risk management',
    url: 'https://www.nist.gov/privacy-framework',
    region: 'international',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const canadianLinks = REGULATORY_LINKS.filter((l) => l.region === 'canada');
  const internationalLinks = REGULATORY_LINKS.filter((l) => l.region === 'international');

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-4">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Privacy Policy Generator
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          Generate regulatory-precise privacy disclaimers, determine your entity role under
          privacy law, and identify third-party data processors — all with jurisdiction-specific
          statutory references.
        </p>
      </div>

      {/* Feature Tiles */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => onNavigate(feature.id)}
                className="group flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-all hover:border-primary hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {feature.cta}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regulatory Resources */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Regulatory Resources
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-muted-foreground">Canadian Privacy Law</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {canadianLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
              >
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <span className="block text-xs font-medium">{link.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {link.description}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-muted-foreground">International & Frameworks</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {internationalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
              >
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <span className="block text-xs font-medium">{link.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {link.description}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
