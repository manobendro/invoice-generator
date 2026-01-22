import React from 'react';
import { InvoiceData, TemplateType } from '../types/invoice';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  template: TemplateType;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate invoiceData={invoiceData} />;
      case 'classic':
        return <ClassicTemplate invoiceData={invoiceData} />;
      case 'minimal':
        return <MinimalTemplate invoiceData={invoiceData} />;
      default:
        return <ModernTemplate invoiceData={invoiceData} />;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default InvoicePreview;
