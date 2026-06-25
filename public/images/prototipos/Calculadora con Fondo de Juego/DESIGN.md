---
name: Artesanía de Amakna
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#d1c5b4'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#9a8f80'
  outline-variant: '#4e4639'
  surface-tint: '#e9c176'
  primary: '#e9c176'
  on-primary: '#412d00'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#775a19'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#bdcbac'
  on-tertiary: '#28341d'
  tertiary-container: '#9caa8c'
  on-tertiary-container: '#333f27'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#d9e8c6'
  tertiary-fixed-dim: '#bdcbac'
  on-tertiary-fixed: '#141f0a'
  on-tertiary-fixed-variant: '#3e4b32'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  titular-xl:
    fontFamily: Cinzel
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  titular-lg:
    fontFamily: Cinzel
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  titular-md:
    fontFamily: Cinzel
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  cuerpo-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  cuerpo-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  etiqueta-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  dato-num:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unidad-base: 4px
  margen-xs: 0.5rem
  margen-md: 1rem
  margen-lg: 2rem
  espaciado-seccion: 4rem
  rejilla-hueco: 1.5rem
---

## Brand & Style

The brand personality is **Epic, Precise, and Adventurous**. This design system is crafted for the "DofusDB Recipe Search," targeting power-users, crafters, and market theorists who require data-heavy tools without losing the immersive feel of a fantasy world. The UI should evoke the sensation of consulting a master artisan’s enchanted ledger—reliable and informative, yet steeped in history.

The visual style blends **Glassmorphism with a Medieval Gritty Edge**. It utilizes deep obsidian layers, polished metallic trims, and a sophisticated interplay of light and shadow to create depth. Every interaction should feel like a meaningful step in a grand quest, balancing the functional requirements of a database with the thematic soul of an MMORPG.

## Colors

The palette is anchored by **Fondo Obsidiana** and **Fondo Carbón**, providing a deep, low-eye-strain environment for long sessions of recipe optimization. 

- **Oro Medieval (#C5A059):** Reserved for primary calls to action, important borders, and key navigation elements. It represents the "Gold Standard" of the crafting world.
- **Verde Éxito:** Used exclusively for profit margins, successful craft simulations, and positive deltas.
- **Rojo Peligro:** Indicates market loss, missing ingredients, or dangerous investments.
- **Amber & Dark Greens:** Used for subtle highlights and secondary categorization to maintain the natural, alchemical feel of the World of Twelve.

## Typography

This system uses a dual-font strategy to balance immersion with utility:

1.  **Headings (Titulares):** Uses an elegant, sharp serif (Cinzel) to evoke an ancient, carved-stone aesthetic. It is used for page titles, modal headers, and major category names.
2.  **UI/Data (Cuerpo & Etiquetas):** Uses **Hanken Grotesk** for its extreme legibility at small sizes. This is critical for reading ingredient quantities, kamas (currency) values, and complex recipe trees.

**Mobile Scaling:** `titular-xl` scales down to `28px` on mobile devices to ensure the adventurous tone remains without breaking layout containers.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum container width of 1440px. 

- **Grid:** A 12-column system is used for desktop, collapsing to 4 columns on mobile.
- **Rhythm:** Spacing follows a 4px base unit. Most components utilize 16px (`margen-md`) for internal padding to maintain a breathable, organized feel despite the high density of information.
- **Background Pattern:** The interface features a subtle, darkened overlay of the game’s profession icons (as seen in the reference) fixed to the background with `opacity: 0.05` and `multiply` blend mode, creating a textured "hero" element without distracting from data readability.

## Elevation & Depth

Depth is achieved through **Grit-Infused Glassmorphism**. Panels do not simply float; they feel like heavy, semi-transparent slabs of obsidian.

- **Nivel 1 (Fondo):** Deep Obsidian (#0F0F10).
- **Nivel 2 (Paneles):** Semi-transparent charcoal with a `backdrop-filter: blur(12px)`. These panels feature a 1px "Metallic Trim" (Oro Medieval) border with a low-opacity linear gradient.
- **Active States:** Elements in focus or "active" states emit a soft **Muted Amber glow** (`box-shadow: 0 0 15px rgba(212, 175, 55, 0.3)`), simulating enchanted illumination.
- **Z-Index:** Content layers are strictly enforced. Information cards sit above the background icons, while "Pop-up" tooltips use a higher elevation with a darker drop shadow to ensure separation.

## Shapes

The shape language is **Soft (1)**, using 4px (0.25rem) corner radii for standard elements like buttons and inputs. This provides a "machine-cut" or "forged" precision that feels more professional than fully rounded elements.

- **Iconografía:** Icons for items and ingredients should remain perfectly square to honor the game's original asset style.
- **Decorative Elements:** Outer container corners may feature a 45-degree "beveled" notch or metallic corner-cap decoration to reinforce the fantasy theme.

## Components

### Botones (Buttons)
Primary buttons use a solid `Oro Medieval` background with dark text. Secondary buttons use a transparent background with a 1px metallic border. On hover, buttons should transition to a slightly brighter `Oro Brillante` with a soft outer glow.

### Fichas de Ingredientes (Ingredient Chips)
Small, rectangular containers with a dark background. They must include the item icon (left), the name (center), and the required quantity (right). Quantities should turn red if the user's inventory is insufficient.

### Campos de Entrada (Input Fields)
Obsidian-colored backgrounds with `Oro Medieval` bottom-borders only. This "minimalist-script" style keeps the UI from feeling cluttered while maintaining the medieval aesthetic.

### Cartas de Receta (Recipe Cards)
The core component. These cards use the semi-transparent glassmorphism effect. They must clearly display "Ganancia Estimada" (Estimated Profit) in `Verde Éxito` at the top right, and the craft difficulty as a visual progress bar.

### Listas de Resultados (Result Lists)
Zebra-striping is forbidden. Instead, use thin, 1px horizontal separators in `Ambar Tenue` at 20% opacity to distinguish rows of data without creating heavy visual barriers.