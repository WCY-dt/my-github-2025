/**
 * Export the statistics page as an image
 * Handles Chart.js canvases properly to avoid rendering issues
 */

// Button HTML content for export button
const EXPORT_BUTTON_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path>
  <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path>
</svg>
<span>Export as Image</span>`;

async function exportAsImage() {
  const mainElement = document.querySelector('main');
  const button = document.getElementById('export-button');
  
  // Disable button during export
  if (button) {
    button.disabled = true;
    button.innerHTML = '<span>Exporting...</span>';
  }

  try {
    // Use html2canvas to capture the main element
    // Important options for Chart.js compatibility:
    // - useCORS: allows loading images from different origins
    // - scale: higher scale for better quality (2 = double resolution)
    // - logging: false to avoid console clutter
    // - backgroundColor: white background for the image
    const canvas = await html2canvas(mainElement, {
      useCORS: true,
      scale: 2,
      logging: false,
      backgroundColor: '#fdfdfd',
      windowWidth: mainElement.scrollWidth,
      windowHeight: mainElement.scrollHeight,
      // Ensure we capture the full dimensions even on small screens
      width: mainElement.scrollWidth,
      height: mainElement.scrollHeight
    });

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
