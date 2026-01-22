import React from 'react';
import { InvoiceData } from '../types/invoice';
import { getCurrencySymbol } from '../utils/currency';

interface TemplateProps {
  invoiceData: InvoiceData;
}

const MinimalTemplate: React.FC<TemplateProps> = ({ invoiceData }) => {
  const currencySymbol = getCurrencySymbol(invoiceData.currency);

  return (
    <div id="invoice-content" className="p-8 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b">
        <div>
          {invoiceData.companyLogo && (
            <img
              src={invoiceData.companyLogo}
              alt="Company Logo"
              className="h-16 mb-3"
            />
          )}
          <h1 className="text-2xl font-light text-gray-800">{invoiceData.companyName || 'Your Company'}</h1>
          <div className="text-xs text-gray-500 mt-2 space-y-0.5">
            <p className="whitespace-pre-line">{invoiceData.companyAddress}</p>
            <p>{invoiceData.companyPhone} | {invoiceData.companyEmail}</p>
            {invoiceData.companyWebsite && <p>{invoiceData.companyWebsite}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-light text-gray-800">Invoice</h2>
          <p className="text-gray-500 text-sm mt-1">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs uppercase text-gray-400 mb-2">Bill To</p>
          <div className="text-gray-700 text-sm">
            <p className="font-medium">{invoiceData.clientName}</p>
            <p className="text-xs whitespace-pre-line">{invoiceData.clientAddress}</p>
            <p className="text-xs">{invoiceData.clientEmail}</p>
            <p className="text-xs">{invoiceData.clientPhone}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="space-y-1 text-sm">
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Invoice Date:</span>
              <span className="text-gray-700">{invoiceData.invoiceDate}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Due Date:</span>
              <span className="text-gray-700">{invoiceData.dueDate}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-400">Currency:</span>
              <span className="text-gray-700">{invoiceData.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-0 text-left text-gray-400 font-normal text-xs uppercase">Description</th>
              <th className="py-2 px-0 text-center text-gray-400 font-normal text-xs uppercase">Qty</th>
              <th className="py-2 px-0 text-right text-gray-400 font-normal text-xs uppercase">Rate</th>
              <th className="py-2 px-0 text-right text-gray-400 font-normal text-xs uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3 px-0 text-gray-700">{item.description}</td>
                <td className="py-3 px-0 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 px-0 text-right text-gray-700">
                  {currencySymbol}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-0 text-right text-gray-700">
                  {currencySymbol}{item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-72 text-sm">
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700">
              {currencySymbol}{invoiceData.subtotal.toFixed(2)}
            </span>
          </div>
          {invoiceData.discount > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">Discount</span>
              <span className="text-gray-700">
                -{currencySymbol}{invoiceData.discount.toFixed(2)}
              </span>
            </div>
          )}
          {invoiceData.shippingCost > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">
                Shipping {invoiceData.shippingDetails && `(${invoiceData.shippingDetails})`}
              </span>
              <span className="text-gray-700">
                {currencySymbol}{invoiceData.shippingCost.toFixed(2)}
              </span>
            </div>
          )}
          {invoiceData.tax > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-700">
                {currencySymbol}{invoiceData.tax.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2.5 border-t border-gray-800 mt-2">
            <span className="font-medium text-gray-800">Total</span>
            <span className="font-medium text-gray-800">
              {currencySymbol}{invoiceData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4 text-sm">
        {invoiceData.paymentInstructions && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-1">Payment Instructions</h3>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoiceData.paymentInstructions}</p>
          </div>
        )}

        {invoiceData.termsAndConditions && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-1">Terms & Conditions</h3>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoiceData.termsAndConditions}</p>
          </div>
        )}

        {invoiceData.notes && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-1">Notes</h3>
            <p className="text-gray-600 text-xs whitespace-pre-line">{invoiceData.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {invoiceData.footerMessage && (
        <div className="text-center mt-8 pt-4 border-t">
          <p className="text-xs text-gray-400">{invoiceData.footerMessage}</p>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
