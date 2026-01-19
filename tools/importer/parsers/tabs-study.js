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
 * <div class="nav-tabs-wrapper">
 *   <div class="nav-tabs">
 *     <div data-tab-target="app-ultimma-1"><span>ULTIMMA-1</span></div>
 *     <div data-tab-target="app-ultimma-2" class="active"><span>ULTIMMA-2</span></div>
 *     <div data-tab-target="app-ole"><span>OLE</span></div>
 *     <div data-tab-target="app-mean-pasi"><span>MEAN PASI</span></div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Helper function to get first non-empty NodeList
  const findElements = (el, selectors) => {
    for (const selector of selectors) {
      try {
        const items = el.querySelectorAll(selector);
        if (items && items.length > 0) {
          console.log(`tabs-study: Found ${items.length} items using selector: ${selector}`);
          return items;
        }
      } catch (e) {
        console.warn(`tabs-study: Invalid selector "${selector}":`, e.message);
      }
    }
    return [];
  };

  // Extract tab labels - SKYRIZI uses div[data-tab-target] > span
  const tabItems = findElements(element, [
    '[data-tab-target]',
    '.nav-tabs > div',
    '[class*="tab-item"]',
    'li',
    'button[role="tab"]'
  ]);

  // Skip if no tabs found
  if (!tabItems || tabItems.length === 0) {
    console.warn('tabs-study: No tab items found in element:', element.outerHTML?.substring(0, 200));
    return;
  }

  // Build cells array - each row is [label, content]
  const cells = [];

  tabItems.forEach((item) => {
    // Get label from span child or direct text
    const spanEl = item.querySelector('span');
    const label = spanEl ? spanEl.textContent.trim() : item.textContent.trim();

    // Skip separators or empty labels
    if (!label || label === '|' || label === '•') return;

    // Create a placeholder for tab content
    const contentDiv = document.createElement('div');
    contentDiv.textContent = `${label} study data content`;

    cells.push([label, contentDiv]);
  });

  // Skip if no valid cells
  if (cells.length === 0) {
    console.warn('tabs-study: No valid tab labels found');
    return;
  }

  console.log(`tabs-study: Creating block with ${cells.length} tabs`);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Study', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
