import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Info, DollarSign } from 'lucide-react';

const CommissionCalculator = ({ basePrice, onCommissionCalculated }) => {
  const [commission, setCommission] = useState(0);
  const [commissionRate, setCommissionRate] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const calculateCommission = (price) => {
    let rate = 0;
    if (price < 10000) {
      rate = 0.10; // 10%
    } else if (price < 30000) {
      rate = 0.08; // 8%
    } else {
      rate = 0.06; // 6%
    }
    
    const commissionAmount = price * rate;
    const total = price + commissionAmount;
    
    setCommissionRate(rate);
    setCommission(commissionAmount);
    setFinalPrice(total);
    
    if (onCommissionCalculated) {
      onCommissionCalculated({
        basePrice: price,
        commission: commissionAmount,
        rate: rate,
        finalPrice: total
      });
    }
  };

  useEffect(() => {
    if (basePrice > 0) {
      calculateCommission(basePrice);
    }
  }, [basePrice]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getCommissionTier = (price) => {
    if (price < 10000) return { tier: 'Bronze', color: 'from-orange-500 to-red-500', rate: '10%' };
    if (price < 30000) return { tier: 'Silver', color: 'from-gray-400 to-gray-600', rate: '8%' };
    return { tier: 'Gold', color: 'from-yellow-400 to-yellow-600', rate: '6%' };
  };

  const tierInfo = getCommissionTier(basePrice);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Calcul Commission</h3>
          <p className="text-sm text-gray-600">Barème automatique selon le prix</p>
        </div>
      </div>

      {basePrice > 0 && (
        <div className="space-y-4">
          {/* Tier Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Niveau tarifaire</span>
            <div className={`px-4 py-2 bg-gradient-to-r ${tierInfo.color} text-white rounded-2xl text-sm font-bold`}>
              {tierInfo.tier} - {tierInfo.rate}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Prix vendeur</span>
              <span className="font-semibold">{formatPrice(basePrice)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 bg-blue-50 rounded-xl px-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 font-medium">Commission plateforme ({(commissionRate * 100).toFixed(0)}%)</span>
              </div>
              <span className="font-bold text-blue-600">+{formatPrice(commission)}</span>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Prix final client</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Commission Tiers Info */}
          <div className="bg-gray-50 rounded-2xl p-4 mt-6">
            <div className="flex items-start space-x-2 mb-3">
              <Info className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Barème des commissions</h4>
                <div className="text-xs text-gray-600 space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span>Moins de 10 000 FCFA</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10 000 - 30 000 FCFA</span>
                    <span className="font-medium">8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plus de 30 000 FCFA</span>
                    <span className="font-medium">6%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionCalculator;