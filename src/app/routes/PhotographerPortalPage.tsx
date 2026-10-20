import React, { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useToast } from '../providers/ToastContext';
import {
  ShieldCheck,
  Database,
  Calendar,
  Lock,
  LogOut,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const CANONICAL_SERVICES = [
  { id: '1', name: 'Portrait Photography', category: 'Portraiture', slug: 'portrait-photography' },
  { id: '2', name: 'Graduation Photography', category: 'Academic', slug: 'graduation-photography' },
  { id: '3', name: 'Weddings & Event Photography', category: 'Events', slug: 'weddings-and-events' },
  { id: '4', name: 'Outdoor & Landscape Photography', category: 'Outdoor', slug: 'outdoor-photography' },
  { id: '5', name: 'Birthdays & Celebrations', category: 'Events', slug: 'birthdays-and-celebrations' },
  { id: '6', name: 'Product & Commercial Photography', category: 'Commercial', slug: 'product-photography' },
  { id: '7', name: 'Photo Editing & Retouching', category: 'Creative Services', slug: 'retouching-and-editing' },
  { id: '8', name: 'Photography Training & Workshops', category: 'Education', slug: 'photography-training' },
];

const PhotographerPortalContent: React.FC = () => {
  const { user, profile, role, isConfigured, signOut, testConnection } = useAuth();
  const { toast } = useToast();
  const [isProbing, setIsProbing] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);

  const handleProbe = async () => {
    setIsProbing(true);
    setProbeResult(null);
    try {
      const result = await testConnection();
      if (result.connected) {
        setProbeResult('Connected: Live Supabase backend is reachable.');
        toast.success('Connection to Supabase backend is live and operational.', {
          title: 'Supabase Verified',
        });
      } else {
        setProbeResult(result.message);
        if (result.configured) {
          toast.error(result.message, {
            title: 'Connection Failed',
          });
        } else {
          toast.warning(result.message, {
            title: 'Configuration Notice',
          });
        }
      }
    } finally {
      setIsProbing(false);
    }
  };

  const handleConfirmLogout = async () => {
    setIsLogoutDialogOpen(false);
    await signOut();
    window.location.hash = '#home';
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="bg-navy text-white rounded-frame p-6 sm:p-8 shadow-elevated border-2 border-navy-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sage" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Photographer Access Verified
            </Badge>
            <Badge variant="cream" size="sm">
              Role: {role || 'admin'}
            </Badge>
          </div>
          <h1 className="text-h2 font-display font-bold text-white tracking-tight">
            {profile?.full_name || 'Arafat Nabuku Jansu'}
          </h1>
          <p className="text-small text-cream/90 max-w-xl">
            FrameLearn Photography Management Portal. Authoritative administration workspace for bookings, service packages, and client delivery.
          </p>
          <div className="text-xs text-white/70 font-mono pt-1">
            Authenticated User: {user?.email || 'photographer@framelearn.com'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLogoutDialogOpen(true)}
            leftIcon={<LogOut className="w-4 h-4 text-white" />}
            className="border-cream/40 text-white hover:bg-navy-800"
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Backend & Database Foundation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Status Card */}
        <Card variant="default" className="p-6 bg-surface-light border-2 border-sage-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-navy text-sage flex items-center justify-center">
                <Activity className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="text-h3 font-display font-bold text-navy">
                Supabase Backend Status
              </h2>
            </div>
            <Badge variant={isConfigured ? 'sage' : 'cream'} size="sm">
              {isConfigured ? 'Configured' : 'Safe Local Foundation'}
            </Badge>
          </div>

          <p className="text-small text-navy-800 mb-4 leading-relaxed">
            FrameLearn enforces real backend connectivity. If live Supabase credentials are not supplied in{' '}
            <code className="font-mono text-xs bg-navy/10 px-1 py-0.5 rounded">.env</code>, simulated data is prohibited.
          </p>

          <div className="space-y-2 mb-6 text-xs font-mono bg-cream p-3 rounded border border-sage/40 text-navy">
            <div>
              <span className="font-bold">Client Initialization:</span>{' '}
              {isConfigured ? 'Active (Connected to Project URL)' : 'Safe Local Mode (Awaiting .env credentials)'}
            </div>
            <div>
              <span className="font-bold">Row Level Security:</span> Enforced on all PostgreSQL tables
            </div>
            {probeResult && (
              <div className="pt-2 border-t border-navy/10 text-navy-950 font-sans text-xs">
                <span className="font-bold">Probe Output:</span> {probeResult}
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            isLoading={isProbing}
            onClick={handleProbe}
            leftIcon={<Activity className="w-4 h-4" />}
          >
            {isProbing ? 'Probing Connection...' : 'Probe Supabase Connection'}
          </Button>
        </Card>

        {/* Database Tables Verification */}
        <Card variant="default" className="p-6 bg-surface-light border-2 border-sage-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-navy text-cream flex items-center justify-center">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="text-h3 font-display font-bold text-navy">
                Database Schema (M002)
              </h2>
            </div>
            <Badge variant="navy" size="sm">
              5 Entities
            </Badge>
          </div>

          <p className="text-small text-navy-800 mb-3">
            The database migration (<code className="font-mono text-xs">20261020000001_initial_schema.sql</code>) establishes the core business entities:
          </p>

          <ul className="space-y-2 text-xs text-navy-900 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">profiles</strong> — Photographer identity and role authorization (Admin).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">services</strong> — 8 Canonical photography disciplines.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">service_packages</strong> — One-to-many tiered packages per service.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">booking_requests</strong> — Public booking submissions with PII protection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-navy mt-0.5 flex-shrink-0" />
              <span>
                <strong className="font-mono">booking_status_history</strong> — Immutable audit trail of status transitions.
              </span>
            </li>
          </ul>

          <div className="flex items-center gap-2 text-[11px] text-navy/70 bg-cream/60 p-2.5 rounded border border-sage/30">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>RLS Policy: Public can insert inquiries; only photographer can view client PII.</span>
          </div>
        </Card>
      </div>

      {/* Services Feature Readiness (Preparation for Milestone 003) */}
      <Card variant="default" className="p-6 sm:p-8 bg-surface-light border-2 border-navy-800 shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-navy/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="sage" size="sm">
                Milestone 003 Preparation
              </Badge>
              <Badge variant="outline" size="sm">
                Schema Registered
              </Badge>
            </div>
            <h2 className="text-h2 font-display font-bold text-navy">
              Canonical Photography Services
            </h2>
            <p className="text-small text-navy-800 mt-1">
              Arafat Nabuku Jansu's 8 registered service disciplines ready for package and pricing configuration in Milestone 003.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-navy bg-cream px-3 py-1.5 rounded-frame border border-sage/40">
            <AlertTriangle className="w-4 h-4 text-navy" />
            <span>Prices will be configured in Milestone 003 without invented figures.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CANONICAL_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-frame bg-white border border-navy/10 shadow-subtle hover:border-sage transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage block mb-1">
                  {srv.category}
                </span>
                <h3 className="text-body font-bold text-navy leading-snug">
                  {srv.name}
                </h3>
                <span className="text-[11px] font-mono text-navy/60 block mt-1">
                  slug: {srv.slug}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-navy/5 flex items-center justify-between text-[11px] text-navy/70">
                <span>Packages: M003</span>
                <span className="text-navy font-bold">Ready</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Requests Engine Readiness (Milestone 004 Preview) */}
      <Card variant="default" className="p-6 bg-surface-light border-2 border-sage-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-navy text-sage flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-h3 font-display font-bold text-navy">
              Client Booking Inquiries Engine (Milestone 004 Foundation)
            </h3>
            <p className="text-small text-navy-800 leading-relaxed">
              The <code className="font-mono text-xs">booking_requests</code> table is deployed in the database schema. Public visitors will be able to submit inquiries directly from public pages without needing an account. The photographer management interface for reviewing, confirming, and declining client bookings will be completed in Milestone 004.
            </p>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog for Logout */}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Confirm Session Termination"
        message="Are you sure you want to log out of the photographer portal? You will need your photographer credentials to log back in."
        confirmLabel="Log Out"
        cancelLabel="Stay Logged In"
        variant="warning"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  );
};

export const PhotographerPortalPage: React.FC = () => {
  return (
    <Container size="lg" className="py-8 sm:py-12">
      <ProtectedRoute>
        <PhotographerPortalContent />
      </ProtectedRoute>
    </Container>
  );
};
