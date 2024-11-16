import React, { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';
import { Design } from './types';
import DesignForm from './components/DesignForm';
import DesignList from './components/DesignList';
import LoginModal from './components/LoginModal';
import ImageSearch from './components/ImageSearch';
import BillingSystem from './components/BillingSystem';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function Dashboard() {
  const [designs, setDesigns] = useState<Design[]>(() => {
    const saved = localStorage.getItem('designs');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem('designs', JSON.stringify(designs));
  }, [designs]);

  const handleAddDesign = (design: Design) => {
    setDesigns([design, ...designs]);
    setShowForm(false);
  };

  const handleDeleteDesign = (id: string) => {
    setDesigns(designs.filter(design => design.id !== id));
  };

  const handleImageSearchResult = (designNumber: string) => {
    setSearchTerm(designNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Design Management</h1>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setShowBilling(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {showForm ? 'Cancel' : 'Add New Design'}
                </button>
                <button
                  onClick={() => {
                    setShowBilling(!showBilling);
                    setShowForm(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  {showBilling ? 'View Designs' : 'Billing System'}
                </button>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdmin && <LoginModal />}
        
        {showForm && (
          <div className="mb-8">
            <DesignForm onSubmit={handleAddDesign} />
          </div>
        )}

        {showBilling && isAdmin ? (
          <BillingSystem designs={designs} />
        ) : (
          <>
            <ImageSearch onDesignNumberFound={handleImageSearchResult} />
            <DesignList
              designs={designs}
              onDelete={handleDeleteDesign}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}