import React, { useState, useEffect } from 'react';
import {
  Percent,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calculator,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Save
} from 'lucide-react';
import commissionService, { Commission } from '../../services/commissionService';

const AdminCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Calculatrice
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState<string>('');
  const [calculatorResult, setCalculatorResult] = useState<{ montant: number; commission: number; total: number } | null>(null);

  const [commissionForm, setCommissionForm] = useState({
    seuilMin: 0,
    seuilMax: null as number | null,
    pourcentage: 0,
    description: '',
    active: true,
    ordre: 0
  });

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    setLoading(true);
    try {
      const data = await commissionService.getAllCommissions();
      setCommissions(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du chargement des commissions' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await commissionService.createCommission(commissionForm);
      setMessage({ type: 'success', text: 'Tranche créée avec succès' });
      setShowModal(false);
      resetForm();
      loadCommissions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création de la tranche' });
    }
  };

  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommission) return;
    try {
      await commissionService.updateCommission(selectedCommission.id!, commissionForm);
      setMessage({ type: 'success', text: 'Tranche modifiée avec succès' });
      setShowModal(false);
      resetForm();
      loadCommissions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification de la tranche' });
    }
  };

  const handleDeleteCommission = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tranche ?')) return;
    try {
      await commissionService.deleteCommission(id);
      setMessage({ type: 'success', text: 'Tranche supprimée avec succès' });
      loadCommissions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression de la tranche' });
    }
  };

  const handleToggleActive = async (commission: Commission) => {
    try {
      if (commission.active) {
        await commissionService.deactivateCommission(commission.id!);
        setMessage({ type: 'success', text: 'Tranche désactivée' });
      } else {
        await commissionService.activateCommission(commission.id!);
        setMessage({ type: 'success', text: 'Tranche activée' });
      }
      loadCommissions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du changement de statut' });
    }
  };

  const handleInitializeDefault = async () => {
    if (!confirm('Initialiser les tranches par défaut ? Ceci créera 4 tranches si aucune n\'existe.')) return;
    try {
      await commissionService.initializeDefaultCommissions();
      setMessage({ type: 'success', text: 'Tranches par défaut initialisées' });
      loadCommissions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'initialisation' });
    }
  };

  const handleCalculate = async () => {
    const amount = parseFloat(calculatorAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Veuillez entrer un montant valide' });
      return;
    }
    try {
      const result = await commissionService.calculateCommission(amount);
      setCalculatorResult(result);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du calcul' });
    }
  };

  const resetForm = () => {
    setCommissionForm({
      seuilMin: 0,
      seuilMax: null,
      pourcentage: 0,
      description: '',
      active: true,
      ordre: 0
    });
    setEditMode(false);
    setSelectedCommission(null);
  };

  const openEditModal = (commission: Commission) => {
    setSelectedCommission(commission);
    setCommissionForm({
      seuilMin: commission.seuilMin,
      seuilMax: commission.seuilMax,
      pourcentage: commission.pourcentage,
      description: commission.description,
      active: commission.active,
      ordre: commission.ordre
    });
    setEditMode(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCommissionForm({
      ...commissionForm,
      ordre: commissions.length + 1
    });
    setShowModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Percent className="h-8 w-8 text-red-600" />
            <span>Gestion des Commissions</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Configurez les tranches de commission appliquées aux produits
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calculator className="h-5 w-5" />
            <span>Calculatrice</span>
          </button>
          <button
            onClick={handleInitializeDefault}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Initialiser</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle tranche</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Calculatrice */}
      {showCalculator && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span>Calculatrice de Commission</span>
            </h3>
            <button onClick={() => setShowCalculator(false)}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant du produit (FCFA)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 25000"
                />
                <button
                  onClick={handleCalculate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Calculer
                </button>
              </div>
            </div>
            {calculatorResult && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Montant :</span>
                    <span className="font-semibold">{formatCurrency(calculatorResult.montant)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Commission :</span>
                    <span className="font-semibold text-red-600">+{formatCurrency(calculatorResult.commission)}</span>
                  </div>
                  <div className="flex justify-between text-base border-t pt-2">
                    <span className="font-bold text-gray-900">Total :</span>
                    <span className="font-bold text-gray-900">{formatCurrency(calculatorResult.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tranches actives</p>
              <p className="text-3xl font-bold mt-2">{commissions.filter(c => c.active).length}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Taux moyen</p>
              <p className="text-3xl font-bold mt-2">
                {commissions.length > 0
                  ? (commissions.reduce((acc, c) => acc + c.pourcentage, 0) / commissions.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <Percent className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total tranches</p>
              <p className="text-3xl font-bold mt-2">{commissions.length}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Commission List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : commissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Percent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune tranche de commission</h3>
          <p className="text-gray-600 mb-4">Commencez par créer une tranche ou initialiser les valeurs par défaut</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleInitializeDefault}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Initialiser par défaut</span>
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Créer une tranche</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {commissions.map((commission) => (
            <div
              key={commission.id}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
                commission.active ? 'border-green-200 hover:shadow-md' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                      commission.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {commission.pourcentage}%
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{commission.description}</h3>
                    {!commission.active && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        Désactivée
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      <span className="font-semibold">Seuil min:</span> {formatCurrency(commission.seuilMin)}
                    </span>
                    <span>
                      <span className="font-semibold">Seuil max:</span>{' '}
                      {commission.seuilMax ? formatCurrency(commission.seuilMax) : 'Illimité'}
                    </span>
                    <span>
                      <span className="font-semibold">Ordre:</span> {commission.ordre}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(commission)}
                    className={`p-2 rounded-lg transition-colors ${
                      commission.active
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={commission.active ? 'Désactiver' : 'Activer'}
                  >
                    {commission.active ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => openEditModal(commission)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCommission(commission.id!)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editMode ? 'Modifier la tranche' : 'Nouvelle tranche de commission'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={editMode ? handleUpdateCommission : handleCreateCommission} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seuil minimum (FCFA) *</label>
                      <input
                        type="number"
                        value={commissionForm.seuilMin}
                        onChange={(e) => setCommissionForm({ ...commissionForm, seuilMin: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seuil maximum (FCFA)
                        <span className="text-gray-500 text-xs ml-2">(vide = illimité)</span>
                      </label>
                      <input
                        type="number"
                        value={commissionForm.seuilMax || ''}
                        onChange={(e) => setCommissionForm({ ...commissionForm, seuilMax: e.target.value ? Number(e.target.value) : null })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="0"
                        placeholder="Illimité"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pourcentage (%) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={commissionForm.pourcentage}
                        onChange={(e) => setCommissionForm({ ...commissionForm, pourcentage: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ordre d'application *</label>
                      <input
                        type="number"
                        value={commissionForm.ordre}
                        onChange={(e) => setCommissionForm({ ...commissionForm, ordre: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <input
                      type="text"
                      value={commissionForm.description}
                      onChange={(e) => setCommissionForm({ ...commissionForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      placeholder="Ex: Moins de 10 000 FCFA (+10%)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={commissionForm.active}
                      onChange={(e) => setCommissionForm({ ...commissionForm, active: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">
                      Tranche active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Save className="h-5 w-5" />
                      <span>{editMode ? 'Modifier' : 'Créer'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommissions;

