import React, { useState } from 'react';
import { useToast } from '../../app/providers/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2, Trash2, ShieldCheck } from 'lucide-react';

export const NotificationDemo: React.FC = () => {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSimulatingConfirm, setIsSimulatingConfirm] = useState(false);

  const triggerSuccess = () => {
    toast.success('Preferences updated successfully. (Sample demonstration feedback)');
  };

  const triggerError = () => {
    toast.error('Network request failed. Please check your connection and retry.');
  };

  const triggerWarning = () => {
    toast.warning('Unsaved changes detected. Remember to commit your review notes.');
  };

  const triggerInfo = () => {
    toast.info('Viewing Milestone 001 Foundation documentation repository.');
  };

  const triggerAsyncLoading = () => {
    const loadingId = toast.loading('Simulating photo upload to proofing gallery...');
    setTimeout(() => {
      toast.dismiss(loadingId);
      toast.success('Photo successfully processed. (Simulated operation completed)');
    }, 2200);
  };

  const triggerAsyncFailure = () => {
    const loadingId = toast.loading('Connecting to remote storage endpoint...');
    setTimeout(() => {
      toast.dismiss(loadingId);
      toast.error('Connection timed out after 3000ms. Storage is currently unavailable.');
    }, 2200);
  };

  const handleConfirmAction = () => {
    setIsSimulatingConfirm(true);
    setTimeout(() => {
      setIsSimulatingConfirm(false);
      setIsConfirmOpen(false);
      toast.success('Sample session deleted. Operational feedback demonstrated honestly.');
    }, 1000);
  };

  const handleCancelAction = () => {
    setIsConfirmOpen(false);
    toast.info('Action cancelled. Relevant user data preserved without alteration.');
  };

  return (
    <div className="flex flex-col gap-8 w-full" aria-label="Notification System Demonstration">
      {/* Overview Card */}
      <Card className="p-6 bg-white border-2 border-sage-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="sage" size="sm" icon={<ShieldCheck className="w-4 h-4 stroke-[2.5]" />}>
                Zero-Alert Enforced
              </Badge>
              <Badge variant="navy" size="sm">
                WCAG AA Compliant
              </Badge>
            </div>
            <h3 className="text-h3 font-display font-bold text-navy">
              Standardized Toast & Confirmation System
            </h3>
            <p className="text-small text-navy-800 font-medium">
              Accessible, branded notifications replacing all browser-native dialogs (`window.alert`, `window.confirm`, `window.prompt`).
            </p>
          </div>

          <div className="p-3 bg-cream rounded-frame border border-navy-800 max-w-sm text-[12px] font-semibold text-navy-950">
            * Demonstration Notice: Controls below illustrate UI states and accessible announcements; no persistent database records are modified.
          </div>
        </div>
      </Card>

      {/* Grid of Interactive Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Success Toast */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sage-600 stroke-[2.5]" />
              <CardTitle>Success Notification</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-small text-navy-950 font-medium">
              Announced via <code>aria-live="polite"</code>. Uses Sage Green accent (`#8FA464`). Only triggered after verified operational completion.
            </p>
            <Button variant="secondary" size="sm" onClick={triggerSuccess}>
              Trigger Success Toast
            </Button>
          </CardContent>
        </Card>

        {/* 2. Error Toast */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 stroke-[2.5]" />
              <CardTitle>Error Notification</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-small text-navy-950 font-medium">
              Announced assertively via <code>aria-live="assertive" role="alert"</code>. High-visibility red border with readable resolution suggestions.
            </p>
            <Button variant="danger" size="sm" onClick={triggerError}>
              Trigger Error Toast
            </Button>
          </CardContent>
        </Card>

        {/* 3. Warning & Info Toasts */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[2.5]" />
              <CardTitle>Warning & Info States</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-small text-navy-950 font-medium">
              Non-blocking advisory notifications for unsaved inputs or contextual tips.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={triggerWarning} className="flex-1">
                Warning
              </Button>
              <Button variant="outline" size="sm" onClick={triggerInfo} className="flex-1">
                Information
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 4. Loading / Async Feedback */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-sage animate-spin stroke-[2.5]" />
              <CardTitle>Async In-Progress Feedback</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-small text-navy-950 font-medium">
              Displays persistent spinner during long-running tasks, dismissing upon resolved success or error.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={triggerAsyncLoading} className="flex-1">
                Async Success
              </Button>
              <Button variant="outline" size="sm" onClick={triggerAsyncFailure} className="flex-1">
                Async Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 5. Destructive Confirmation Dialog */}
        <Card className="flex flex-col justify-between md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-navy stroke-[2.5]" />
              <CardTitle>Pre-Action Confirmation Dialog (ConfirmDialog)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-small text-navy-950 font-medium">
              Toasts report outcomes; consequential or destructive actions require explicit, accessible modal confirmation before proceeding.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4 text-red-600" />}
              className="w-fit"
            >
              Trigger Consequential Action Flow
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog Component */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Sample Client Session?"
        message="This is a demonstration confirmation dialog. Confirming simulates an asynchronous deletion and produces an honest success toast; cancelling preserves input without altering state."
        variant="danger"
        confirmLabel="Simulate Deletion"
        cancelLabel="Keep Session"
        isLoading={isSimulatingConfirm}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};
