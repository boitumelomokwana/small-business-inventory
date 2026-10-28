## Design Concept
This deck serves as an executive status briefing for a technical project, requiring both high-level reporting credibility and architectural precision. The visual anchor blends the editorial restraint of *Monocle* (warm paper, deep navy typography, structural thin rules) with the structured clarity of the Swiss International Style (oversized headings, grid alignments, pure whitespace). The color story completely avoids standard "tech dashboard" neon cliches. Instead, it relies on a warm, papery off-white canvas and deep navy text to establish an authoritative, document-like temperature. To encode project status without resorting to harsh primary colors, a sophisticated, muted RAG palette is employed: deep teal for verified elements, amber for work in progress, and muted coral for blockers and risks. The typographic voice is fiercely clean and architectural, utilizing a modern sans-serif with stark size contrasts to separate macro-verdicts from micro-technical details. 

## Visual Language
*   **Imagery:** Minimal/None. Purely typographic and diagrammatic execution. Photography is strictly prohibited in favor of CSS-native schematic representations.
*   **Containers:** Whitespace-first. Background cards or tinted boxes should be avoided. Information boundaries are created using CSS grid layouts and thin, stark 1px solid lines.
*   **Icons:** Restrained usage. Rely on simple solid geometric shapes (circles or diamonds) color-coded to the status palette to indicate progress. FontAwesome regular (outline) icons are permitted only within architectural diagrams to denote system nodes (e.g., databases, servers).
*   **Dataviz & Diagrams:** CSS-native structures. Architecture flows should be built with flexbox/grid blocks connected by thin 1px lines. Timelines should be constructed as horizontal structural tracks with vertical markers. Charting, if required, uses flat bars mapped directly to the teal/amber/coral status tokens.
*   **Motif:** A continuous 1px navy horizontal rule positioned exactly 80px from the top edge, spanning the entire width (less margins), serving as an editorial header line on every page.

## Layout Directives
*   **Global:** Margins set to 48px all around. Content hangs from the top motif rule. Strict left-alignment for all primary text content. Top-right corner above the motif rule carries a small tracker label (e.g., "SYS_INV // STATUS").
*   **Cover:** Oversized, multi-line display title taking up the bottom-left quadrant. Status summary metadata anchored to the bottom-right above a final structural line.
*   **Table of Contents:** Not applicable/requested, but if derived, executed as a horizontal timeline of project phases rather than a list.
*   **Section Dividers:** High-contrast verdict statements dominating the center left, paired with a singular large status indicator.
*   **Closing:** Echoes the cover layout, featuring the final timeline milestone or sign-off block instead of a generic "Thank You."
*   **Slide Map:**

| id | pattern | image | density |
| :--- | :--- | :--- | :--- |
| snapshot | editorial summary dashboard with key metrics | none | high |
| architecture | CSS-grid schematic system flow diagram | none | medium |
| progress | two-column verified checklist with teal indicators | none | medium |
| blockers | risk matrix table emphasizing coral alerts | none | high |
| next_steps | horizontal sequential timeline track | none | medium |

## Design Tokens
*   **Colors:**

| token | hex | usage |
| :--- | :--- | :--- |
| canvas | #F8F6F2 | Universal page background (warm off-white) |
| text-navy | #0F172A | Primary headings, structural rules, architecture borders |
| text-body | #334155 | Body copy, secondary diagram labels, captions |
| status-done | #0D9488 | Deep teal for verified progress, completed nodes |
| status-prog | #D97706 | Amber for ongoing tasks, partial migrations |
| status-risk | #E16D5E | Muted coral for blockers, exposed credentials, alerts |
| structural-line| #CBD5E1 | Softened lines for minor grid/table borders |

*   **Text roles:**

| role | family | size (px) | applies_to |
| :--- | :--- | :--- | :--- |
| display | Manrope | 56 | Cover titles, major verdict headlines |
| heading | Manrope | 32 | Slide titles, primary section headers |
| body | Inter | 18 | Main prose, descriptive bullets |
| mono | JetBrains Mono | 16 | Code elements, CORS origins, API endpoints |
| caption | Inter | 13 | Motif tracker, metadata, footnotes |

## Guardrails
*   **Forbidden:** No generic traffic-light colors (pure red #FF0000 or green #00FF00); use only the specified muted status tokens.
*   **Forbidden:** No drop shadows, gradients, or rounded corners on diagram elements; stick to flat, sharp, editorial geometry.
*   **Forbidden:** No centered text blocks; maintain rigorous left-alignment to preserve the document-like structure.
*   **Forbidden:** No photography or remote image assets; all visualizations must be natively built via HTML/CSS.
