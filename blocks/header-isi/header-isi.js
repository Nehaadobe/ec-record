/**
 * Header ISI Block - Important Safety Information Bar
 * Displays a fixed header with back navigation and ISI links
 */
export default function decorate(block) {
  // Get the content rows
  const rows = [...block.children];

  // Create the header structure
  const wrapper = document.createElement('div');
  wrapper.className = 'header-isi-wrapper';

  // Back button (first cell if exists)
  const backBtn = document.createElement('button');
  backBtn.className = 'header-isi-back';
  backBtn.setAttribute('aria-label', 'Go back');
  backBtn.innerHTML = '<span class="header-isi-arrow">←</span>';
  backBtn.addEventListener('click', () => window.history.back());
  wrapper.appendChild(backBtn);

  // Main content area
  const content = document.createElement('div');
  content.className = 'header-isi-content';

  // Process rows for ISI text and link
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const clone = cell.cloneNode(true);
      clone.className = 'header-isi-item';
      content.appendChild(clone);
    });
  });

  wrapper.appendChild(content);

  // Clear block and add new structure
  block.textContent = '';
  block.appendChild(wrapper);
}
