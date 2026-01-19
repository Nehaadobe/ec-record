/* eslint-disable */
/* global WebImporter */

/**
 * Import Script for SKYRIZI PASI 90/100 Clinical Pages
 *
 * Template: pasi-90-100-clinical
 * Description: SKYRIZI PASI 90/100 clinical data presentation page showing efficacy results from ULTIMMA studies
 *
 * Usage with AEM Importer:
 * 1. Open https://importer.hlx.page/
 * 2. Enter source URL (e.g., https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/)
 * 3. Click "Options" and set import.js path to: tools/importer/import-pasi-90-100-clinical.js
 * 4. Run import
 *
 * Generated: 2026-01-19
 */

// ============================================================================
// PARSER IMPORTS - Import all parsers needed for this template
// ============================================================================
import headerIsiParser from './parsers/header-isi.js';
import heroClinicalParser from './parsers/hero-clinical.js';
import tabsStudyParser from './parsers/tabs-study.js';
import columnsDataParser from './parsers/columns-data.js';
import cardsActionsParser from './parsers/cards-actions.js';
import accordionFootnotesParser from './parsers/accordion-footnotes.js';
import tabsNavParser from './parsers/tabs-nav.js';

// ============================================================================
// PARSER REGISTRY - Map parser names to functions
// ============================================================================
const parsers = {
  'header-isi': headerIsiParser,
  'hero-clinical': heroClinicalParser,
  'tabs-study': tabsStudyParser,
  'columns-data': columnsDataParser,
  'cards-actions': cardsActionsParser,
  'accordion-footnotes': accordionFootnotesParser,
  'tabs-nav': tabsNavParser,
};

// ============================================================================
// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
// ============================================================================
const PAGE_TEMPLATE = {
  name: 'pasi-90-100-clinical',
  description: 'SKYRIZI PASI 90/100 clinical data presentation page showing efficacy results from ULTIMMA studies',
  urls: [
    'https://skrz.abbvie-sandbox-309.workers.dev/pasi-90-100/#/'
  ],
  blocks: [
    {
      name: 'header-isi',
      instances: ['header.isi-header', 'div.isi-bar', 'header.isi', '.isi-header', '[class*="isi"]']
    },
    {
      name: 'hero-clinical',
      instances: ['section.hero', '.hero', '[class*="hero"]', 'section:first-of-type']
    },
    {
      name: 'tabs-study',
      instances: ['.nav-tabs-wrapper', '.nav-tabs', "[class*='nav-tabs']", '[data-tab-target]']
    },
    {
      name: 'columns-data',
      instances: ['.stage', '.vertical-nav', "[class*='stage']", '.inner-container']
    },
    {
      name: 'cards-actions',
      instances: ['div.action-buttons', '.action-buttons', '[class*="action"]', '.cta-buttons', '.button-group']
    },
    {
      name: 'accordion-footnotes',
      instances: ['section.footnotes', '.footnotes', '[class*="footnote"]', '.references', '.disclosure']
    },
    {
      name: 'tabs-nav',
      instances: ['div.nav-outer', 'div.main-nav', '.main-nav', "[class*='main-nav']"]
    }
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const processedElements = new Set();

  // Find all block instances defined in the template
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Avoid processing the same element twice
          if (!processedElements.has(element)) {
            processedElements.add(element);
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
            });
          }
        });
      } catch (e) {
        console.warn(`Invalid selector "${selector}" for block "${blockDef.name}":`, e.message);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Clean up unwanted elements from the DOM
 * @param {Element} main - The main content element
 * @param {Document} document - The DOM document
 */
function cleanupDOM(main, document) {
  // Remove common unwanted elements
  const selectorsToRemove = [
    'script',
    'style',
    'noscript',
    'iframe:not([src*="youtube"]):not([src*="vimeo"])',
    '.cookie-banner',
    '.consent-dialog',
    '.modal-overlay',
    '[aria-hidden="true"]',
    '.skip-link',
    '.sr-only:not(:has(*))',
  ];

  selectorsToRemove.forEach(selector => {
    try {
      main.querySelectorAll(selector).forEach(el => el.remove());
    } catch (e) {
      // Ignore invalid selectors
    }
  });

  // Remove empty elements
  main.querySelectorAll('div:empty, span:empty, p:empty').forEach(el => {
    if (!el.hasAttributes() || el.classList.length === 0) {
      el.remove();
    }
  });
}

/**
 * Fix image URLs to work with the importer proxy
 * @param {Element} main - The main content element
 * @param {string} originalURL - The original page URL
 */
function fixImageUrls(main, originalURL) {
  const baseUrl = new URL(originalURL);

  main.querySelectorAll('img').forEach(img => {
    if (img.src) {
      try {
        // Make relative URLs absolute
        if (img.src.startsWith('/')) {
          img.src = `${baseUrl.origin}${img.src}`;
        } else if (!img.src.startsWith('http')) {
          img.src = new URL(img.src, originalURL).href;
        }
      } catch (e) {
        console.warn(`Unable to fix image URL: ${img.src}`);
      }
    }
  });
}

/**
 * Handle background images by converting them to img elements
 * @param {Element} main - The main content element
 * @param {Document} document - The DOM document
 */
function handleBackgroundImages(main, document) {
  main.querySelectorAll('[style*="background-image"]').forEach(el => {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1];
      img.alt = '';
      el.insertBefore(img, el.firstChild);
    }
  });
}

// ============================================================================
// EXPORT DEFAULT CONFIGURATION
// ============================================================================
export default {
  /**
   * Called on page load - wait for dynamic content
   * Use this for lazy-loaded elements or SPAs
   */
  onLoad: async ({ document, url, params }) => {
    // Wait for any modals/overlays to appear and close them
    try {
      // Check for safety modal specific to SKYRIZI pages
      const modal = document.querySelector('.modal, .overlay, [class*="modal"]');
      if (modal) {
        const closeBtn = modal.querySelector('button, .close, [class*="close"]');
        if (closeBtn) closeBtn.click();
      }

      // Wait a moment for any dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.warn('onLoad handler warning:', e.message);
    }
  },

  /**
   * Main transformation function using 'one input / multiple outputs' pattern
   * See helix-importer-guidelines.md for transform() pattern
   */
  transform: ({ document, url, html, params }) => {
    const main = document.body;
    const results = [];

    console.log(`Importing: ${params.originalURL}`);

    // 1. Initial DOM cleanup
    cleanupDOM(main, document);

    // 2. Handle background images
    handleBackgroundImages(main, document);

    // 3. Fix image URLs
    fixImageUrls(main, params.originalURL);

    // 4. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 5. Parse each block using registered parsers
    const parsedBlocks = [];
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          console.log(`Parsing block: ${block.name} (${block.selector})`);
          parser(block.element, { document, url, params });
          parsedBlocks.push(block.name);
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e.message);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 6. Apply WebImporter built-in rules
    // Create metadata block from page meta tags
    WebImporter.rules.createMetadata(main, document);

    // Transform any remaining background images
    WebImporter.rules.transformBackgroundImages(main, document);

    // Adjust image URLs to use proxy for downloading
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Generate sanitized path (full localized path without extension)
    // Handle hash-based URLs by extracting the path before the hash
    let pathname = new URL(params.originalURL).pathname;

    // Remove trailing slash and .html extension
    pathname = pathname.replace(/\/$/, '').replace(/\.html$/, '');

    // If pathname is empty or just '/', use a default
    if (!pathname || pathname === '/') {
      pathname = '/pasi-90-100';
    }

    const path = WebImporter.FileUtils.sanitizePath(pathname);

    // 8. Return transformation result
    results.push({
      element: main,
      path,
      report: {
        title: document.title || 'SKYRIZI PASI 90/100 Clinical Data',
        template: PAGE_TEMPLATE.name,
        blocksFound: pageBlocks.length,
        blocksParsed: parsedBlocks,
        sourceUrl: params.originalURL,
      }
    });

    console.log(`Import complete: ${path}`);
    console.log(`Blocks parsed: ${parsedBlocks.join(', ')}`);

    return results;
  }
};
