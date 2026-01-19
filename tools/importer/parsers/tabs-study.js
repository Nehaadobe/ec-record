/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-study block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: tabs
 *
 * Block Structure:
 * - Each row: [Tab Label, Tab Content]
 *
 * Source HTML Pattern:
 * <nav class="study-tabs">
 *   <ul>
 *     <li>ULTIMMA-1</li>
 *     <li class="active">ULTIMMA-2</li>
 *     <li>OLE</li>
 *     <li>MEAN PASI</li>
 *   </ul>
 * </nav>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract tab labels from navigation list
  const tabItems = element.querySelectorAll('li') ||
                   element.querySelectorAll('[class*="tab"]');

  // Build cells array - each row is [label, content]
  const cells = [];

  tabItems.forEach((item) => {
    const label = item.textContent.trim();
    // Create a placeholder for tab content
    const contentDiv = document.createElement('div');
    contentDiv.textContent = `${label} study data content`;

    cells.push([label, contentDiv]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Study', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
