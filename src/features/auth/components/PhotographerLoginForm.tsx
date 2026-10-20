import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Lock, Mail, ShieldAlert, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface PhotographerLoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const PhotographerLoginForm: React.FC<PhotographerLoginFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { signInWithEmail, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isConfigured) {
      setErrorMessage(
        'Supabase backend credentials are not set in .env. Live authentication cannot proceed.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess?.();
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <Card variant="default" className={`max-w-md mx-auto p-6 sm:p-8 bg-surface-light border-2 border-navy-800 ${className}`}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-navy text-sage flex items-center justify-center mb-3 shadow-subtle">
          <Lock className="w-6 h-6 stroke-[2.2]" />
        </div>
        <Badge variant="sage" size="sm" className="mb-2">
          Photographer Access
        </Badge>
        <h2 className="text-h3 font-display font-bold text-navy">
          Photographer Portal
        </h2>
        <p className="text-small text-navy-800 mt-1 max-w-sm">
          Restricted management gateway for independent photographer Arafat Nabuku Jansu.
        </p>
      </div>

      {!isConfigured && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-frame bg-cream border border-sage/60 text-navy text-small"
        >
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Live Supabase Backend Required</span>
              <p className="text-xs text-navy-900 leading-relaxed">
                FrameLearn does not simulate fake authentication. Configure real credentials in your local{' '}
                <code className="font-mono bg-white px-1 py-0.5 rounded border border-navy/20">.env</code>:
              </p>
              <pre className="text-[11px] font-mono bg-navy text-white p-2 rounded mt-1 overflow-x-auto">
                VITE_SUPABASE_URL=https://&lt;id&gt;.supabase.co{'\n'}
                VITE_SUPABASE_ANON_KEY=&lt;anon_key&gt;
              </pre>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 rounded-frame bg-red-50 border border-red-300 text-red-900 text-small flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-xs">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="photographer-email"
            className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5"
          >
            Email Address
          </label>
          <Input
            id="photographer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="photographer@framelearn.com"
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4 text-navy/70" />}
            disabled={isSubmitting || !isConfigured}
            fullWidth
            required
          />
        </div>

        <div>
          <label
            htmlFor="photographer-password"
            className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5"
          >
            Password
          </label>
          <Input
            id="photographer-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            autoComplete="current-password"
            leftIcon={<KeyRound className="w-4 h-4 text-navy/70" />}
            disabled={isSubmitting || !isConfigured}
            fullWidth
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            isLoading={isSubmitting}
            disabled={!isConfigured || isSubmitting}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            {isConfigured ? 'Sign In as Photographer' : 'Configuration Required in .env'}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-navy-100 text-center">
        <p className="text-[11px] text-navy-800">
          Public visitors can submit booking inquiries directly on the services and contact pages without logging in.
        </p>
      </div>
    </Card>
  );
};
