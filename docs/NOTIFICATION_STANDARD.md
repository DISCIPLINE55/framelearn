# FrameLearn Notification Standard

## Overview
This standard defines the notification architecture, API, visual design, and accessibility rules for **FrameLearn** (Milestone 001 Foundation).

### Zero Browser-Native Dialog Rule
FrameLearn strictly prohibits the use of:
- `window.alert()`
- `window.confirm()`
- `window.prompt()`

All user feedback and operational confirmations must use the branded, accessible notification primitives:
1. **Toast System** (`useToast`, `ToastContainer`, `Toast`) for non-blocking outcome reporting.
2. **Confirmation Dialog** (`ConfirmDialog`) for pre-action confirmation of consequential or destructive operations.

---

## 1. Supported Notification Types

| Type | Semantic Role | Default Duration | Visual Accent | Appropriate Usage |
|------|---------------|------------------|---------------|-------------------|
| **Success** | `status` (`polite`) | 4500ms | Sage Green (`#8FA464`) | Genuine completion of an asynchronous or state-changing action. Never show upon click alone. |
| **Error** | `alert` (`assertive`) | 6000ms | Crimson Red (`#B91C1C`) | Action failure, server error, network drop, or unrecoverable client validation failure. |
| **Warning** | `alert` (`polite`) | 5000ms | Amber (`#D97706`) | Non-blocking caution, unsaved changes, or deprecation notices. |
| **Info** | `status` (`polite`) | 4500ms | Primary Navy (`#10212B`) | Neutral operational updates, contextual help, or tips. |
| **Loading** | `status` (`polite`) | Persistent (until dismissed or updated) | Sage Green Spinner | Long-running operations requiring progress feedback. |

---

## 2. Notification API Usage

### Hook Import
```tsx
import { useToast } from '../app/providers/ToastContext';

export const MyComponent: React.FC = () => {
  const { toast } = useToast();

  const handleSave = async () => {
    const loadingId = toast.loading('Saving gallery preferences...');
    try {
      await savePreferences();
      toast.dismiss(loadingId);
      toast.success('Gallery preferences saved successfully.');
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error('Could not save gallery preferences. Please try again.');
    }
  };

  return <button onClick={handleSave}>Save</button>;
};
```

### Direct Methods
- `toast.success(message: string, options?: ToastOptions): string`
- `toast.error(message: string, options?: ToastOptions): string`
- `toast.warning(message: string, options?: ToastOptions): string`
- `toast.info(message: string, options?: ToastOptions): string`
- `toast.loading(message: string, options?: ToastOptions): string`
- `toast.dismiss(id: string): void`
- `toast.dismissAll(): void`

### Toast Options Interface
```typescript
export interface ToastOptions {
  title?: string;
  duration?: number; // Milliseconds, 0 for persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## 3. Message-Writing Conventions

1. **Be Honest and Accurate**: Only claim an action succeeded if the underlying system actually completed it. Never report that data was "saved", "sent", or "uploaded" when it was only buffered or clicked.
2. **Be Clear and Concise**: State the outcome in the first phrase.
3. **Avoid Jargon**: Use plain language rather than technical error codes.
4. **Offer Next Steps on Failure**: Explain what the user can do next (e.g., "Check your internet connection and retry").

### Examples of Correct vs Incorrect Usage

| Scenario | ❌ Incorrect | ✅ Correct |
|---|---|---|
| User clicks submit without backend | `toast.success("Message sent!")` *(Untrue)* | `toast.info("Demonstration mode: No network request dispatched.")` |
| Image failed to upload | `toast.error("Error 500: Internal server socket exception")` | `toast.error("Failed to upload image. Please check the file size and retry.")` |
| Filter reset | `alert("Filter reset")` *(Native dialog)* | `toast.info("Showing all categories.")` |
| Deleting gallery | Toast without prior confirmation | Branded `ConfirmDialog`, followed by `toast.success("Gallery deleted.")` |

---

## 4. Confirmation Dialog Requirements

Toasts are suitable for **post-action status reporting**, never as a replacement for explicit confirmation before consequential or destructive operations (e.g., deleting galleries, clearing form data, cancelling bookings).

### Component Usage:
```tsx
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

<ConfirmDialog
  isOpen={isDeleteDialogOpen}
  title="Delete Photo Session?"
  message="Are you sure you want to delete this session? This action cannot be undone."
  variant="danger"
  confirmLabel="Delete Session"
  cancelLabel="Keep Session"
  isLoading={isDeleting}
  onConfirm={handleDeleteConfirmed}
  onCancel={() => setIsDeleteDialogOpen(false)}
/>
```

---

## 5. Accessibility & Reduced Motion

- **Live Announcements**: Errors announce assertively via `aria-live="assertive" role="alert"`; informational and success toasts announce politely via `aria-live="polite" role="status"`.
- **Keyboard Dismissal**: Every toast provides a dedicated close button with `aria-label="Dismiss notification"` that can be triggered via Tab + Enter/Space.
- **Escape Key Handling**: Confirmation dialogs dismiss on the `Escape` key without executing the action.
- **Reduced Motion**: All animations respect the `prefers-reduced-motion` media query (`motion-reduce:transition-none motion-reduce:transform-none`).
- **Color Contrast**: All text elements adhere to WCAG 2.1 AA standards (Navy text `#10212B` on White `#FFFFFF` yields **15.6:1**, well exceeding the 4.5:1 requirement).
