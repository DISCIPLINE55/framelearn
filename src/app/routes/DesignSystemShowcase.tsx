import React, { useState, useEffect } from 'react';
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
import { NotificationDemo } from '../../features/notifications/NotificationDemo';
import { DocumentationHub } from '../../features/docs/DocumentationHub';
import { useToast } from '../providers/ToastContext';
import { PROJECT_METADATA } from '../../constants/project';
import { BRAND_COLORS } from '../../constants/theme';
import { Layers, Mail, User, Sparkles, CheckCircle2, ShieldAlert, Bell, BookOpen } from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'notifications' | 'states' | 'media' | 'docs'>('tokens');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'docs' || hash === 'architecture-docs') {
      setActiveTab('docs');
    } else if (hash === 'notifications') {
      setActiveTab('notifications');
    } else if (hash === 'components' || hash === 'ui-components') {
      setActiveTab('components');
    } else if (hash === 'states' || hash === 'app-states') {
      setActiveTab('states');
    } else if (hash === 'media' || hash === 'image-foundation') {
      setActiveTab('media');
    }
  }, []);

  return (
    <Container size="lg" className="flex flex-col gap-12 sm:gap-16">
      {/* Hero / Milestone Announcement Banner */}
      <section className="bg-navy text-white rounded-frame p-8 sm:p-12 shadow-elevated relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-sage/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sage" size="md" icon={<Sparkles className="w-4 h-4 stroke-[2.5]" />}>
              {PROJECT_METADATA.milestone}
            </Badge>
            <Badge variant="cream" size="md">
              BSc IT Education Project
            </Badge>
          </div>

          <h1 className="text-display font-display font-bold leading-tight tracking-tight text-white">
            FRAMELEARN
          </h1>
          <p className="text-body-lg text-white font-medium leading-relaxed">
            {PROJECT_METADATA.title}. Technical foundation, reusable notification standard, central documentation hub, and interactive portfolio.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)} leftIcon={<Layers className="w-4 h-4 stroke-[2.5]" />}>
              Trigger Modal Demo
            </Button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className="btn-outline-hero h-11 px-5 rounded-frame font-bold text-body inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              View Documentation Hub
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className="btn-outline-hero h-11 px-5 rounded-frame font-bold text-body inline-flex items-center gap-2"
            >
              <Bell className="w-4 h-4 stroke-[2.5]" />
              Notification Standard
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs for Showcase Sections */}
      <nav aria-label="Design system showcase tabs" className="flex flex-wrap items-center gap-2 border-b-2 border-sage-400 pb-4">
        {[
          { id: 'tokens', label: '1. Brand Identity & Colors' },
          { id: 'components', label: '2. UI Component Foundation' },
          { id: 'notifications', label: '3. Notification Standard' },
          { id: 'states', label: '4. Application States' },
          { id: 'media', label: '5. Image Foundation' },
          { id: 'docs', label: '6. Central Documentation Hub' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-frame font-bold text-small transition-all ${
              activeTab === tab.id
                ? 'btn-primary'
                : 'bg-white text-navy-950 hover:bg-sage-100 border-2 border-sage-300'
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
                <div className="h-24 w-full rounded-frame bg-navy flex items-center justify-center text-white font-bold text-h3 shadow-subtle mb-3">
                  {BRAND_COLORS.NAVY}
                </div>
                <CardTitle>Primary Navy</CardTitle>
                <Badge variant="navy" className="w-fit">#10212B</Badge>
              </CardHeader>
              <CardContent className="text-small text-navy-950 font-medium">
                Used for header/navigation, footers, primary headings, key buttons, and strong high-contrast structural framing.
              </CardContent>
            </Card>

            {/* Sage Token */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="h-24 w-full rounded-frame bg-sage flex items-center justify-center text-navy-950 font-bold text-h3 shadow-subtle mb-3">
                  {BRAND_COLORS.SAGE}
                </div>
                <CardTitle>Sage Green</CardTitle>
                <Badge variant="sage" className="w-fit">#8FA464</Badge>
              </CardHeader>
              <CardContent className="text-small text-navy-950 font-medium">
                Used for brand accents, secondary actions, selected states, badges, and visual highlights.
              </CardContent>
            </Card>

            {/* Cream Token */}
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <div className="h-24 w-full rounded-frame bg-cream flex items-center justify-center text-navy font-bold text-h3 shadow-subtle border-2 border-navy-800 mb-3">
                  {BRAND_COLORS.CREAM}
                </div>
                <CardTitle>Light Cream</CardTitle>
                <Badge variant="cream" className="w-fit">#EFFBDD</Badge>
              </CardHeader>
              <CardContent className="text-small text-navy-950 font-medium">
                Used as the default canvas surface, breathable negative space, and soft container surfacing.
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 2: UI PRIMITIVES FOUNDATION */}
      {activeTab === 'components' && (
        <section id="ui-components" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Reusable Primitives"
            title="14 Core UI Primitives"
            subtitle="Accessible, typed React primitives built strictly with project tokens and CSS custom properties."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons & Interactive Actions</CardTitle>
                <CardSubtitle>High-contrast button variants with icon and loading states</CardSubtitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Navy</Button>
                <Button variant="secondary">Secondary Sage</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" isLoading>Loading State</Button>
              </CardContent>
            </Card>

            {/* Badges Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & Status Tags</CardTitle>
                <CardSubtitle>Semantic labels with WCAG-compliant contrast</CardSubtitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2.5 items-center">
                <Badge variant="navy">Navy Badge</Badge>
                <Badge variant="sage">Sage Badge</Badge>
                <Badge variant="cream">Cream Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
                <Badge variant="navy" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                  With Icon
                </Badge>
              </CardContent>
            </Card>

            {/* Form Inputs */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Form Elements & Data Entry</CardTitle>
                <CardSubtitle>Accessible controls with labels, focus indicators, and helper texts</CardSubtitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Client Name"
                  placeholder="e.g. Ama Mensah"
                  leftIcon={<User className="w-4 h-4 text-navy stroke-[2.5]" />}
                  helperText="Standard text input with left icon."
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="client@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-navy stroke-[2.5]" />}
                  helperText="Email input control."
                />
                <Select
                  label="Photography Discipline"
                  options={[
                    { value: 'portraits', label: 'Portraits' },
                    { value: 'weddings', label: 'Weddings & Events' },
                    { value: 'graduation', label: 'Graduation' },
                    { value: 'commercial', label: 'Product & Commercial' },
                  ]}
                  helperText="Select component with custom dropdown styling."
                />
                <div className="md:col-span-3">
                  <Textarea
                    label="Inquiry / Message Note"
                    placeholder="Provide brief session details..."
                    helperText="Textarea control with auto-resize capability."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 3: NOTIFICATION STANDARD DEMO */}
      {activeTab === 'notifications' && (
        <section id="notifications" className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Zero-Alert Standard"
            title="Shared Notification System & Confirmation Dialog"
            subtitle="Demonstration of multi-type accessible toasts, async operation loading, and pre-action confirmation dialogs."
          />
          <NotificationDemo />
        </section>
      )}

      {/* SECTION 4: APPLICATION STATES */}
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

            {/* Error State — NO browser alert! Uses toast.info */}
            <div className="flex flex-col gap-2">
              <span className="text-small font-bold text-navy">3. Error State</span>
              <ErrorState
                title="Database Connection Offline"
                message="Sample friendly error state demonstration."
                onRetry={() => toast.info('Sample retry action triggered — verifying network connectivity.')}
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: IMAGE HANDLING */}
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

      {/* SECTION 6: CENTRAL DOCUMENTATION HUB & GOVERNANCE */}
      {(activeTab === 'docs' || activeTab === 'tokens') && (
        <section id="architecture-docs" className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Academic Governance & Architecture"
            title="Central Documentation Hub & Milestone Review Gate"
            subtitle="Authoritative specifications synchronized directly from repository records, with Markdown export and milestone gate checklists."
          />

          {/* Central Documentation Reader & Exporter */}
          <DocumentationHub />

          {/* Milestone 001 Completion Checklist & Review Gate */}
          <Card className="p-8 bg-white border-2 border-sage-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-h3 font-display font-bold text-navy flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-navy stroke-[2.5]" />
                  Milestone Governance Checklist
                </h3>
                <ul className="space-y-2.5 text-small font-semibold text-navy-950">
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage border border-navy-800" />
                    Strict TypeScript & Tailwind CSS brand tokens established.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage border border-navy-800" />
                    14 reusable UI primitives built & tested with Vitest.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage border border-navy-800" />
                    Zero browser-native alerts rule enforced across all code.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage border border-navy-800" />
                    Shared Toast notification system and ConfirmDialog deployed.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage border border-navy-800" />
                    Interactive Portfolio with category filtering & Lightbox viewer implemented.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage border border-navy-800" />
                    Central Documentation Hub integrated with 14 markdown specs and bundle export.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 bg-cream p-6 rounded-frame border-2 border-navy-800 shadow-subtle">
                <h3 className="text-h3 font-display font-bold text-navy flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-navy stroke-[2.5]" />
                  Supervisor Review Gate Notice
                </h3>
                <p className="text-small text-navy-950 font-semibold leading-relaxed">
                  Academic review gate in effect. All foundations, notifications, documentation records, and portfolio features are submitted for supervisor sign-off before commencement of Milestone 002.
                </p>
                <div className="pt-2">
                  <Badge variant="navy" size="md">
                    Status: Submitted for Supervisor Review
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
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false);
                toast.success('Modal confirmed action successfully.');
              }}
            >
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-body font-semibold text-navy-950">
            This Modal component features focus trapping, escape key closure, and backdrop dimming. It is fully integrated with FrameLearn design tokens.
          </p>
          <div className="p-4 bg-cream rounded-frame border-2 border-navy-800">
            <span className="text-caption font-bold text-navy">Design Token Check</span>
            <p className="text-small font-bold text-navy-950 mt-1">
              Primary Navy `#10212B`, Sage Green `#8FA464`, Light Cream `#EFFBDD`.
            </p>
          </div>
        </div>
      </Modal>
    </Container>
  );
};
