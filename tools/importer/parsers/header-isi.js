/* eslint-disable */
/* global WebImporter */

/**
 * Parser for header-isi block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: header
 *
 * Block Structure:
 * - Row 1: [ISI Text, Prescribing Info Link]
 *
 * Source HTML Pattern:
 * <header class="isi-header">
 *   <button class="back">←</button>
 *   <p>Tap here for Indications...</p>
 *   <a href="...">See accompanying Full Prescribing Information</a>
 * </header>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract ISI text
  const isiText = element.querySelector('p, [class*="isi-text"]');

  // Extract prescribing info link
  const prescribingLink = element.querySelector('a[href*="prescribing"], a[href*="pi.pdf"]');

  // Build cells array
  const cells = [];

  const cell1 = document.createElement('div');
  if (isiText) {
    cell1.textContent = isiText.textContent.trim();
  } else {
    cell1.textContent = 'Tap here for Indications and additional Important Safety Information.';
  }

  const cell2 = document.createElement('div');
  if (prescribingLink) {
    const link = document.createElement('a');
    link.href = prescribingLink.href;
    link.textContent = prescribingLink.textContent.trim();
    cell2.appendChild(link);
  } else {
    cell2.textContent = 'See accompanying Full Prescribing Information';
  }

  cells.push([cell1, cell2]);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Header-ISI', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
