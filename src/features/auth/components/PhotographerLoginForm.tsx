import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Camera,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../../../app/providers/ToastContext';

export interface PhotographerLoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * Translates raw authentication errors into clear, friendly messages
 * without exposing technical implementation details or credentials.
 */
function getFriendlyAuthErrorMessage(rawError: string): string {
  const lower = rawError.toLowerCase();
  if (lower.includes('invalid') || lower.includes('credentials') || lower.includes('grant')) {
    return 'Invalid email address or password. Please check your credentials and try again.';
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('connection')) {
    return 'Unable to reach the studio service. Please check your internet connection.';
  }
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Too many sign-in attempts. Please wait a few moments and try again.';
  }
  if (lower.includes('not configured')) {
    return 'The studio authentication service is currently unavailable. Please try again later.';
  }
  return 'An error occurred while signing in. Please check your information and try again.';
}

export const PhotographerLoginForm: React.FC<PhotographerLoginFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { signInWithEmail, resetPasswordForEmail, isConfigured } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    // Guard if backend is entirely unconfigured
    if (!isConfigured) {
      const msg = 'Studio authentication service is currently unavailable. Please try again later.';
      setErrorMessage(msg);
      toast.error(msg, { title: 'Service Unavailable' });
      return;
    }

    if (isRecoveryMode) {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }

      setIsSubmitting(true);
      const res = await resetPasswordForEmail(email);
      setIsSubmitting(false);

      if (res.success) {
        const msg = 'Password recovery link has been sent. Please check your inbox.';
        setSuccessNotice(msg);
        toast.success(msg, { title: 'Recovery Link Sent' });
      } else if (res.error) {
        const friendly = getFriendlyAuthErrorMessage(res.error);
        setErrorMessage(friendly);
        toast.error(friendly, { title: 'Recovery Request Failed' });
      }
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Signed in successfully. Welcome to your studio dashboard.', {
        title: 'Welcome Back',
      });
      onSuccess?.();
    } else if (result.error) {
      const friendly = getFriendlyAuthErrorMessage(result.error);
      setErrorMessage(friendly);
      // AuthContext also emits a toast on error, so form stays in sync
    }
  };

  return (
    <Card
      variant="default"
      className={`max-w-md w-full mx-auto p-6 sm:p-8 bg-surface-light border-2 border-navy-800 shadow-elevated ${className}`}
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-navy text-sage flex items-center justify-center mb-3 shadow-subtle">
          <Camera className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-caption font-bold tracking-widest uppercase text-navy-800 mb-1">
          FrameLearn Studio
        </span>
        <h1 className="text-h2 font-display font-bold text-navy">
          {isRecoveryMode ? 'Reset Password' : 'Welcome Back'}
        </h1>
        <p className="text-small text-navy-800 mt-1 max-w-sm leading-relaxed">
          {isRecoveryMode
            ? 'Enter your photographer email address to receive a secure recovery link.'
            : 'Sign in to manage your photography studio.'}
        </p>
      </div>

      {/* Friendly Error Notice */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3 rounded-frame bg-red-50 border border-red-300 text-red-900 text-small flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-xs font-medium leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Friendly Success Notice */}
      {successNotice && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 p-3 rounded-frame bg-sage-50 border border-sage-300 text-navy text-small flex items-start gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
          <span className="text-xs font-medium leading-relaxed">{successNotice}</span>
        </div>
      )}

      {/* Login / Recovery Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="photographer-email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="arafat@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          disabled={isSubmitting}
        />

        {!isRecoveryMode && (
          <div className="space-y-1">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="photographer-password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-navy hover:text-navy-950 p-1 focus:outline-none focus:ring-2 focus:ring-sage rounded"
                aria-label="Toggle visibility"
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 stroke-[2.2]" />
                ) : (
                  <Eye className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsRecoveryMode(true);
                  setErrorMessage(null);
                  setSuccessNotice(null);
                }}
                className="text-xs font-semibold text-navy hover:text-sage transition-colors underline-offset-2 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isSubmitting}
          >
            {isRecoveryMode ? 'Send Recovery Link' : 'Sign In'}
          </Button>
        </div>

        {isRecoveryMode && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRecoveryMode(false);
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-sage transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}
      </form>
    </Card>
  );
};
