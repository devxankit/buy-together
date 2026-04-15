# Buy Together: Theme & Design Rules

This document outlines the mandatory design rules for any new component or page added to the **Buy Together** project. Adhering to these rules ensures brand consistency and a premium user experience.

## 1. Brand Palette

The application uses a centralized theme system defined in `src/index.css`. **NEVER** use hardcoded hex codes for brand colors. Always use the provided Tailwind theme classes.

| Token | Variable | Value (Current) | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `bg-primary`, `text-primary` | `#F97316` (Orange) | Main actions, buttons, active highlights. |
| **Secondary** | `bg-secondary`, `text-secondary` | `#0077B6` (Blue) | Secondary buttons, trust indicators, secondary branding. |
| **Success** | `bg-success`, `text-success` | `#22C55E` (Green) | Successful deals, active status indicators. |
| **Error** | `bg-error`, `text-error` | `#EF4444` (Red) | Errors, logout buttons, destructive actions. |

## 2. Component Guidelines

### Buttons
- **Primary Action**: Use `.btn-primary`. It includes the orange background, rounded corners, and shadow effects.
- **Secondary Action**: Use `.btn-secondary`. It features the blue border and transparent background.
- **Button Sizing**: All buttons should use `px-6 py-2.5` as a standard scale.

### Cards & Surfaces
- Use `bg-white` with `rounded-2xl` or `rounded-3xl` for high-end feel.
- Borders should be subtle: `border border-gray-100`.
- Shadows should be soft and tinted towards the brand colors for depth (e.g., `shadow-orange-500/10`).

### Typography
- **Primary Font**: Use `font-sans`. It is globally set to **'Outfit'** in `index.css`.
- **Global Control**: If you need to change the application's font, update the `--font-sans` variable in `src/index.css`.
- **Sizing**: Use clear hierarchy (e.g., `text-3xl font-black` for main titles, `text-sm font-medium` for secondary details).
- **Brand Name**: Use the `text-brand` gradient or separate "Buy" (Secondary Blue) and "together" (Primary Orange).

## 3. Layout and Spacing
- **Container**: Most pages should be wrapped in `<div className="max-w-7xl mx-auto px-4 ...">`.
- **Spacing**: Use consistent spacing (e.g., `mb-10`, `py-12`, `gap-6`).

## 4. Interaction States
- All interactive elements must have a `transition-all` property.
- Hover states should slightly shift the brightness (e.g., `hover:bg-orange-600`) and possibly scale slightly (`active:scale-95`).

> [!IMPORTANT]
> To update the brand identity globally, only edit the `@theme` block in `src/index.css`. All components following these guidelines will update automatically.
