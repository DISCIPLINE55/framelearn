import { NavigationItem } from '../types';

export const FOUNDATION_NAV_ITEMS: NavigationItem[] = [
  { id: 'foundation', label: 'Design System', href: '#design-system' },
  { id: 'components', label: 'UI Components', href: '#ui-components' },
  { id: 'states', label: 'App States', href: '#app-states' },
  { id: 'media', label: 'Image Foundation', href: '#image-foundation' },
  { id: 'docs', label: 'Architecture Docs', href: '#architecture-docs' },
];

export const FOOTER_NAV_ITEMS: NavigationItem[] = [
  { id: 'privacy', label: 'Privacy Policy (Placeholder)', href: '#', isPlaceholder: true },
  { id: 'terms', label: 'Terms of Service (Placeholder)', href: '#', isPlaceholder: true },
  { id: 'contact', label: 'Contact Shell', href: '#', isPlaceholder: true },
];
