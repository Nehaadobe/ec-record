/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-actions block
 *
 * Source: https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/
 * Base Block: cards
 *
 * Block Structure (no images variant):
 * - Each row: [Card text content]
 *
 * Source HTML Pattern:
 * <div class="action-buttons">
 *   <button>RAPID RESPONSE</button>
 *   <button>PATIENT PHOTOS</button>
 *   ...
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract action buttons
  const buttons = element.querySelectorAll('button') ||
                  element.querySelectorAll('a') ||
                  element.querySelectorAll('[class*="btn"]');

  // Build cells array - each button becomes a card row
  const cells = [];

  buttons.forEach((button) => {
    const buttonText = button.textContent.trim();

    // Create card content
    const cardContent = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = buttonText;
    cardContent.appendChild(heading);

    cells.push([cardContent]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Actions', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
