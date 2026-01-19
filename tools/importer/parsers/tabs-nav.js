/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-nav block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: tabs
 *
 * Block Structure:
 * - Each row: [Tab Label, Tab Content (hidden)]
 *
 * Source HTML Pattern:
 * <nav class="bottom-nav">
 *   <a>OVERVIEW</a>
 *   <a>DRC</a>
 *   <a>JOINTS</a>
 *   ...
 * </nav>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract navigation links
  const navItems = element.querySelectorAll('a') ||
                   element.querySelectorAll('[class*="nav-item"]') ||
                   element.querySelectorAll('li');

  // Build cells array - each row is [label, content placeholder]
  const cells = [];

  navItems.forEach((item) => {
    const label = item.textContent.trim();
    const href = item.getAttribute('href') || '#';

    // Create content placeholder
    const contentDiv = document.createElement('div');
    contentDiv.textContent = `${label} content`;

    cells.push([label, contentDiv]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Nav', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
