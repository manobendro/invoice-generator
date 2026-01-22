export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  // Company Information
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;

  // Invoice Details
  invoiceNumber: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;

  // Bill To
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;

  // Line Items
  lineItems: LineItem[];

  // Totals
  subtotal: number;
  discount: number;
  shippingDetails: string;
  shippingCost: number;
  tax: number;
  total: number;

  // Additional Information
  termsAndConditions: string;
  paymentInstructions: string;
  notes: string;
  footerMessage: string;
}

export type TemplateType = 'modern' | 'classic' | 'minimal';
