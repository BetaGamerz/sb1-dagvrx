import React from 'react';
import { Search, Edit, Trash } from 'lucide-react';
import { Design } from '../types';
import { useAuth } from '../context/AuthContext';

interface DesignListProps {
  designs: Design[];
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function DesignList({ designs, onDelete, searchTerm, onSearchChange }: DesignListProps) {
  const { isAdmin } = useAuth();

  const filteredDesigns = designs.filter(design =>
    design.designNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by Design Number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDesigns.map((design) => (
          <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={design.image}
              alt={`Design ${design.designNumber}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Design {design.designNumber}</h3>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onDelete(design.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Cutting Size:</strong> {design.cuttingSize}</p>
                
                <div>
                  <strong>Fabrics:</strong>
                  <ul className="ml-4">
                    {design.fabrics.map((fabric, index) => (
                      <li key={index}>
                        {fabric.type}: {fabric.usage}m @ ${fabric.pricePerMeter}/m
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Materials:</strong>
                  <ul className="ml-4">
                    {design.materials.map((material, index) => (
                      <li key={index}>
                        {material.name}: {material.quantity} - ${material.price}
                      </li>
                    ))}
                  </ul>
                </div>

                {isAdmin && (
                  <p className="text-lg font-semibold text-indigo-600 mt-4">
                    Total Price: ${design.totalPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDesigns.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No designs found matching your search.
        </div>
      )}
    </div>
  );
}