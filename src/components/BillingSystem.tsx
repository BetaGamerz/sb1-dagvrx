import React, { useState, useRef } from 'react';
import { Bill, BillItem, Design } from '../types';
import { FileText, Printer, Plus, Trash } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface BillingSystemProps {
  designs: Design[];
}

export default function BillingSystem({ designs }: BillingSystemProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentBill, setCurrentBill] = useState<Bill>({
    id: Date.now().toString(),
    billNumber: `BILL-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    items: [],
    gstPercentage: 18,
    subtotal: 0,
    gstAmount: 0,
    total: 0
  });
  const billRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      designNumber: '',
      quantity: 1,
      price: 0,
      amount: 0
    };
    setCurrentBill(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (index: number, field: keyof BillItem, value: string | number) => {
    const newItems = [...currentBill.items];
    const item = { ...newItems[index] };

    if (field === 'designNumber') {
      const design = designs.find(d => d.designNumber === value);
      if (design) {
        item.price = design.totalPrice;
      }
    }

    item[field] = value;
    item.amount = item.quantity * item.price;

    newItems[index] = item;
    
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = (subtotal * currentBill.gstPercentage) / 100;
    
    setCurrentBill(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      gstAmount,
      total: subtotal + gstAmount
    }));
  };

  const removeItem = (index: number) => {
    const newItems = currentBill.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = (subtotal * currentBill.gstPercentage) / 100;

    setCurrentBill(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      gstAmount,
      total: subtotal + gstAmount
    }));
  };

  const saveBill = () => {
    if (!currentBill.customerName || currentBill.items.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setBills(prev => [...prev, currentBill]);
    setCurrentBill({
      id: Date.now().toString(),
      billNumber: `BILL-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      items: [],
      gstPercentage: 18,
      subtotal: 0,
      gstAmount: 0,
      total: 0
    });
    toast.success('Bill saved successfully!');
  };

  const printBill = async () => {
    if (!billRef.current) return;

    try {
      const canvas = await html2canvas(billRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${currentBill.billNumber}.pdf`);
      toast.success('Bill exported to PDF');
    } catch (error) {
      toast.error('Error generating PDF');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div ref={billRef} className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Invoice</h2>
            <p className="text-gray-600">Bill No: {currentBill.billNumber}</p>
          </div>
          <div className="text-right">
            <input
              type="date"
              value={currentBill.date}
              onChange={(e) => setCurrentBill(prev => ({ ...prev, date: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            value={currentBill.customerName}
            onChange={(e) => setCurrentBill(prev => ({ ...prev, customerName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <table className="min-w-full divide-y divide-gray-200 mb-6">
          <thead>
            <tr>
              <th className="px-4 py-2">Design No.</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBill.items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-2">
                  <select
                    value={item.designNumber}
                    onChange={(e) => updateItem(index, 'designNumber', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Design</option>
                    {designs.map(design => (
                      <option key={design.id} value={design.designNumber}>
                        {design.designNumber}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2">${item.amount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="mb-6 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </button>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${currentBill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>GST:</span>
            <div className="flex items-center">
              <input
                type="number"
                value={currentBill.gstPercentage}
                onChange={(e) => {
                  const gstPercentage = parseFloat(e.target.value);
                  const gstAmount = (currentBill.subtotal * gstPercentage) / 100;
                  setCurrentBill(prev => ({
                    ...prev,
                    gstPercentage,
                    gstAmount,
                    total: prev.subtotal + gstAmount
                  }));
                }}
                className="w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mr-2"
              />
              <span>% (${currentBill.gstAmount.toFixed(2)})</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${currentBill.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={saveBill}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FileText className="h-4 w-4 mr-2" /> Save Bill
        </button>
        <button
          onClick={printBill}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          <Printer className="h-4 w-4 mr-2" /> Print Bill
        </button>
      </div>
    </div>
  );
}