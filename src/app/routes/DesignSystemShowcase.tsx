import React, { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ImageContainer } from '../../components/media/ImageContainer';
import { PROJECT_METADATA } from '../../constants/project';
import { BRAND_COLORS } from '../../constants/theme';
import { Layers, Mail, User, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'states' | 'media' | 'docs'>('tokens');

  return (
    <Container size="lg" className="flex flex-col gap-12 sm:gap-16">
      {/* Hero / Milestone Announcement Banner */}
      <section className="bg-navy text-cream rounded-frame p-8 sm:p-12 shadow-elevated relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4" />}>
              {PROJECT_METADATA.milestone}
            </Badge>
            <Badge variant="cream" size="md">
              BSc IT Education Project
            </Badge>
          </div>

          <h1 className="text-display font-display font-bold leading-tight">
            FRAMELEARN
          </h1>
          <p className="text-body-lg text-cream/85 leading-relaxed">
            {PROJECT_METADATA.title}. Technical foundation, architecture, and design system initialized cleanly according to strict specification rules.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} leftIcon={<Layers className="w-4 h-4" />}>
              Trigger Modal Component Demo
            </Button>
            <a href="#architecture-docs">
              <Button variant="outline" className="border-cream text-cream hover:bg-cream hover:text-navy">
                View Architecture Docs
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Navigation Tabs for Showcase Sections */}
      <nav className="flex flex-wrap items-center gap-2 border-b border-sage-300 pb-4">
        {[
          { id: 'tokens', label: '1. Brand Identity & Colors' },
          { id: 'components', label: '2. UI Component Foundation' },
          { id: 'states', label: '3. Application States' },
          { id: 'media', label: '4. Image Handling' },
          { id: 'docs', label: '5. Architecture & Governance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-frame font-medium text-small transition-all ${
              activeTab === tab.id
                ? 'bg-navy text-cream shadow-subtle'
                : 'bg-white text-navy hover:bg-sage-100 border border-sage-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* SECTION 1: BRAND IDENTITY & TOKENS */}
      {(activeTab === 'tokens' || activeTab === 'components') && (
        <section id="design-system" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Approved Visual Identity"
            title="Brand Colors & Proportional Roles"
            subtitle="Strict compliance with approved brand tokens: Primary Navy (#10212B), Sage Green (#8FA464), Light Cream (#EFFBDD)."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Navy Token */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="h-24 w-full rounded-frame bg-navy flex items-center justify-center text-cream font-bold text-h3 shadow-subtle mb-3">
                  {BRAND_COLORS.NAVY}
                </div>
                <CardTitle>Primary Navy</CardTitle>
                <Badge variant="navy" className="w-fit">#10212B</Badge>
              </CardHeader>
              <CardContent className="text-small text-navy-600">
                Used for header/navigation, footers, primary headings, key buttons, and strong high-contrast structural framing.
              </CardContent>
            </Card>

            {/* Sage Token */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="h-24 w-full rounded-frame bg-sage flex items-center justify-center text-navy font-bold text-h3 shadow-subtle mb-3">
                  {BRAND_COLORS.SAGE}
                </div>
                <CardTitle>Sage Green</CardTitle>
                <Badge variant="sage" className="w-fit">#8FA464</Badge>
              </CardHeader>
              <CardContent className="text-small text-navy-600">
                Used for brand accents, secondary actions, selected states, badges, and visual highlights.
              </CardContent>
            </Card>

            {/* Cream Token */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="h-24 w-full rounded-frame bg-cream border border-sage-300 flex items-center justify-center text-navy font-bold text-h3 shadow-subtle mb-3">
                  {BRAND_COLORS.CREAM}
                </div>
                <CardTitle>Light Cream</CardTitle>
                <Badge variant="cream" className="w-fit">#EFFBDD</Badge>
              </CardHeader>
              <CardContent className="text-small text-navy-600">
                Used for main light backgrounds, soft section surfaces, and visual breathing space for photography.
              </CardContent>
            </Card>
          </div>

          {/* Typography Scale */}
          <Card className="p-8 flex flex-col gap-6">
            <SectionHeading eyebrow="Typography Hierarchy" title="Font Scale & Styles" />
            <div className="space-y-4 divide-y divide-sage-200">
              <div className="pt-2">
                <span className="text-caption text-navy-500">Display Hero / Title</span>
                <p className="text-display font-display text-navy">Outfit Display Bold (3.75rem / 60px)</p>
              </div>
              <div className="pt-4">
                <span className="text-caption text-navy-500">Heading 1</span>
                <p className="text-h1 font-display text-navy">Outfit Heading 1 (2.75rem / 44px)</p>
              </div>
              <div className="pt-4">
                <span className="text-caption text-navy-500">Heading 2</span>
                <p className="text-h2 font-display text-navy">Outfit Heading 2 (2.25rem / 36px)</p>
              </div>
              <div className="pt-4">
                <span className="text-caption text-navy-500">Heading 3</span>
                <p className="text-h3 font-display text-navy">Outfit Heading 3 (1.5rem / 24px)</p>
              </div>
              <div className="pt-4">
                <span className="text-caption text-navy-500">Body Large</span>
                <p className="text-body-lg text-navy">Inter Body Large — Crisp, editorial text presentation (1.125rem / 18px)</p>
              </div>
              <div className="pt-4">
                <span className="text-caption text-navy-500">Small & Caption</span>
                <p className="text-small text-navy-700">Inter Small (0.875rem / 14px) and <span className="text-caption font-bold">Caption (0.75rem / 12px UPPERCASE)</span></p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* SECTION 2: UI COMPONENTS FOUNDATION */}
      {(activeTab === 'components' || activeTab === 'tokens') && (
        <section id="ui-components" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Reusable Primitives"
            title="UI Components Gallery"
            subtitle="Accessible, accessible-first design system components crafted specifically for FrameLearn."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Button Primitives</CardTitle>
                <CardSubtitle>Primary, Secondary, Outline, Ghost, Sizes, and Loading</CardSubtitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Navy</Button>
                  <Button variant="secondary">Secondary Sage</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large Button</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Badge Primitives</CardTitle>
                <CardSubtitle>Brand color tokens and size variants</CardSubtitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="navy">Primary Navy</Badge>
                  <Badge variant="sage">Sage Green</Badge>
                  <Badge variant="cream">Light Cream</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge size="sm">Small Tag</Badge>
                  <Badge size="md">Medium Tag</Badge>
                  <Badge size="lg">Large Tag</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Form Inputs Showcase */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Form Controls (Input, Textarea, Select)</CardTitle>
                <CardSubtitle>Includes labels, helper text, error text, and icons</CardSubtitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="Ismail Ibrahim Mensah"
                  leftIcon={<User className="w-4 h-4 text-navy-500" />}
                  helperText="Required for upcoming booking forms in future milestones."
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="ismail@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-navy-500" />}
                  errorText="Sample validation error state demo."
                />
                <Select
                  label="Photography Session Type"
                  options={[
                    { label: 'Select session package...', value: '' },
                    { label: 'Portrait Session', value: 'portrait' },
                    { label: 'Wedding & Event Photography', value: 'wedding' },
                    { label: 'Educational Workshop Enrollment', value: 'workshop' },
                  ]}
                  helperText="Select component with custom dropdown styling."
                />
                <Textarea
                  label="Inquiry / Message Note"
                  placeholder="Provide brief details..."
                  helperText="Textarea control with auto-resize capability."
                />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 3: APPLICATION STATES */}
      {(activeTab === 'states' || activeTab === 'tokens') && (
        <section id="app-states" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Feedback Foundation"
            title="Loading, Empty & Error States"
            subtitle="Standardized visual patterns for system state feedback."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loading State */}
            <div className="flex flex-col gap-2">
              <span className="text-small font-bold text-navy">1. Loading State</span>
              <LoadingState title="Fetching Portfolio Data..." message="Demonstrating spinner loading state." />
            </div>

            {/* Empty State */}
            <div className="flex flex-col gap-2">
              <span className="text-small font-bold text-navy">2. Empty State</span>
              <EmptyState
                title="No Client Galleries Yet"
                message="Client galleries will appear here once Milestone 005 is activated."
                actionLabel="Explore Design System"
                onAction={() => setActiveTab('components')}
              />
            </div>

            {/* Error State */}
            <div className="flex flex-col gap-2">
              <span className="text-small font-bold text-navy">3. Error State</span>
              <ErrorState
                title="Database Connection Offline"
                message="Sample friendly error state demonstration."
                onRetry={() => alert('Retry action handler executed!')}
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: IMAGE HANDLING */}
      {(activeTab === 'media' || activeTab === 'tokens') && (
        <section id="image-foundation" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Photography Presentation"
            title="Image Container & Aspect Ratio System"
            subtitle="Photography-first responsive image container with skeleton fallback, error handling, lazy loading, and aspect ratio locks."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Aspect Ratio 3:2 */}
            <Card>
              <CardHeader>
                <CardTitle>Aspect Ratio 3:2 (Standard Photo)</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageContainer
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80"
                  alt="Photography camera lens demo"
                  aspectRatio="3:2"
                  caption="Camera lens illustration — 3:2 landscape aspect lock."
                  showOverlay
                  overlayText="Standard Portrait Aspect Ratio"
                />
              </CardContent>
            </Card>

            {/* Aspect Ratio 1:1 */}
            <Card>
              <CardHeader>
                <CardTitle>Aspect Ratio 1:1 (Square Grid)</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageContainer
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
                  alt="Camera equipment demo"
                  aspectRatio="1:1"
                  caption="Equipment detail view — 1:1 square grid lock."
                  showOverlay
                  overlayText="Square Lightbox Preview"
                />
              </CardContent>
            </Card>

            {/* Error Fallback Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Image Load Error State</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageContainer
                  src="https://broken-image-link-for-testing-fallback.jpg"
                  alt="Non-existent photo file"
                  aspectRatio="3:2"
                  caption="Gracefully handles broken URLs with clean fallbacks."
                />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 5: ARCHITECTURE & GOVERNANCE */}
      {(activeTab === 'docs' || activeTab === 'tokens') && (
        <section id="architecture-docs" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Academic Integrity & Quality"
            title="Architecture & Milestone Governance"
            subtitle="Summary of files, documentation hierarchy, and lecturer review gate checklist."
          />

          <Card className="p-8 bg-white border border-sage-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-h3 font-display font-bold text-navy flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-sage-600" />
                  Milestone 001 Completion Checklist
                </h3>
                <ul className="space-y-2 text-small text-navy-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage" /> Fresh project initialized cleanly without legacy code.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage" /> Strict TypeScript & Tailwind CSS brand tokens established.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage" /> Application Shell (Header, Navigation, Footer) created.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage" /> 14 reusable UI primitives built & tested with Vitest.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage" /> Documentation structure created under `docs/`.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage" /> GitHub Actions CI pipeline configured (`ci.yml`).
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 bg-cream p-6 rounded-frame border border-sage-300">
                <h3 className="text-h3 font-display font-bold text-navy flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-sage-700" />
                  Lecturer Review Gate Notice
                </h3>
                <p className="text-small text-navy-800 leading-relaxed">
                  Development is paused at Milestone 001. No business tables, login flows, booking forms, or private gallery delivery features have been prematurely implemented.
                </p>
                <div className="pt-2">
                  <Badge variant="navy" size="md">
                    Status: Awaiting Lecturer Approval for Milestone 002
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Modal Dialog Interactive Demonstration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="FrameLearn Modal Component"
        description="Demonstrating accessible modal dialog foundation with backdrop blur and escape listener."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-body text-navy-700">
            This Modal component features focus trapping, escape key closure, and backdrop dimming. It is fully integrated with FrameLearn design tokens.
          </p>
          <div className="p-4 bg-cream rounded-frame border border-sage-300">
            <span className="text-caption font-bold text-navy">Design Token Check</span>
            <p className="text-small text-navy-800 mt-1">
              Primary Navy `#10212B`, Sage Green `#8FA464`, Light Cream `#EFFBDD`.
            </p>
          </div>
        </div>
      </Modal>
    </Container>
  );
};
