// FrameLearn Core Shared Types

export type BrandColor = 'navy' | 'sage' | 'cream';

export type ComponentSize = 'sm' | 'md' | 'lg';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export type BadgeVariant = 'navy' | 'sage' | 'cream' | 'outline';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  isPlaceholder?: boolean;
}

export interface UserRole {
  id: 'admin' | 'client' | 'learner';
  name: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ImageSource {
  src: string;
  alt: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | '2:3';
  caption?: string;
}

export interface StateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

// Notification & Toast System Types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}
