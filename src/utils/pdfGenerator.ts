import jsPDF from 'jspdf';
import { InvoiceData, TemplateType } from '../types/invoice';
import { getCurrencySymbol } from './currency';

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN = 20;
const CONTENT_WIDTH = A4_WIDTH_MM - 2 * MARGIN;

export const generatePDF = async (invoiceData: InvoiceData, template: TemplateType) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const currencySymbol = getCurrencySymbol(invoiceData.currency);

    // Render based on template
    if (template === 'modern') {
      renderModernTemplate(pdf, invoiceData, currencySymbol);
    } else if (template === 'classic') {
      renderClassicTemplate(pdf, invoiceData, currencySymbol);
    } else {
      renderMinimalTemplate(pdf, invoiceData, currencySymbol);
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

// Helper function to add multi-line text
const addMultiLineText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number): number => {
  if (!text) return y;
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return y + (lines.length * 5);
};

// Helper function to add logo
const addLogo = (pdf: jsPDF, logo: string, x: number, y: number, width: number, height: number) => {
  if (logo) {
    try {
      pdf.addImage(logo, 'PNG', x, y, width, height);
    } catch (e) {
      console.warn('Could not add logo to PDF');
    }
  }
};

// Modern Template
const renderModernTemplate = (pdf: jsPDF, data: InvoiceData, currencySymbol: string) => {
  let y = MARGIN;

  // Header with blue background
  pdf.setFillColor(37, 99, 235); // Blue color
  pdf.rect(0, 0, A4_WIDTH_MM, 40, 'F');

  // Logo
  if (data.companyLogo) {
    addLogo(pdf, data.companyLogo, MARGIN, 10, 30, 20);
  }

  // Company Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.companyName || 'Your Company', MARGIN, 25);

  // Website
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.companyWebsite, MARGIN, 32);

  // INVOICE title
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', A4_WIDTH_MM - MARGIN, 25, { align: 'right' });

  // Invoice Number
  pdf.setFontSize(14);
  pdf.text(`#${data.invoiceNumber}`, A4_WIDTH_MM - MARGIN, 32, { align: 'right' });

  y = 50;
  pdf.setTextColor(0, 0, 0);

  // From and Bill To
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text('FROM', MARGIN, y);
  pdf.text('BILL TO', A4_WIDTH_MM / 2 + 10, y);

  y += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(data.companyName, MARGIN, y);
  pdf.text(data.clientName, A4_WIDTH_MM / 2 + 10, y);

  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  const leftY = addMultiLineText(pdf, data.companyAddress, MARGIN, y, 70);
  const rightY = addMultiLineText(pdf, data.clientAddress, A4_WIDTH_MM / 2 + 10, y, 70);
  y = Math.max(leftY, rightY);
  
  pdf.text(data.companyPhone, MARGIN, y);
  pdf.text(data.clientEmail, A4_WIDTH_MM / 2 + 10, y);
  y += 5;
  pdf.text(data.companyEmail, MARGIN, y);
  pdf.text(data.clientPhone, A4_WIDTH_MM / 2 + 10, y);

  y += 10;

  // Invoice Details Box
  pdf.setFillColor(245, 245, 245);
  pdf.rect(MARGIN, y, CONTENT_WIDTH, 15, 'F');
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Invoice Date', MARGIN + 5, y + 5);
  pdf.text('Due Date', MARGIN + 70, y + 5);
  pdf.text('Currency', MARGIN + 140, y + 5);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.invoiceDate, MARGIN + 5, y + 10);
  pdf.text(data.dueDate, MARGIN + 70, y + 10);
  pdf.text(data.currency, MARGIN + 140, y + 10);

  y += 25;

  // Line Items Table
  pdf.setFillColor(50, 50, 50);
  pdf.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Description', MARGIN + 2, y + 5);
  pdf.text('Quantity', MARGIN + 100, y + 5, { align: 'center' });
  pdf.text('Rate', MARGIN + 130, y + 5, { align: 'right' });
  pdf.text('Amount', A4_WIDTH_MM - MARGIN - 2, y + 5, { align: 'right' });

  y += 8;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');

  let isAlternate = false;
  data.lineItems.forEach((item) => {
    if (isAlternate) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(MARGIN, y, CONTENT_WIDTH, 8, 'F');
    }
    
    pdf.text(item.description, MARGIN + 2, y + 5);
    pdf.text(item.quantity.toString(), MARGIN + 100, y + 5, { align: 'center' });
    pdf.text(`${currencySymbol}${item.rate.toFixed(2)}`, MARGIN + 130, y + 5, { align: 'right' });
    pdf.text(`${currencySymbol}${item.amount.toFixed(2)}`, A4_WIDTH_MM - MARGIN - 2, y + 5, { align: 'right' });
    
    y += 8;
    isAlternate = !isAlternate;
  });

  y += 5;

  // Totals
  const totalsX = A4_WIDTH_MM - MARGIN - 70;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal', totalsX, y);
  pdf.text(`${currencySymbol}${data.subtotal.toFixed(2)}`, A4_WIDTH_MM - MARGIN - 2, y, { align: 'right' });
  y += 5;

  if (data.discount > 0) {
    pdf.text('Discount', totalsX, y);
    pdf.text(`-${currencySymbol}${data.discount.toFixed(2)}`, A4_WIDTH_MM - MARGIN - 2, y, { align: 'right' });
    y += 5;
  }

  if (data.shippingCost > 0) {
    const shippingText = data.shippingDetails ? `Shipping (${data.shippingDetails})` : 'Shipping';
    pdf.text(shippingText, totalsX, y);
    pdf.text(`${currencySymbol}${data.shippingCost.toFixed(2)}`, A4_WIDTH_MM - MARGIN - 2, y, { align: 'right' });
    y += 5;
  }

  if (data.tax > 0) {
    pdf.text('Tax', totalsX, y);
    pdf.text(`${currencySymbol}${data.tax.toFixed(2)}`, A4_WIDTH_MM - MARGIN - 2, y, { align: 'right' });
    y += 5;
  }

  // Total with blue background
  pdf.setFillColor(37, 99, 235);
  pdf.rect(totalsX - 5, y - 3, 75, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('Total', totalsX, y + 2);
  pdf.text(`${currencySymbol}${data.total.toFixed(2)}`, A4_WIDTH_MM - MARGIN - 2, y + 2, { align: 'right' });

  y += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  // Additional Information
  if (data.paymentInstructions) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT INSTRUCTIONS', MARGIN, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    y = addMultiLineText(pdf, data.paymentInstructions, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.termsAndConditions) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('TERMS & CONDITIONS', MARGIN, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    y = addMultiLineText(pdf, data.termsAndConditions, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.notes) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTES', MARGIN, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    y = addMultiLineText(pdf, data.notes, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.footerMessage) {
    if (y > A4_HEIGHT_MM - 30) {
      pdf.addPage();
      y = MARGIN;
    }
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    y = addMultiLineText(pdf, data.footerMessage, A4_WIDTH_MM / 2, y, CONTENT_WIDTH);
  }
};

// Classic Template
const renderClassicTemplate = (pdf: jsPDF, data: InvoiceData, currencySymbol: string) => {
  let y = MARGIN;

  // Logo
  if (data.companyLogo) {
    addLogo(pdf, data.companyLogo, MARGIN, y, 35, 25);
    y += 30;
  }

  // Company Name
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.companyName || 'Your Company', MARGIN, y);

  // INVOICE title on right
  pdf.setFontSize(28);
  pdf.text('INVOICE', A4_WIDTH_MM - MARGIN, y, { align: 'right' });

  y += 8;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  y = addMultiLineText(pdf, data.companyAddress, MARGIN, y, 80);
  pdf.text(data.companyPhone, MARGIN, y);
  y += 5;
  pdf.text(data.companyEmail, MARGIN, y);
  y += 5;
  pdf.text(data.companyWebsite, MARGIN, y);

  // Invoice details on right
  pdf.setFontSize(9);
  const detailsX = A4_WIDTH_MM - MARGIN - 60;
  let detailY = MARGIN + 35;
  pdf.text('Invoice #:', detailsX, detailY);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.invoiceNumber, detailsX + 20, detailY);
  pdf.setFont('helvetica', 'normal');
  
  detailY += 5;
  pdf.text('Date:', detailsX, detailY);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.invoiceDate, detailsX + 20, detailY);
  pdf.setFont('helvetica', 'normal');
  
  detailY += 5;
  pdf.text('Due Date:', detailsX, detailY);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.dueDate, detailsX + 20, detailY);

  y += 10;

  // Border line
  pdf.setLineWidth(1);
  pdf.line(MARGIN, y, A4_WIDTH_MM - MARGIN, y);

  y += 10;

  // Bill To
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('BILL TO', MARGIN, y);
  
  y += 6;
  pdf.setFontSize(11);
  pdf.text(data.clientName, MARGIN, y);
  
  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  y = addMultiLineText(pdf, data.clientAddress, MARGIN, y, 80);
  pdf.text(data.clientEmail, MARGIN, y);
  y += 5;
  pdf.text(data.clientPhone, MARGIN, y);

  y += 10;

  // Line Items Table
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y, A4_WIDTH_MM - MARGIN, y);
  y += 5;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', MARGIN, y);
  pdf.text('Qty', MARGIN + 105, y, { align: 'center' });
  pdf.text('Rate', MARGIN + 135, y, { align: 'right' });
  pdf.text('Amount', A4_WIDTH_MM - MARGIN, y, { align: 'right' });
  
  y += 2;
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y, A4_WIDTH_MM - MARGIN, y);

  y += 5;
  pdf.setFont('helvetica', 'normal');

  data.lineItems.forEach((item) => {
    pdf.text(item.description, MARGIN, y);
    pdf.text(item.quantity.toString(), MARGIN + 105, y, { align: 'center' });
    pdf.text(`${currencySymbol}${item.rate.toFixed(2)}`, MARGIN + 135, y, { align: 'right' });
    pdf.text(`${currencySymbol}${item.amount.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 7;
    pdf.setLineWidth(0.1);
    pdf.line(MARGIN, y - 2, A4_WIDTH_MM - MARGIN, y - 2);
  });

  y += 5;

  // Totals
  const totalsX = A4_WIDTH_MM - MARGIN - 60;
  pdf.text('Subtotal', totalsX, y);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${currencySymbol}${data.subtotal.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  y += 5;

  if (data.discount > 0) {
    pdf.text('Discount', totalsX, y);
    pdf.text(`-${currencySymbol}${data.discount.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 5;
  }

  if (data.shippingCost > 0) {
    const shippingText = data.shippingDetails ? `Shipping (${data.shippingDetails})` : 'Shipping';
    pdf.text(shippingText, totalsX, y);
    pdf.text(`${currencySymbol}${data.shippingCost.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 5;
  }

  if (data.tax > 0) {
    pdf.text('Tax', totalsX, y);
    pdf.text(`${currencySymbol}${data.tax.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 5;
  }

  y += 2;
  pdf.setLineWidth(0.5);
  pdf.line(totalsX - 5, y - 2, A4_WIDTH_MM - MARGIN, y - 2);
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(`Total (${data.currency})`, totalsX, y + 3);
  pdf.text(`${currencySymbol}${data.total.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y + 3, { align: 'right' });

  y += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  // Additional Information
  if (data.paymentInstructions) {
    pdf.setLineWidth(0.1);
    pdf.line(MARGIN, y - 5, A4_WIDTH_MM - MARGIN, y - 5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT INSTRUCTIONS', MARGIN, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    y = addMultiLineText(pdf, data.paymentInstructions, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.termsAndConditions) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('TERMS & CONDITIONS', MARGIN, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    y = addMultiLineText(pdf, data.termsAndConditions, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.notes) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTES', MARGIN, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    y = addMultiLineText(pdf, data.notes, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.footerMessage) {
    if (y > A4_HEIGHT_MM - 30) {
      pdf.addPage();
      y = MARGIN;
    }
    y += 10;
    pdf.setLineWidth(0.5);
    pdf.line(MARGIN, y - 5, A4_WIDTH_MM - MARGIN, y - 5);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.footerMessage, A4_WIDTH_MM / 2, y, { align: 'center' });
  }
};

// Minimal Template
const renderMinimalTemplate = (pdf: jsPDF, data: InvoiceData, currencySymbol: string) => {
  let y = MARGIN;

  // Logo
  if (data.companyLogo) {
    addLogo(pdf, data.companyLogo, MARGIN, y, 30, 20);
    y += 25;
  }

  // Company Name
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.companyName || 'Your Company', MARGIN, y);

  // INVOICE title on right
  pdf.setFontSize(24);
  pdf.text('Invoice', A4_WIDTH_MM - MARGIN, y, { align: 'right' });

  y += 5;
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  y = addMultiLineText(pdf, data.companyAddress, MARGIN, y, 70);
  const contactLine = `${data.companyPhone} | ${data.companyEmail}`;
  pdf.text(contactLine, MARGIN, y);
  y += 4;
  if (data.companyWebsite) {
    pdf.text(data.companyWebsite, MARGIN, y);
  }

  // Invoice number on right
  pdf.setTextColor(120, 120, 120);
  pdf.setFontSize(9);
  pdf.text(`#${data.invoiceNumber}`, A4_WIDTH_MM - MARGIN, MARGIN + 25, { align: 'right' });

  y += 10;
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(0, 0, 0);
  pdf.line(MARGIN, y, A4_WIDTH_MM - MARGIN, y);

  y += 10;
  pdf.setTextColor(0, 0, 0);

  // Bill To and Details
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.text('BILL TO', MARGIN, y);

  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Invoice Date:', A4_WIDTH_MM - MARGIN - 60, y);
  pdf.text(data.invoiceDate, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
  
  y += 5;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.clientName, MARGIN, y);
  
  pdf.setFontSize(9);
  pdf.text('Due Date:', A4_WIDTH_MM - MARGIN - 60, y);
  pdf.text(data.dueDate, A4_WIDTH_MM - MARGIN, y, { align: 'right' });

  y += 4;
  pdf.setFontSize(8);
  y = addMultiLineText(pdf, data.clientAddress, MARGIN, y, 70);
  
  pdf.setFontSize(9);
  pdf.text('Currency:', A4_WIDTH_MM - MARGIN - 60, y);
  pdf.text(data.currency, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
  
  pdf.setFontSize(8);
  pdf.text(data.clientEmail, MARGIN, y);
  y += 4;
  pdf.text(data.clientPhone, MARGIN, y);

  y += 10;

  // Line Items Table
  pdf.setLineWidth(0.1);
  pdf.line(MARGIN, y, A4_WIDTH_MM - MARGIN, y);
  y += 4;
  
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.text('DESCRIPTION', MARGIN, y);
  pdf.text('QTY', MARGIN + 100, y, { align: 'center' });
  pdf.text('RATE', MARGIN + 130, y, { align: 'right' });
  pdf.text('AMOUNT', A4_WIDTH_MM - MARGIN, y, { align: 'right' });

  y += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  data.lineItems.forEach((item) => {
    pdf.text(item.description, MARGIN, y);
    pdf.text(item.quantity.toString(), MARGIN + 100, y, { align: 'center' });
    pdf.text(`${currencySymbol}${item.rate.toFixed(2)}`, MARGIN + 130, y, { align: 'right' });
    pdf.text(`${currencySymbol}${item.amount.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 6;
    pdf.setLineWidth(0.05);
    pdf.setDrawColor(230, 230, 230);
    pdf.line(MARGIN, y - 1, A4_WIDTH_MM - MARGIN, y - 1);
  });

  y += 5;

  // Totals
  const totalsX = A4_WIDTH_MM - MARGIN - 50;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  
  pdf.text('Subtotal', totalsX, y);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${currencySymbol}${data.subtotal.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
  y += 5;

  if (data.discount > 0) {
    pdf.setTextColor(100, 100, 100);
    pdf.text('Discount', totalsX, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`-${currencySymbol}${data.discount.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 5;
  }

  if (data.shippingCost > 0) {
    pdf.setTextColor(100, 100, 100);
    const shippingText = data.shippingDetails ? `Shipping (${data.shippingDetails})` : 'Shipping';
    pdf.text(shippingText, totalsX, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${currencySymbol}${data.shippingCost.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 5;
  }

  if (data.tax > 0) {
    pdf.setTextColor(100, 100, 100);
    pdf.text('Tax', totalsX, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${currencySymbol}${data.tax.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y, { align: 'right' });
    y += 5;
  }

  y += 2;
  pdf.setLineWidth(0.3);
  pdf.setDrawColor(0, 0, 0);
  pdf.line(totalsX - 5, y - 2, A4_WIDTH_MM - MARGIN, y - 2);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Total', totalsX, y + 3);
  pdf.text(`${currencySymbol}${data.total.toFixed(2)}`, A4_WIDTH_MM - MARGIN, y + 3, { align: 'right' });

  y += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);

  // Additional Information
  if (data.paymentInstructions) {
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('PAYMENT INSTRUCTIONS', MARGIN, y);
    y += 4;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    y = addMultiLineText(pdf, data.paymentInstructions, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.termsAndConditions) {
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('TERMS & CONDITIONS', MARGIN, y);
    y += 4;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    y = addMultiLineText(pdf, data.termsAndConditions, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.notes) {
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('NOTES', MARGIN, y);
    y += 4;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    y = addMultiLineText(pdf, data.notes, MARGIN, y, CONTENT_WIDTH) + 5;
  }

  if (data.footerMessage) {
    if (y > A4_HEIGHT_MM - 30) {
      pdf.addPage();
      y = MARGIN;
    }
    y += 10;
    pdf.setLineWidth(0.1);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(MARGIN, y - 5, A4_WIDTH_MM - MARGIN, y - 5);
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(data.footerMessage, A4_WIDTH_MM / 2, y, { align: 'center' });
  }
};
