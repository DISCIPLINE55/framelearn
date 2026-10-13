// Single Source of Truth — Documentation Data Loader
// Dynamically loads the authoritative markdown files in docs/ using Vite's ?raw import

import readmeDoc from '../../../docs/README.md?raw';
import projectOverviewDoc from '../../../docs/PROJECT_OVERVIEW.md?raw';
import requirementsDoc from '../../../docs/REQUIREMENTS.md?raw';
import developmentRoadmapDoc from '../../../docs/DEVELOPMENT_ROADMAP.md?raw';
import implementationLogDoc from '../../../docs/IMPLEMENTATION_LOG.md?raw';
import architectureDoc from '../../../docs/ARCHITECTURE.md?raw';
import designSystemDoc from '../../../docs/DESIGN_SYSTEM.md?raw';
import notificationStandardDoc from '../../../docs/NOTIFICATION_STANDARD.md?raw';
import databaseDesignDoc from '../../../docs/DATABASE_DESIGN.md?raw';
import securityPrivacyDoc from '../../../docs/SECURITY_AND_PRIVACY.md?raw';
import testingQADoc from '../../../docs/TESTING_AND_QA.md?raw';
import costBudgetDoc from '../../../docs/COST_AND_BUDGET.md?raw';
import decisionLogDoc from '../../../docs/DECISION_LOG.md?raw';
import lecturerReviewLogDoc from '../../../docs/LECTURER_REVIEW_LOG.md?raw';

export interface DocItem {
  id: string;
  title: string;
  category: 'Overview & Scope' | 'Architecture & Design' | 'Testing & Security' | 'Governance & Management';
  filename: string;
  summary: string;
  content: string;
}

export const DOCUMENTATION_REGISTRY: DocItem[] = [
  {
    id: 'readme',
    title: 'Documentation Index',
    category: 'Overview & Scope',
    filename: 'docs/README.md',
    summary: 'Central repository documentation index and verified project coordinates.',
    content: readmeDoc,
  },
  {
    id: 'project-overview',
    title: '1. Project Overview',
    category: 'Overview & Scope',
    filename: 'docs/PROJECT_OVERVIEW.md',
    summary: 'Executive problem statement, target user personas, and milestone boundaries.',
    content: projectOverviewDoc,
  },
  {
    id: 'requirements',
    title: '2. Requirements Specification',
    category: 'Overview & Scope',
    filename: 'docs/REQUIREMENTS.md',
    summary: 'Functional and non-functional requirements including zero-alert rule and portfolio.',
    content: requirementsDoc,
  },
  {
    id: 'development-roadmap',
    title: '3. Development Roadmap',
    category: 'Governance & Management',
    filename: 'docs/DEVELOPMENT_ROADMAP.md',
    summary: 'Gated 8-milestone roadmap, phase dependencies, and acceptance criteria.',
    content: developmentRoadmapDoc,
  },
  {
    id: 'implementation-log',
    title: '4. Implementation Log',
    category: 'Governance & Management',
    filename: 'docs/IMPLEMENTATION_LOG.md',
    summary: 'Granular audit trail with requirements mapped, files changed, and actual test results.',
    content: implementationLogDoc,
  },
  {
    id: 'architecture',
    title: '5. Technical Architecture',
    category: 'Architecture & Design',
    filename: 'docs/ARCHITECTURE.md',
    summary: 'Feature-oriented layered architecture, directory structure, and component design.',
    content: architectureDoc,
  },
  {
    id: 'design-system',
    title: '6. Design System Specification',
    category: 'Architecture & Design',
    filename: 'docs/DESIGN_SYSTEM.md',
    summary: 'Approved brand tokens, WCAG AA contrast analysis, typography, and UI primitives.',
    content: designSystemDoc,
  },
  {
    id: 'notification-standard',
    title: '7. Notification Standard',
    category: 'Architecture & Design',
    filename: 'docs/NOTIFICATION_STANDARD.md',
    summary: 'Zero browser alert standard, Toast API, ConfirmDialog, and honest feedback rules.',
    content: notificationStandardDoc,
  },
  {
    id: 'database-design',
    title: '8. Database Design Policy',
    category: 'Architecture & Design',
    filename: 'docs/DATABASE_DESIGN.md',
    summary: 'Milestone data boundaries and planned relational entities (profiles, bookings, galleries).',
    content: databaseDesignDoc,
  },
  {
    id: 'security-privacy',
    title: '9. Security and Privacy',
    category: 'Testing & Security',
    filename: 'docs/SECURITY_AND_PRIVACY.md',
    summary: 'Row Level Security (RLS), RBAC permissions, PII confidentiality, and sanitization.',
    content: securityPrivacyDoc,
  },
  {
    id: 'testing-qa',
    title: '10. Testing and QA Plan',
    category: 'Testing & Security',
    filename: 'docs/TESTING_AND_QA.md',
    summary: 'Vitest unit suites, CI checks, and responsive viewports (360px, 390px, 768px, 1280px).',
    content: testingQADoc,
  },
  {
    id: 'cost-budget',
    title: '11. Development Costs & Budget',
    category: 'Governance & Management',
    filename: 'docs/COST_AND_BUDGET.md',
    summary: 'Confirmed $0 expenditures, verified free-tier quotas, effort hours, and commercial costs.',
    content: costBudgetDoc,
  },
  {
    id: 'decision-log',
    title: '12. Technical Decision Log (ADR)',
    category: 'Governance & Management',
    filename: 'docs/DECISION_LOG.md',
    summary: 'Architectural Decision Records covering Vite, Tailwind, zero-alert, and custom lightbox.',
    content: decisionLogDoc,
  },
  {
    id: 'lecturer-review-log',
    title: '13. Lecturer Review History',
    category: 'Governance & Management',
    filename: 'docs/LECTURER_REVIEW_LOG.md',
    summary: 'Academic gate submissions, audit checkpoints, and supervisor review records.',
    content: lecturerReviewLogDoc,
  },
];

/**
 * Downloads a single markdown document as a .md file
 */
export const downloadMarkdownFile = (doc: DocItem): void => {
  const filename = doc.filename.split('/').pop() || `${doc.id}.md`;
  const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Exports the complete documentation suite as a single consolidated bundle
 */
export const downloadDocumentationBundle = (): void => {
  const header = `# FRAMELEARN — COMPLETE ARCHITECTURE & DOCUMENTATION BUNDLE
Generated: ${new Date().toISOString()}
Academic Project: BSc IT Education Capstone
Repository: https://github.com/DISCIPLINE55/framelearn
Live URL: https://framelearn.vercel.app/

================================================================================
TABLE OF CONTENTS
================================================================================
${DOCUMENTATION_REGISTRY.map((d, i) => `${i + 1}. ${d.title} (${d.filename})`).join('\n')}

================================================================================
`;

  const sections = DOCUMENTATION_REGISTRY.map((doc) => {
    return `\n\n${'='.repeat(80)}\n# DOCUMENT: ${doc.title} (${doc.filename})\n${'='.repeat(80)}\n\n${doc.content}`;
  }).join('\n\n');

  const fullBundle = header + sections;
  const blob = new Blob([fullBundle], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'FRAMELEARN_COMPLETE_DOCUMENTATION_BUNDLE.md';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
