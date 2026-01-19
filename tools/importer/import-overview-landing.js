/* eslint-disable */
/* global WebImporter */

/**
 * Import Script for SKYRIZI Overview Landing Pages
 *
 * Template: overview-landing
 * Description: SKYRIZI overview landing page with key messaging for Ps and PsA indications
 *
 * Usage with AEM Importer:
 * 1. Open https://importer.hlx.page/
 * 2. Enter source URL (e.g., https://skrz.abbvie-sandbox-309.workers.dev/overview/#/)
 * 3. Click "Options" and set import.js path to: tools/importer/import-overview-landing.js
 * 4. Run import
 *
 * Generated: 2026-01-19
 */

// ============================================================================
// PARSER IMPORTS - Import all parsers needed for this template
// ============================================================================
import headerIsiParser from './parsers/header-isi.js';
import heroClinicalParser from './parsers/hero-clinical.js';
import columnsDataParser from './parsers/columns-data.js';
import cardsActionsParser from './parsers/cards-actions.js';
import tabsNavParser from './parsers/tabs-nav.js';

// ============================================================================
// PARSER REGISTRY - Map parser names to functions
// ============================================================================
const parsers = {
  'header-isi': headerIsiParser,
  'hero-clinical': heroClinicalParser,
  'columns-data': columnsDataParser,
  'cards-actions': cardsActionsParser,
  'tabs-nav': tabsNavParser,
};

// ============================================================================
// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
// ============================================================================
const PAGE_TEMPLATE = {
  name: 'overview-landing',
  description: 'SKYRIZI overview landing page with key messaging for Ps and PsA indications',
  urls: [
    'https://skrz.abbvie-sandbox-309.workers.dev/overview/#/'
  ],
  blocks: [
    {
      name: 'header-isi',
      instances: ['header.isi-header', 'div.isi-bar', '[class*="isi"]']
    },
    {
      name: 'hero-clinical',
      instances: ['[class*="hero"]', 'section:first-of-type']
    },
    {
      name: 'columns-data',
      instances: ['[class*="columns"]', '[class*="indication"]']
    },
    {
      name: 'cards-actions',
      instances: ['[class*="card"]', '[class*="callout"]', '[class*="feature"]']
    },
    {
      name: 'tabs-nav',
      instances: ['nav.bottom-nav', '[class*="navigation"]']
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

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
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
   */
  onLoad: async ({ document, url, params }) => {
    try {
      const modal = document.querySelector('.modal, .overlay, [class*="modal"]');
      if (modal) {
        const closeBtn = modal.querySelector('button, .close, [class*="close"]');
        if (closeBtn) closeBtn.click();
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.warn('onLoad handler warning:', e.message);
    }
  },

  /**
   * Main transformation function using 'one input / multiple outputs' pattern
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
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Generate sanitized path
    let pathname = new URL(params.originalURL).pathname;
    pathname = pathname.replace(/\/$/, '').replace(/\.html$/, '');

    if (!pathname || pathname === '/') {
      pathname = '/overview';
    }

    const path = WebImporter.FileUtils.sanitizePath(pathname);

    // 8. Return transformation result
    results.push({
      element: main,
      path,
      report: {
        title: document.title || 'SKYRIZI Overview',
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
