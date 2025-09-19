import React, { useState } from 'react';
import { Server, Wifi, WifiOff } from 'lucide-react';

interface VendorModeSelectorProps {
  onModeChange: (mode: 'online' | 'offline') => void;
  currentMode: 'online' | 'offline';
}

const VendorModeSelector: React.FC<VendorModeSelectorProps> = ({ onModeChange, currentMode }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Mode d'affichage :</span>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onModeChange('online')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'online'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wifi className="h-4 w-4" />
              <span>En ligne</span>
            </button>
            
            <button
              onClick={() => onModeChange('offline')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'offline'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <WifiOff className="h-4 w-4" />
              <span>Hors ligne</span>
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {currentMode === 'online' ? (
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Backend requis</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Données de démo</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorModeSelector;
