/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-clinical block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, subheading)
 *
 * Source HTML Pattern:
 * <section class="hero">
 *   <h1>IN Ps, durable and rapid skin clearance...</h1>
 *   <h2>AFTER 2 INITIATION DOSES<sup>1,2</sup></h2>
 * </section>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract content from source HTML
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('[class*="title"]');

  const subheading = element.querySelector('h2') ||
                     element.querySelector('p') ||
                     element.querySelector('[class*="subtitle"]');

  // Build cells array matching block structure
  const cells = [];

  // Row 1: Content (heading + subheading)
  const contentCell = [];
  if (heading) contentCell.push(heading.cloneNode(true));
  if (subheading && subheading !== heading) contentCell.push(subheading.cloneNode(true));

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Clinical', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
