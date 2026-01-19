/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-footnotes block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: accordion
 *
 * Block Structure:
 * - Each row: [Label, Content]
 *
 * Source HTML Pattern:
 * <section class="footnotes">
 *   <h4>FOOTNOTES</h4>
 *   <p>NRI=nonresponder imputation</p>
 *   <p>OLE=Open-Label Extension</p>
 *   ...
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract footnotes title
  const title = element.querySelector('h4, h3, h5') ||
                element.querySelector('[class*="title"]');

  // Extract all footnote paragraphs
  const paragraphs = element.querySelectorAll('p');

  // Build content div with all footnotes
  const contentDiv = document.createElement('div');
  paragraphs.forEach((p) => {
    contentDiv.appendChild(p.cloneNode(true));
  });

  // Build cells array - single accordion item
  const cells = [
    [title ? title.textContent.trim() : 'FOOTNOTES', contentDiv]
  ];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion-Footnotes', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
