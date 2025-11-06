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
      const originalBackground = el.style.background;
      const originalBackgroundImage = el.style.backgroundImage;
      const originalBackgroundClip = el.style.webkitBackgroundClip;
      const originalBackgroundClip2 = el.style.backgroundClip;
      
      // Set a solid color instead of gradient and remove background
      el.style.webkitBackgroundClip = 'unset';
      el.style.backgroundClip = 'unset';
      el.style.color = '#007bff';
      el.style.background = 'transparent';
      el.style.backgroundImage = 'none';
      
      fixes.push({ 
        element: el, 
        originalColor,
        originalBackground,
        originalBackgroundImage,
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
  fixes.forEach(({ element, originalColor, originalBackground, originalBackgroundImage, originalBackgroundClip, originalBackgroundClip2 }) => {
    element.style.color = originalColor;
    element.style.background = originalBackground;
    element.style.backgroundImage = originalBackgroundImage;
    element.style.webkitBackgroundClip = originalBackgroundClip;
    element.style.backgroundClip = originalBackgroundClip2;
  });
}

/**
 * Convert SVG images to canvas/PNG for better compatibility with html2canvas
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
      
      // Create a new image to load the SVG
      const svgImage = new Image();
      svgImage.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
      
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        svgImage.onload = resolve;
        svgImage.onerror = reject;
      });
      
      // Create a canvas to convert SVG to PNG
      const canvas = document.createElement('canvas');
      canvas.width = img.width || svgImage.width;
      canvas.height = img.height || svgImage.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to PNG data URL
      const pngDataUrl = canvas.toDataURL('image/png');
      img.src = pngDataUrl;
      
      fixes.push({ element: img, originalSrc });
    } catch (error) {
      console.warn('Failed to convert SVG:', originalSrc, error);
      // Fallback: try simple data URL conversion
      try {
        const response = await fetch(originalSrc);
        const svgText = await response.text();
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
        img.src = dataUrl;
        fixes.push({ element: img, originalSrc });
      } catch (fallbackError) {
        console.error('Both SVG conversion methods failed:', fallbackError);
      }
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
              el.style.backgroundImage = 'none';
            }
          });
          
          // Fix progress bars - replace with divs that render properly
          const progressBars = clonedMain.querySelectorAll('progress');
          progressBars.forEach(progress => {
            // Get the progress value and max
            const value = parseFloat(progress.value);
            const max = parseFloat(progress.max);
            const percentage = (value / max) * 100;
            const opacity = progress.style.opacity || 1;
            
            // Create a div to replace the progress bar
            const progressDiv = clonedDoc.createElement('div');
            progressDiv.style.width = '100%';
            progressDiv.style.height = '8px';
            progressDiv.style.backgroundColor = 'transparent';
            progressDiv.style.position = 'relative';
            progressDiv.style.margin = progress.style.margin || '0';
            progressDiv.style.padding = progress.style.padding || '0';
            
            // Create the filled portion
            const progressFill = clonedDoc.createElement('div');
            progressFill.style.width = percentage + '%';
            progressFill.style.height = '100%';
            progressFill.style.background = 'linear-gradient(to right, #49a1ff, #007bff 50%)';
            progressFill.style.opacity = opacity;
            progressFill.style.borderRadius = '4px';
            
            progressDiv.appendChild(progressFill);
            
            // Replace the progress element with the div
            progress.parentNode.replaceChild(progressDiv, progress);
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
