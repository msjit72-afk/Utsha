import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportInvoiceToPdf(elementId = 'invoice-sheet', filename = 'Invoice_International_Tour_Travel.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice element not found');
  }

  // Create high-res canvas (scale 2 for crisp 300 DPI print quality)
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // A4 size in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Add the image filling A4 page cleanly
  pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  pdf.save(filename);
}

export async function exportInvoiceToImage(elementId = 'invoice-sheet', filename = 'Invoice_International_Tour_Travel.png'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function triggerDirectPrint(): boolean {
  try {
    window.print();
    return true;
  } catch (err) {
    console.warn('Direct print error (likely blocked by iframe sandbox):', err);
    return false;
  }
}
