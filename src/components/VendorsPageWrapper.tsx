import React, { useState } from 'react';
import VendorsPage from './VendorsPage';
import VendorsPageOffline from './VendorsPageOffline';
import VendorModeSelector from './VendorModeSelector';

interface VendorsPageWrapperProps {
  onBack: () => void;
}

const VendorsPageWrapper: React.FC<VendorsPageWrapperProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'online' | 'offline'>('offline');

  return (
    <div>
      <VendorModeSelector 
        currentMode={mode} 
        onModeChange={setMode} 
      />
      
      {mode === 'online' ? (
        <VendorsPage onBack={onBack} />
      ) : (
        <VendorsPageOffline onBack={onBack} />
      )}
    </div>
  );
};

export default VendorsPageWrapper;
