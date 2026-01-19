/**
 * Hero Clinical Block - SKYRIZI clinical data hero section
 * Displays prominent clinical messaging with optional background image
 */
export default function decorate(block) {
  // Check for background image
  const picture = block.querySelector(':scope > div:first-child picture');
  if (!picture) {
    block.classList.add('hero-clinical-no-image');
  } else {
    // Move picture to background
    const pictureWrapper = picture.closest('div');
    if (pictureWrapper) {
      pictureWrapper.classList.add('hero-clinical-background');
    }
  }

  // Style content rows
  const rows = [...block.children];
  rows.forEach((row, index) => {
    if (index === 0 && row.querySelector('picture')) {
      row.classList.add('hero-clinical-image-row');
    } else {
      row.classList.add('hero-clinical-content-row');
    }

    // Style headings
    row.querySelectorAll('h1, h2, h3').forEach((heading) => {
      heading.classList.add('hero-clinical-heading');
    });

    // Style superscript references
    row.querySelectorAll('sup').forEach((sup) => {
      sup.classList.add('hero-clinical-reference');
    });
  });
}
