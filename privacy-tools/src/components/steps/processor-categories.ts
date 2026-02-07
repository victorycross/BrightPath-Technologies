import { DataCategory } from '@core/data/enums.js';

export interface ProcessorCategoryDef {
  id: string;
  label: string;
  category: string;
  purpose: string;
  examples: string;
  suggestedDataCategories: DataCategory[];
}

export const PROCESSOR_CATEGORIES: ProcessorCategoryDef[] = [
  {
    id: 'cloud_hosting',
    label: 'Cloud infrastructure / hosting',
    category: 'Cloud service providers',
    purpose: 'Infrastructure hosting, data storage, and computing services',
    examples: 'AWS, Azure, GCP',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.DEVICE_TECHNICAL,
    ],
  },
  {
    id: 'email_comms',
    label: 'Email / communication services',
    category: 'Email and communication service providers',
    purpose: 'Transactional and marketing email delivery, SMS, and push notifications',
    examples: 'SendGrid, Mailchimp, Twilio',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
    ],
  },
  {
    id: 'payment',
    label: 'Payment processing',
    category: 'Payment processors',
    purpose: 'Processing financial transactions, payment card handling, and billing',
    examples: 'Stripe, PayPal, Square',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.FINANCIAL,
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics and tracking',
    category: 'Analytics and tracking providers',
    purpose: 'Website and application analytics, usage measurement, and performance monitoring',
    examples: 'Google Analytics, Mixpanel, Hotjar',
    suggestedDataCategories: [
      DataCategory.BEHAVIORAL,
      DataCategory.DEVICE_TECHNICAL,
      DataCategory.GEOLOCATION,
    ],
  },
  {
    id: 'crm',
    label: 'Customer relationship management',
    category: 'CRM platform providers',
    purpose: 'Managing customer relationships, sales pipelines, and marketing automation',
    examples: 'Salesforce, HubSpot',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.BEHAVIORAL,
    ],
  },
  {
    id: 'advertising',
    label: 'Advertising / marketing platforms',
    category: 'Advertising and marketing platforms',
    purpose: 'Targeted advertising, campaign management, and audience measurement',
    examples: 'Google Ads, Meta/Facebook, LinkedIn',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.BEHAVIORAL,
      DataCategory.DEVICE_TECHNICAL,
    ],
  },
  {
    id: 'hr_payroll',
    label: 'Human resources / payroll',
    category: 'HR and payroll service providers',
    purpose: 'Employee payroll processing, benefits administration, and HR management',
    examples: 'ADP, Workday, BambooHR',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.FINANCIAL,
      DataCategory.EMPLOYMENT,
    ],
  },
  {
    id: 'security',
    label: 'IT security / monitoring',
    category: 'IT security and monitoring providers',
    purpose: 'Identity management, threat detection, security monitoring, and incident response',
    examples: 'Okta, CrowdStrike, Datadog',
    suggestedDataCategories: [
      DataCategory.DEVICE_TECHNICAL,
      DataCategory.PERSONAL_IDENTIFIERS,
    ],
  },
  {
    id: 'legal',
    label: 'Legal / compliance services',
    category: 'Legal and compliance service providers',
    purpose: 'Legal advice, regulatory compliance, audit, and dispute resolution',
    examples: 'External counsel, audit firms',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
    ],
  },
  {
    id: 'support',
    label: 'Customer support platforms',
    category: 'Customer support platform providers',
    purpose: 'Help desk, ticketing, live chat, and customer communication management',
    examples: 'Zendesk, Intercom, Freshdesk',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.USER_GENERATED,
    ],
  },
  {
    id: 'ai_ml_providers',
    label: 'AI / ML service providers',
    category: 'Artificial intelligence and machine learning service providers',
    purpose: 'Large language model APIs, machine learning inference, AI-powered analysis, and model training or fine-tuning services',
    examples: 'OpenAI, Anthropic, Google AI (Gemini), Cohere, Hugging Face, AWS Bedrock',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.BEHAVIORAL,
      DataCategory.USER_GENERATED,
      DataCategory.SENSITIVE_PERSONAL,
    ],
  },
  {
    id: 'ai_embedded_saas',
    label: 'AI-embedded SaaS tools',
    category: 'SaaS products with embedded AI/ML features',
    purpose: 'Software-as-a-service products that incorporate AI capabilities including copilots, transcription, summarization, content generation, and intelligent automation',
    examples: 'Microsoft Copilot, Otter.ai, Grammarly, Notion AI, Adobe Firefly, Zoom AI Companion',
    suggestedDataCategories: [
      DataCategory.PERSONAL_IDENTIFIERS,
      DataCategory.USER_GENERATED,
      DataCategory.EMPLOYMENT,
    ],
  },
];
