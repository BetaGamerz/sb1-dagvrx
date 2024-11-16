import React, { useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
import { Design, Fabric, Material } from '../types';
import toast from 'react-hot-toast';

interface DesignFormProps {
  onSubmit: (design: Design) => void;
}

export default function DesignForm({ onSubmit }: DesignFormProps) {
  const [designNumber, setDesignNumber] = useState('');
  const [image, setImage] = useState('');
  const [fabrics, setFabrics] = useState<Fabric[]>([{ type: '', usage: '', pricePerMeter: 0 }]);
  const [cuttingSize, setCuttingSize] = useState('');
  const [materials, setMaterials] = useState<Material[]>([{ name: '', price: 0, quantity: '' }]);
  const [notes, setNotes] = useState('');

  const addFabric = () => {
    setFabrics([...fabrics, { type: '', usage: '', pricePerMeter: 0 }]);
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: '', price: 0, quantity: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!designNumber || !image) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalPrice = fabrics.reduce((acc, fabric) => 
      acc + (fabric.pricePerMeter * parseFloat(fabric.usage || '0')), 0) +
      materials.reduce((acc, material) => acc + material.price, 0);

    const design: Design = {
      id: Date.now().toString(),
      designNumber,
      image,
      fabrics,
      cuttingSize,
      materials,
      totalPrice,
      createdAt: new Date().toISOString(),
      notes
    };

    onSubmit(design);
    toast.success('Design saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Design Number</label>
          <input
            type="text"
            value={designNumber}
            onChange={(e) => setDesignNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Fabrics</h3>
          <button
            type="button"
            onClick={addFabric}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Fabric
          </button>
        </div>
        {fabrics.map((fabric, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Fabric Type"
              value={fabric.type}
              onChange={(e) => {
                const newFabrics = [...fabrics];
                newFabrics[index].type = e.target.value;
                setFabrics(newFabrics);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              placeholder="Usage (meters)"
              type="number"
              value={fabric.usage}
              onChange={(e) => {
                const newFabrics = [...fabrics];
                newFabrics[index].usage = e.target.value;
                setFabrics(newFabrics);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              placeholder="Price per meter"
              type="number"
              value={fabric.pricePerMeter}
              onChange={(e) => {
                const newFabrics = [...fabrics];
                newFabrics[index].pricePerMeter = parseFloat(e.target.value);
                setFabrics(newFabrics);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cutting Size (inches)</label>
        <input
          type="text"
          value={cuttingSize}
          onChange={(e) => setCuttingSize(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Materials</h3>
          <button
            type="button"
            onClick={addMaterial}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Material
          </button>
        </div>
        {materials.map((material, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Material Name"
              value={material.name}
              onChange={(e) => {
                const newMaterials = [...materials];
                newMaterials[index].name = e.target.value;
                setMaterials(newMaterials);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              placeholder="Quantity"
              value={material.quantity}
              onChange={(e) => {
                const newMaterials = [...materials];
                newMaterials[index].quantity = e.target.value;
                setMaterials(newMaterials);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              placeholder="Price"
              type="number"
              value={material.price}
              onChange={(e) => {
                const newMaterials = [...materials];
                newMaterials[index].price = parseFloat(e.target.value);
                setMaterials(newMaterials);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Save className="h-4 w-4 mr-2" /> Save Design
      </button>
    </form>
  );
}