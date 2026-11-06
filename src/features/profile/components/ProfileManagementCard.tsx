import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../app/providers/ToastContext';
import { updatePhotographerProfile, validateProfileInput } from '../api';
import { Profile } from '../../../types/database';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Save,
  X,
  Pencil,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';

export interface ProfileManagementCardProps {
  className?: string;
  onProfileUpdated?: (updated: Profile) => void;
}

export const ProfileManagementCard: React.FC<ProfileManagementCardProps> = ({
  className = '',
  onProfileUpdated,
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form inputs state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Synchronize local form state whenever profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleStartEditing = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
    setFormErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
    setFormErrors({});
    setErrorMessage(null);
    setIsEditing(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = validateProfileInput({
      full_name: fullName,
      phone: phone || null,
      avatar_url: avatarUrl || null,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setErrorMessage('Please correct the validation errors before saving.');
      return;
    }

    setFormErrors({});

    const targetUserId = user?.id || profile?.id;
    if (!targetUserId) {
      setErrorMessage('No authenticated user session found.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updatePhotographerProfile(targetUserId, {
        full_name: fullName,
        phone: phone || null,
        avatar_url: avatarUrl || null,
      });

      if (res.success && res.data) {
        setSuccessMessage('Profile information saved and synchronized successfully.');
        toast.success('Your photographer profile has been updated.', {
          title: 'Profile Updated',
        });
        await refreshProfile();
        onProfileUpdated?.(res.data);
        setIsEditing(false);
      } else {
        const errorText = res.error || 'Failed to update profile record in database.';
        setErrorMessage(errorText);
        toast.error(errorText, {
          title: 'Profile Update Failed',
        });
        if (res.validationErrors) {
          setFormErrors(res.validationErrors);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error during profile save.';
      setErrorMessage(msg);
      toast.error(msg, {
        title: 'Error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'FL';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayInitials = getInitials(profile?.full_name || 'Studio Owner');
  const lastUpdated = profile?.updated_at
    ? new Date(profile.updated_at).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  return (
    <Card variant="default" className={`p-6 sm:p-8 bg-surface-light border-2 border-navy-800 shadow-elevated ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-navy/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-navy text-sage flex items-center justify-center font-bold text-h3 shadow-subtle flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Photographer Profile'}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{displayInitials}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-h3 font-display font-bold text-navy">
                Photographer Profile & Identity
              </h2>
              <Badge variant="sage" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
                Administrator
              </Badge>
            </div>
            <p className="text-small text-navy-800">
              Manage your verified business identity, client contact channels, and branding details.
            </p>
          </div>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartEditing}
            leftIcon={<Pencil className="w-4 h-4" />}
            className="border-navy text-navy hover:bg-navy hover:text-white"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Inline Feedback Alerts */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-frame bg-red-50 border border-red-300 text-red-900 text-small flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Profile Update Error</span>
            <span className="text-xs leading-relaxed block">{errorMessage}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-frame bg-sage-50 border border-sage-400 text-navy text-small flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Changes Saved</span>
            <span className="text-xs leading-relaxed block">{successMessage}</span>
          </div>
        </div>
      )}

      {/* View Mode */}
      {!isEditing && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Full Name */}
            <div className="p-4 rounded-frame bg-white border border-sage/60">
              <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-navy-800 mb-1">
                <User className="w-3.5 h-3.5 text-navy" />
                <span>Display Name</span>
              </div>
              <span className="text-h3 font-bold text-navy block">
                {profile?.full_name || 'Studio Owner'}
              </span>
              <span className="text-[11px] text-navy/70 mt-1 block">
                Official business title for booking confirmations
              </span>
            </div>

            {/* Account Email (Read-Only) */}
            <div className="p-4 rounded-frame bg-cream border border-sage/60">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-navy-800">
                  <Mail className="w-3.5 h-3.5 text-navy" />
                  <span>Account Email</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-navy-900 bg-white/80 px-2 py-0.5 rounded border border-navy/20">
                  <Lock className="w-3 h-3 text-navy" /> Read-Only
                </span>
              </div>
              <span className="text-body font-bold text-navy block font-mono">
                {profile?.email || user?.email || 'Not specified'}
              </span>
              <span className="text-[11px] text-navy/70 mt-1 block">
                Managed through your secure studio account
              </span>
            </div>

            {/* Business Phone */}
            <div className="p-4 rounded-frame bg-white border border-sage/60">
              <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-navy-800 mb-1">
                <Phone className="w-3.5 h-3.5 text-navy" />
                <span>Business Phone</span>
              </div>
              <span className="text-body font-bold text-navy block font-mono">
                {profile?.phone || 'Not specified'}
              </span>
              <span className="text-[11px] text-navy/70 mt-1 block">
                Direct contact line for client inquiries
              </span>
            </div>

            {/* Role & Permissions (Read-Only) */}
            <div className="p-4 rounded-frame bg-cream border border-sage/60">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-navy-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-navy" />
                  <span>Access Role</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-navy-900 bg-white/80 px-2 py-0.5 rounded border border-navy/20">
                  <Lock className="w-3 h-3 text-navy" /> Enforced
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="sage" size="md">
                  {profile?.role === 'admin' ? 'Administrator' : profile?.role || 'Client'}
                </Badge>
              </div>
              <span className="text-[11px] text-navy/70 mt-1 block">
                Verified studio administrator access
              </span>
            </div>

            {/* Avatar URL */}
            <div className="p-4 rounded-frame bg-white border border-sage/60">
              <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-navy-800 mb-1">
                <ImageIcon className="w-3.5 h-3.5 text-navy" />
                <span>Profile Avatar</span>
              </div>
              <span className="text-xs text-navy-950 font-mono truncate block">
                {profile?.avatar_url || 'Using default initials badge'}
              </span>
              <span className="text-[11px] text-navy/70 mt-1 block">
                High-resolution headshot link
              </span>
            </div>

            {/* Last Synchronized */}
            <div className="p-4 rounded-frame bg-white border border-sage/60">
              <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-wider text-navy-800 mb-1">
                <Clock className="w-3.5 h-3.5 text-navy" />
                <span>Last Updated</span>
              </div>
              <span className="text-body font-medium text-navy block">
                {lastUpdated}
              </span>
              <span className="text-[11px] text-navy/70 mt-1 block">
                Saved to your studio account
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name Input (Required) */}
            <Input
              id="profile-fullname"
              label="Display Name / Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Arafat Nabuku Jansu"
              errorText={formErrors.full_name}
              helperText="Official display name for booking notifications and photographer branding."
              leftIcon={<User className="w-4 h-4 text-navy-800" />}
              disabled={isSaving}
              required
              fullWidth
            />

            {/* Phone Number Input (Optional) */}
            <Input
              id="profile-phone"
              label="Business Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +233 24 123 4567"
              errorText={formErrors.phone}
              helperText="Direct contact line shared with clients for session coordination."
              leftIcon={<Phone className="w-4 h-4 text-navy-800" />}
              disabled={isSaving}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar URL Input (Optional) */}
            <Input
              id="profile-avatar"
              label="Profile Headshot Image URL"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              errorText={formErrors.avatar_url}
              helperText="Optional public image URL for photographer headshot."
              leftIcon={<ImageIcon className="w-4 h-4 text-navy-800" />}
              disabled={isSaving}
              fullWidth
            />

            {/* Account Email (Read-Only) */}
            <Input
              id="profile-email-readonly"
              label="Account Email (Read-Only)"
              type="email"
              value={profile?.email || user?.email || ''}
              disabled
              helperText="Email is bound to your sign-in credentials and cannot be edited here."
              leftIcon={<Lock className="w-4 h-4 text-navy-800" />}
              fullWidth
            />
          </div>

          {/* Role Authorization Note (Read-Only) */}
          <div className="p-4 rounded-frame bg-cream border border-sage/60 flex items-start gap-3">
            <Lock className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <div className="text-xs text-navy-900 leading-relaxed">
              <span className="font-bold block text-navy mb-0.5">
                Account Security: Role is Protected
              </span>
              Your account is configured with studio administrator privileges. Role permissions cannot be altered through profile management.
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-navy/10">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCancelEditing}
              disabled={isSaving}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              disabled={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};
