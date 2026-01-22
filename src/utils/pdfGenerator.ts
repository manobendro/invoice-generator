import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData, TemplateType } from '../types/invoice';

export const generatePDF = async (invoiceData: InvoiceData, _template: TemplateType) => {
  try {
    const invoiceElement = document.getElementById('invoice-content');
    
    if (!invoiceElement) {
      console.error('Invoice content not found');
      return;
    }

    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.background = 'white';
    document.body.appendChild(tempContainer);

    // Clone the invoice content
    const clonedElement = invoiceElement.cloneNode(true) as HTMLElement;
    tempContainer.appendChild(clonedElement);

    // Generate canvas from the element
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content exceeds one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename
    const filename = `Invoice_${invoiceData.invoiceNumber || 'draft'}_${new Date().getTime()}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
