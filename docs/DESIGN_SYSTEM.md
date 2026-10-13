# Design System Specification — FrameLearn

## 1. Brand Tokens

| Token | Hex Value | Semantic Role | Contrast Against White | Contrast Against Navy |
|---|---|---|---|---|
| **Primary Navy** | `#10212B` | Dominant text, navigation bar, footers, primary buttons | 15.6:1 (AAA) | N/A |
| **Sage Green** | `#8FA464` | Brand accents, badges, secondary actions, active indicators | 2.5:1 (use with dark text) | 6.2:1 (AA) |
| **Light Cream** | `#EFFBDD` | Canvas surface, card container backgrounds, breathable negative space | 1.1:1 (light surface) | 14.1:1 (AAA) |

### Contrast & WCAG 2.1 AA Compliance
- **Text on Primary Navy**: White text (`#FFFFFF`) achieves **15.6:1** contrast ratio (Exceeds WCAG AAA).
- **Navy Text on Cream**: Navy text (`#10212B`) on Light Cream (`#EFFBDD`) achieves **14.1:1** contrast ratio (Exceeds WCAG AAA).
- **Text on Sage Green**: Dark Navy text (`#10212B`) on Sage Green (`#8FA464`) achieves **6.2:1** contrast ratio (Exceeds WCAG AA).

---

## 2. Typography Hierarchy

- **Display**: Outfit Bold (Hero section headlines, big product titles)
- **Heading 1 (H1)**: Outfit Bold (`text-h1`, 2.25rem mobile / 2.75rem desktop)
- **Heading 2 (H2)**: Outfit Semi-Bold (`text-h2`, 1.75rem mobile / 2.25rem desktop)
- **Heading 3 (H3)**: Outfit Semi-Bold (`text-h3`, 1.25rem mobile / 1.5rem desktop)
- **Body Large**: Inter Regular (`text-body-lg`, 1.125rem, 1.6 line height)
- **Body**: Inter Regular (`text-body`, 1rem, 1.5 line height)
- **Small**: Inter Medium (`text-small`, 0.875rem, 1.4 line height)
- **Caption**: Inter Bold Uppercase (`text-caption`, 0.75rem, letter-spacing 0.05em)

---

## 3. UI Primitive Specifications

1. **Button**: Supports variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) and sizes (`sm`, `md`, `lg`). Includes integrated loading spinner (`isLoading`) and icon slots.
2. **Badge**: High-visibility pill indicators (`navy`, `sage`, `cream`, `outline`).
3. **Card**: Structured elevation wrapper (`CardHeader`, `CardTitle`, `CardSubtitle`, `CardContent`, `CardFooter`).
4. **Input, Select, Textarea**: Form elements with persistent labels, helper text, and accessible error message slots (`aria-invalid`, `aria-describedby`).
5. **Modal**: Accessible modal dialog with focus trap, backdrop click, and `Escape` key dismissal.
6. **ConfirmDialog**: Action confirmation modal with explicit Confirm/Cancel triggers and warning variants.
7. **Toast & ToastContainer**: Floating accessible notification stack with auto-dismiss and pause-on-hover.
8. **LoadingState / EmptyState / ErrorState**: Standardized operational feedback components with clear typography and actionable buttons.
9. **ImageContainer**: Aspect-ratio preserving container (`1:1`, `3:2`, `4:3`, `16:9`, `2:3`) with skeleton pulse and error fallback.
