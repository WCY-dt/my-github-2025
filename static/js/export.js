/**
 * Export the statistics page as an image
 * Handles Chart.js canvases properly to avoid rendering issues
 * Fixes SVG, gradient text, and gradient progress bar rendering
 */

// Button HTML content for export button
const EXPORT_BUTTON_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path>
  <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path>
</svg>
<span>Export as Image</span>`;

/**
 * Clone and fix gradient text elements for html2canvas
 * Background-clip: text doesn't work properly with html2canvas
 */
function fixGradientText(element) {
  const fixes = [];
  
  // Find all elements that might have gradient text
  const allElements = element.querySelectorAll('span, num, p');
  
  allElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const backgroundClip = computedStyle.backgroundClip || computedStyle.webkitBackgroundClip;
    
    // Check if element has background-clip: text
    if (backgroundClip === 'text') {
      // Save original styles
      const originalColor = el.style.color;
      const originalBackgroundClip = el.style.webkitBackgroundClip;
      const originalBackgroundClip2 = el.style.backgroundClip;
      
      // Set a solid color instead of gradient
      el.style.webkitBackgroundClip = 'unset';
      el.style.backgroundClip = 'unset';
      el.style.color = '#007bff';
      
      fixes.push({ 
        element: el, 
        originalColor,
        originalBackgroundClip,
        originalBackgroundClip2
      });
    }
  });
  
  return fixes;
}

/**
 * Restore original styles after capture
 */
function restoreStyles(fixes) {
  fixes.forEach(({ element, originalColor, originalBackgroundClip, originalBackgroundClip2 }) => {
    element.style.color = originalColor;
    element.style.webkitBackgroundClip = originalBackgroundClip;
    element.style.backgroundClip = originalBackgroundClip2;
  });
}

/**
 * Convert SVG images to inline data URLs for better compatibility
 */
async function fixSvgImages(element) {
  const svgImages = element.querySelectorAll('img[src$=".svg"]');
  const fixes = [];
  
  for (const img of svgImages) {
    const originalSrc = img.src;
    
    try {
      // Fetch the SVG content
      const response = await fetch(originalSrc);
      const svgText = await response.text();
      
      // Convert to data URL
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
      img.src = dataUrl;
      
      fixes.push({ element: img, originalSrc });
    } catch (error) {
      console.warn('Failed to convert SVG:', originalSrc, error);
    }
  }
  
  return fixes;
}

/**
 * Restore original SVG sources
 */
function restoreSvgImages(fixes) {
  fixes.forEach(({ element, originalSrc }) => {
    element.src = originalSrc;
  });
}

async function exportAsImage() {
  const mainElement = document.querySelector('main');
  const button = document.getElementById('export-button');
  
  // Disable button during export
  if (button) {
    button.disabled = true;
    button.innerHTML = '<span>Exporting...</span>';
  }

  try {
    // Fix rendering issues before capture
    const svgFixes = await fixSvgImages(mainElement);
    const gradientFixes = fixGradientText(mainElement);
    
    // Small delay to ensure styles are applied
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Use html2canvas to capture the main element
    // Important options for Chart.js compatibility:
    // - useCORS: allows loading images from different origins
    // - scale: higher scale for better quality (2 = double resolution)
    // - logging: false to avoid console clutter
    // - backgroundColor: white background for the image
    // - allowTaint: true to allow cross-origin images
    // - foreignObjectRendering: false to avoid issues with gradients
    const canvas = await html2canvas(mainElement, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
      logging: false,
      backgroundColor: '#fdfdfd',
      windowWidth: mainElement.scrollWidth,
      windowHeight: mainElement.scrollHeight,
      // Ensure we capture the full dimensions even on small screens
      width: mainElement.scrollWidth,
      height: mainElement.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional fixes in the cloned document
        const clonedMain = clonedDoc.querySelector('main');
        if (clonedMain) {
          // Fix gradient text in cloned document by modifying computed styles
          const gradientElements = clonedMain.querySelectorAll('span, num, p');
          gradientElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const backgroundClip = style.backgroundClip || style.webkitBackgroundClip;
            
            if (backgroundClip === 'text') {
              el.style.webkitBackgroundClip = 'unset';
              el.style.backgroundClip = 'unset';
              el.style.color = '#007bff';
              el.style.background = 'transparent';
            }
          });
          
          // Fix progress bars with gradients
          const progressBars = clonedMain.querySelectorAll('progress');
          progressBars.forEach(progress => {
            // Progress bars should render with their gradient intact
            progress.style.filter = 'none';
          });
        }
      }
    });

    // Restore original styles
    restoreSvgImages(svgFixes);
    restoreStyles(gradientFixes);

    // Convert canvas to blob and download
    canvas.toBlob(function(blob) {
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename with current date
      const now = new Date();
      const year = document.getElementById('data-year')?.textContent || now.getFullYear();
      const filename = `my-github-${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.png`;
      
      link.download = filename;
      link.href = url;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Re-enable button
      if (button) {
        button.disabled = false;
        button.innerHTML = EXPORT_BUTTON_HTML;
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('Error exporting image:', error);
    alert('Failed to export image. Please try again.');
    
    // Re-enable button on error
    if (button) {
      button.disabled = false;
      button.innerHTML = EXPORT_BUTTON_HTML;
    }
  }
}
