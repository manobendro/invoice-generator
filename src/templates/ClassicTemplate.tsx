import React from 'react';
import { InvoiceData } from '../types/invoice';
import { getCurrencySymbol } from '../utils/currency';

interface TemplateProps {
  invoiceData: InvoiceData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ invoiceData }) => {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

  return (
    <div id="invoice-content" className="p-8 bg-white">
      {/* Header */}
      <div className="border-b-4 border-gray-800 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {invoiceData.companyLogo && (
              <img
                src={invoiceData.companyLogo}
                alt="Company Logo"
                className="h-20 mb-4"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-800">{invoiceData.companyName || 'Your Company'}</h1>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p className="whitespace-pre-line">{invoiceData.companyAddress}</p>
              <p>{invoiceData.companyPhone}</p>
              <p>{invoiceData.companyEmail}</p>
              <p>{invoiceData.companyWebsite}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-800">INVOICE</h2>
            <p className="text-gray-600 mt-2">Invoice #: <span className="font-semibold">{invoiceData.invoiceNumber}</span></p>
            <p className="text-gray-600">Date: <span className="font-semibold">{invoiceData.invoiceDate}</span></p>
            <p className="text-gray-600">Due Date: <span className="font-semibold">{invoiceData.dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800 uppercase mb-2 border-b border-gray-400 pb-1">Bill To</h3>
        <div className="text-gray-700">
          <p className="font-semibold text-lg">{invoiceData.clientName}</p>
          <p className="text-sm whitespace-pre-line">{invoiceData.clientAddress}</p>
          <p className="text-sm">{invoiceData.clientEmail}</p>
          <p className="text-sm">{invoiceData.clientPhone}</p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="py-3 px-2 text-left text-gray-800 font-bold">Description</th>
              <th className="py-3 px-2 text-center text-gray-800 font-bold">Qty</th>
              <th className="py-3 px-2 text-right text-gray-800 font-bold">Rate</th>
              <th className="py-3 px-2 text-right text-gray-800 font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="py-3 px-2 text-gray-700">{item.description}</td>
                <td className="py-3 px-2 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 px-2 text-right text-gray-700">
                  {currencySymbol}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-2 text-right text-gray-700">
                  {currencySymbol}{item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-80 border-t-2 border-gray-800 pt-4">
          <div className="flex justify-between py-2">
            <span className="text-gray-700">Subtotal</span>
            <span className="text-gray-800 font-semibold">
              {currencySymbol}{invoiceData.subtotal.toFixed(2)}
            </span>
          </div>
          {invoiceData.discount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Discount</span>
              <span className="text-gray-800">
                -{currencySymbol}{invoiceData.discount.toFixed(2)}
              </span>
            </div>
          )}
          {invoiceData.shippingCost > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-700">
                Shipping {invoiceData.shippingDetails && `(${invoiceData.shippingDetails})`}
              </span>
              <span className="text-gray-800">
                {currencySymbol}{invoiceData.shippingCost.toFixed(2)}
              </span>
            </div>
          )}
          {invoiceData.tax > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Tax</span>
              <span className="text-gray-800">
                {currencySymbol}{invoiceData.tax.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t-2 border-gray-800 mt-2">
            <span className="text-lg font-bold text-gray-800">Total ({invoiceData.currency})</span>
            <span className="text-lg font-bold text-gray-800">
              {currencySymbol}{invoiceData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {invoiceData.paymentInstructions && (
        <div className="mb-4 border-t border-gray-300 pt-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-2">Payment Instructions</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.paymentInstructions}</p>
        </div>
      )}

      {invoiceData.termsAndConditions && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.termsAndConditions}</p>
        </div>
      )}

      {invoiceData.notes && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-2">Notes</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
        </div>
      )}

      {/* Footer */}
      {invoiceData.footerMessage && (
        <div className="text-center mt-8 pt-4 border-t-2 border-gray-800">
          <p className="text-sm text-gray-600 font-semibold">{invoiceData.footerMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
