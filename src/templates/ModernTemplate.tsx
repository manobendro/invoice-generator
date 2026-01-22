import React from 'react';
import { InvoiceData } from '../types/invoice';
import { getCurrencySymbol } from '../utils/currency';

interface TemplateProps {
  invoiceData: InvoiceData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ invoiceData }) => {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

  return (
    <div id="invoice-content" className="p-8 bg-white">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            {invoiceData.companyLogo && (
              <img
                src={invoiceData.companyLogo}
                alt="Company Logo"
                className="h-16 mb-3 bg-white p-2 rounded"
              />
            )}
            <h1 className="text-3xl font-bold">{invoiceData.companyName || 'Your Company'}</h1>
            <p className="text-blue-100 mt-1">{invoiceData.companyWebsite}</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold">INVOICE</h2>
            <p className="text-xl mt-2">#{invoiceData.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">From</h3>
          <div className="text-gray-700">
            <p className="font-semibold">{invoiceData.companyName}</p>
            <p className="text-sm whitespace-pre-line">{invoiceData.companyAddress}</p>
            <p className="text-sm">{invoiceData.companyPhone}</p>
            <p className="text-sm">{invoiceData.companyEmail}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
          <div className="text-gray-700">
            <p className="font-semibold">{invoiceData.clientName}</p>
            <p className="text-sm whitespace-pre-line">{invoiceData.clientAddress}</p>
            <p className="text-sm">{invoiceData.clientEmail}</p>
            <p className="text-sm">{invoiceData.clientPhone}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm font-semibold text-gray-500">Invoice Date</p>
          <p className="text-gray-800">{invoiceData.invoiceDate}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Due Date</p>
          <p className="text-gray-800">{invoiceData.dueDate}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">Currency</p>
          <p className="text-gray-800">{invoiceData.currency}</p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-right">Rate</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-4 text-gray-700">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {currencySymbol}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {currencySymbol}{item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-80">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800 font-semibold">
              {currencySymbol}{invoiceData.subtotal.toFixed(2)}
            </span>
          </div>
          {invoiceData.discount > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Discount</span>
              <span className="text-gray-800">
                -{currencySymbol}{invoiceData.discount.toFixed(2)}
              </span>
            </div>
          )}
          {invoiceData.shippingCost > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">
                Shipping {invoiceData.shippingDetails && `(${invoiceData.shippingDetails})`}
              </span>
              <span className="text-gray-800">
                {currencySymbol}{invoiceData.shippingCost.toFixed(2)}
              </span>
            </div>
          )}
          {invoiceData.tax > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-800">
                {currencySymbol}{invoiceData.tax.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 rounded-lg mt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">
              {currencySymbol}{invoiceData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {invoiceData.paymentInstructions && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Payment Instructions</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.paymentInstructions}</p>
        </div>
      )}

      {invoiceData.termsAndConditions && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.termsAndConditions}</p>
        </div>
      )}

      {invoiceData.notes && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Notes</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
        </div>
      )}

      {/* Footer */}
      {invoiceData.footerMessage && (
        <div className="text-center mt-8 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-600">{invoiceData.footerMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
