import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { InvoiceData, TemplateType } from './types/invoice';
import { generatePDF } from './utils/pdfGenerator';

const initialInvoiceData: InvoiceData = {
  companyLogo: '',
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyWebsite: '',
  invoiceNumber: '',
  currency: 'USD',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  clientPhone: '',
  lineItems: [
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ],
  subtotal: 0,
  discount: 0,
  shippingDetails: '',
  shippingCost: 0,
  tax: 0,
  total: 0,
  termsAndConditions: '',
  paymentInstructions: '',
  notes: '',
  footerMessage: '',
};

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [showPreview, setShowPreview] = useState(false);

  const handleGeneratePDF = () => {
    generatePDF(invoiceData, selectedTemplate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice Generator</h1>
          <p className="text-gray-600">Create professional invoices in seconds</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Invoice Details</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            
            <div className={showPreview ? 'hidden lg:block' : ''}>
              <InvoiceForm
                invoiceData={invoiceData}
                setInvoiceData={setInvoiceData}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
              />
            </div>
          </div>

          <div className={`bg-white rounded-lg shadow-lg p-6 ${showPreview ? '' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Preview</h2>
              <button
                onClick={handleGeneratePDF}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
              >
                Generate PDF
              </button>
            </div>
            <InvoicePreview
              invoiceData={invoiceData}
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
