/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-data block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: [Column 1 content, Column 2 content]
 *
 * Source HTML Pattern:
 * <div class="stage has-tabs">
 *   <div class="inner-container">
 *     <div class="vertical-nav">...</div>
 *     <div class="content-area">...</div>
 *   </div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Helper to find first matching element
  const findFirst = (el, selectors) => {
    for (const selector of selectors) {
      try {
        const found = el.querySelector(selector);
        if (found) {
          console.log(`columns-data: Found element using selector: ${selector}`);
          return found;
        }
      } catch (e) {
        console.warn(`columns-data: Invalid selector "${selector}":`, e.message);
      }
    }
    return null;
  };

  // Extract content components - try various selectors
  const nav = findFirst(element, [
    '.vertical-nav',
    '[class*="vertical"]',
    '.sidebar',
    'nav'
  ]);

  const content = findFirst(element, [
    '.inner-container',
    '.content-area',
    '.chart-data',
    '[class*="content"]'
  ]);

  const headings = element.querySelectorAll('h1, h2, h3, h4, h5');
  const paragraphs = element.querySelectorAll('p');
  const lists = element.querySelectorAll('ul, ol');

  // Build column 1: Navigation or main content
  const col1 = document.createElement('div');
  if (nav) {
    col1.appendChild(nav.cloneNode(true));
  } else if (headings.length > 0) {
    // Use headings as first column
    headings.forEach(h => col1.appendChild(h.cloneNode(true)));
  }

  // Build column 2: Content area
  const col2 = document.createElement('div');
  if (content) {
    col2.appendChild(content.cloneNode(true));
  } else {
    // Use paragraphs and lists
    paragraphs.forEach(p => col2.appendChild(p.cloneNode(true)));
    lists.forEach(l => col2.appendChild(l.cloneNode(true)));
  }

  // Skip if no meaningful content found
  if (!col1.hasChildNodes() && !col2.hasChildNodes()) {
    console.warn('columns-data: No content found in element:', element.outerHTML?.substring(0, 200));
    // Still create a basic block with the element's content
    const cells = [[element.cloneNode(true)]];
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Data', cells });
    element.replaceWith(block);
    return;
  }

  console.log('columns-data: Creating block with content');

  // Build cells array
  const cells = [
    [col1, col2]
  ];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Data', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
