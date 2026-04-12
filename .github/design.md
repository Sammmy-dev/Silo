# Design System Specification: The Architectural Inventory
 
## 1. Overview & Creative North Star
### The Creative North Star: "The Digital Curator"
Inventory management is often a chaotic sprawl of data. This design system rejects the cluttered "dashboard" trope in favor of a **curated, editorial experience**. We treat supply chain data with the same reverence as a high-end gallery catalog. 
 
The system moves beyond "SaaS-standard" by embracing **The Digital Curator** mindset: high-density information presented through sophisticated, layered surfaces, intentional asymmetry, and a complete rejection of rigid structural lines. We achieve "Modern & Trustworthy" not through heavy borders, but through precise tonal shifts and authoritative typography.
 
---
 
## 2. Colors & Surface Architecture
Our palette is rooted in a "Warm Industrial" aesthetic—combining the authority of Deep Teal with the approachability of Warm Grays.
 
### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the UI. Containers must be defined solely through background color shifts.
*   **Action:** Use `surface-container-low` for your primary canvas.
*   **Action:** Use `surface-container-lowest` (Pure White) for active cards or interactive zones to create "natural lift."
 
### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
1.  **Base Layer:** `surface` (#fbf9f1) - The furthest background.
2.  **App Chrome/Sidebar:** `surface-container-low` (#f5f4eb) - Subtle separation.
3.  **Content Cards:** `surface-container-lowest` (#ffffff) - Highest prominence.
4.  **Nested Data Tables:** `surface-container` (#f0eee5) - For internal grouping.
 
### The Glass & Gradient Rule
To add "soul" to the data, use **Atmospheric Gradients** for primary actions. Instead of a flat `#005440`, use a linear gradient from `primary` to `primary_container`. 
*   **Glassmorphism:** For floating modals or dropdowns, use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur to keep the user grounded in their current context.
 
---
 
## 3. Typography
We use **Inter** as a tool of precision. By utilizing a tighter-than-average scale, we allow for extreme data density without sacrificing readability.
 
| Role | Token | Size | Weight | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-sm` | 2.25rem | 600 | Monthly Stock Valuations |
| **Headline** | `headline-sm` | 1.5rem | 500 | Warehouse Overview |
| **Title** | `title-sm` | 1.0rem | 600 | SKU: 884-219 |
| **Body (Default)**| `body-md` | 0.875rem | 400 | Standard inventory descriptions |
| **Table Data** | `body-sm` | 0.8125rem | 400 | Tabular numeric data |
| **Label** | `label-sm` | 0.75rem | 500 | Form headers / Metadata |
 
**Editorial Note:** Use `on_surface_variant` (muted gray) for metadata to create a "recessed" visual hierarchy, allowing the primary data points in `on_surface` (near-black) to pop.
 
---
 
## 4. Elevation & Depth
In this design system, shadows are an exception, not a rule. We rely on **Tonal Layering**.
 
### The Layering Principle
Depth is achieved by stacking. A `surface-container-lowest` card sitting on a `surface-container-low` background creates a 3D effect purely through contrast.
 
### Ambient Shadows
When a component must "float" (e.g., a Global Search Bar), use the **Ambient Shadow**:
*   **Blur:** 24px
*   **Spread:** -4px
*   **Color:** `rgba(27, 28, 23, 0.06)` (a tinted version of our `on_surface`).
 
### The "Ghost Border" Fallback
If contrast ratios are failing on low-quality monitors, use a **Ghost Border**: 1px solid `outline_variant` at **15% opacity**. Never use a 100% opaque border.
 
---
 
## 5. Components
 
### Buttons
*   **Primary:** Linear gradient (`primary` to `primary_container`), 6px radius. Text: `on_primary`.
*   **Secondary:** Ghost style. No background. `surface_variant` background on hover.
*   **Tertiary:** `on_surface_variant` text with a subtle `surface_container_high` background.
 
### Input Fields
*   **Style:** No borders. Background: `surface_container_highest` (#e4e3da).
*   **Focus:** 2px solid `surface_tint`.
*   **Radius:** 8px.
 
### Cards & Data Tables
*   **The Divider Ban:** Strictly forbid horizontal lines between rows. Use 12px of vertical white space and a `surface-container-lowest` hover state to highlight rows.
*   **Inventory Badges:** Use `md` (6px) rounding. Success Green (#3B6D11) for "In Stock," Danger Coral (#993C1D) for "Out of Stock."
 
### Inventory-Specific: The "Silo" Module
For inventory groups, use a **Nested Stack**. A parent container (`surface-container-low`) containing child items (`surface-container-lowest`). This mimics physical shelving.
 
---
 
## 6. Do’s and Don’ts
 
### Do
*   **Do** use asymmetrical margins (e.g., wider left-hand gutters) to create an editorial layout feel.
*   **Do** use `label-sm` in ALL CAPS with 0.05em letter spacing for non-interactive metadata.
*   **Do** allow data-dense tables to breathe using a 4px-base grid (multiples of 4, 8, 12, 16).
 
### Don't
*   **Don't** use a standard #000000 shadow. It "muddies" the warm gray palette.
*   **Don't** use a border to separate the sidebar from the main content. Use a background color shift from `surface-container-low` to `surface`.
*   **Don't** use high-contrast primary colors for status icons. Use the "dim" variants (`tertiary_fixed_dim`) to keep the UI professional and calm.
 
---
 
## 7. Accessibility & Motion
*   **Contrast:** Ensure all `on_surface_variant` text on `surface_container` backgrounds meets a 4.5:1 ratio.
*   **Micro-interactions:** When a user hovers over an inventory item, use a subtle `0.5rem` upward translation (lift) combined with a Tonal Layer shift rather than a heavy shadow.