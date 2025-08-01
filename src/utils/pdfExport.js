/**
 * PDF Export utility for TeacherReport component
 * Handles browser print to PDF functionality
 */

/**
 * Prepares the document for PDF export by adding print-specific classes
 * @param {string} reportId - The ID of the report container element
 */
export const prepareForPDFExport = (reportId) => {
  const reportElement = document.getElementById(reportId);
  if (!reportElement) {
    console.error('Report element not found');
    return false;
  }

  // Add print class to the report container
  reportElement.classList.add('teacher-report-print');
  
  // Add no-print class to elements that shouldn't be printed
  const noPrintElements = reportElement.querySelectorAll('.no-print');
  noPrintElements.forEach(el => {
    el.classList.add('no-print');
  });

  return true;
};

/**
 * Cleans up after PDF export by removing print-specific classes
 * @param {string} reportId - The ID of the report container element
 */
export const cleanupAfterPDFExport = (reportId) => {
  const reportElement = document.getElementById(reportId);
  if (reportElement) {
    reportElement.classList.remove('teacher-report-print');
  }
};

/**
 * Handles the PDF export process
 * @param {string} reportId - The ID of the report container element
 * @param {string} filename - The suggested filename for the PDF
 */
export const exportToPDF = (reportId, filename = 'teacher-report.pdf') => {
  // Prepare the document for printing
  if (!prepareForPDFExport(reportId)) {
    return;
  }

  // Store original body classes
  const originalBodyClasses = document.body.className;
  
  // Add print-friendly body classes
  document.body.classList.add('print-mode');
  
  // Create a temporary iframe for printing to avoid affecting the main page
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.left = '-9999px';
  printFrame.style.top = '-9999px';
  printFrame.style.width = '8.5in';
  printFrame.style.height = '11in';
  
  document.body.appendChild(printFrame);
  
  const frameDoc = printFrame.contentDocument || printFrame.contentWindow.document;
  
  // Copy the report content to the iframe
  const reportElement = document.getElementById(reportId);
  const clonedReport = reportElement.cloneNode(true);
  
  // Add necessary styles to the iframe
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        ${document.querySelector('style[data-vite-dev-id]')?.textContent || ''}
        ${Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n')}
        
        /* Additional print styles */
        @media print {
          body { margin: 0; padding: 0; }
          .teacher-report-print { 
            background: white !important; 
            color: black !important; 
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      ${clonedReport.outerHTML}
    </body>
    </html>
  `);
  frameDoc.close();
  
  // Wait for content to load, then print
  printFrame.onload = () => {
    try {
      // Trigger print dialog
      printFrame.contentWindow.print();
      
      // Clean up after a delay to allow print dialog to open
      setTimeout(() => {
        document.body.removeChild(printFrame);
        document.body.className = originalBodyClasses;
        cleanupAfterPDFExport(reportId);
      }, 1000);
    } catch (error) {
      console.error('Error during print:', error);
      // Fallback to direct print
      window.print();
      
      // Clean up
      document.body.removeChild(printFrame);
      document.body.className = originalBodyClasses;
      cleanupAfterPDFExport(reportId);
    }
  };
  
  // Fallback if iframe doesn't load
  setTimeout(() => {
    if (document.body.contains(printFrame)) {
      document.body.removeChild(printFrame);
      document.body.className = originalBodyClasses;
      cleanupAfterPDFExport(reportId);
      
      // Fallback to direct print
      window.print();
    }
  }, 5000);
};

/**
 * Simple PDF export function that uses the browser's print dialog directly
 * @param {string} reportId - The ID of the report container element
 */
export const simplePDFExport = (reportId) => {
  // Prepare the document for printing
  if (!prepareForPDFExport(reportId)) {
    return;
  }

  // Store original body classes
  const originalBodyClasses = document.body.className;
  
  // Add print-friendly body classes
  document.body.classList.add('print-mode');
  
  // Trigger print dialog
  window.print();
  
  // Clean up after print dialog closes
  const cleanup = () => {
    document.body.className = originalBodyClasses;
    cleanupAfterPDFExport(reportId);
    window.removeEventListener('afterprint', cleanup);
  };
  
  window.addEventListener('afterprint', cleanup);
  
  // Fallback cleanup after 10 seconds
  setTimeout(cleanup, 10000);
};

/**
 * Generates a filename for the PDF based on student name and date
 * @param {string} studentName - The student's name
 * @param {string} reportPeriod - The report period
 * @returns {string} The suggested filename
 */
export const generateFilename = (studentName, reportPeriod) => {
  const date = new Date().toISOString().split('T')[0];
  const cleanStudentName = studentName.replace(/[^a-zA-Z0-9]/g, '-');
  const cleanPeriod = reportPeriod.replace(/[^a-zA-Z0-9]/g, '-');
  return `${cleanStudentName}-${cleanPeriod}-${date}.pdf`;
}; 