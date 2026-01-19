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
 * <div class="efficacy-chart">
 *   <div class="chart-header">...</div>
 *   <div class="chart-data">...</div>
 *   <div class="chart-legend">...</div>
 * </div>
 *
 * Generated: 2026-01-19
 */
export default function parse(element, { document }) {
  // Extract chart components
  const chartHeader = element.querySelector('.chart-header');
  const chartData = element.querySelector('.chart-data');
  const chartLegend = element.querySelector('.chart-legend');
  const statisticalNote = element.querySelector('.statistical-note') ||
                          element.querySelector('p:last-of-type');

  // Build column 1: Chart visualization area
  const col1 = document.createElement('div');
  if (chartHeader) col1.appendChild(chartHeader.cloneNode(true));
  if (chartData) col1.appendChild(chartData.cloneNode(true));

  // Build column 2: Legend and notes
  const col2 = document.createElement('div');
  if (chartLegend) col2.appendChild(chartLegend.cloneNode(true));
  if (statisticalNote) col2.appendChild(statisticalNote.cloneNode(true));

  // Build cells array
  const cells = [
    [col1, col2]
  ];

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Data', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
