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
  // Helper function to get first non-empty NodeList
  const findElements = (el, selectors) => {
    for (const selector of selectors) {
      try {
        const items = el.querySelectorAll(selector);
        if (items && items.length > 0) {
          console.log(`tabs-nav: Found ${items.length} items using selector: ${selector}`);
          return items;
        }
      } catch (e) {
        console.warn(`tabs-nav: Invalid selector "${selector}":`, e.message);
      }
    }
    return [];
  };

  // Try multiple selectors to find navigation items
  // SKYRIZI site uses: div.main-nav__item > div > span
  const navItems = findElements(element, [
    '.main-nav__item',
    '[class*="nav__item"]',
    '[data-trackingtag]',
    'a',
    '[class*="nav-item"]',
    '[class*="tab"]',
    'li',
    'button'
  ]);

  // Skip if no navigation items found
  if (!navItems || navItems.length === 0) {
    console.warn('tabs-nav: No navigation items found in element:', element.outerHTML?.substring(0, 200));
    return;
  }

  // Build cells array - each row is [label, content placeholder]
  const cells = [];

  navItems.forEach((item) => {
    // Get label - try span first, then direct text content
    const spanEl = item.querySelector('span');
    let label = spanEl ? spanEl.textContent.trim() : item.textContent.trim();

    // Skip bullet separators or empty labels
    if (!label || label === '•' || label === '|') return;

    const href = item.getAttribute('href') || item.getAttribute('data-trackingtag') || '#';

    // Create content placeholder
    const contentDiv = document.createElement('div');
    contentDiv.textContent = `${label} content`;

    cells.push([label, contentDiv]);
  });

  // Skip if no valid cells created
  if (cells.length === 0) {
    console.warn('tabs-nav: No valid navigation labels found');
    return;
  }

  console.log(`tabs-nav: Creating block with ${cells.length} tabs`);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs-Nav', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
