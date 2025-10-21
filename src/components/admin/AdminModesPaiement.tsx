import React, { useState, useEffect } from 'react';
import modePaiementService, { 
  ModePaiement, 
  ModePaiementCreate, 
  TypePaiement, 
  Environnement 
} from '../../services/modePaiementService';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  Settings, 
  ArrowUp, 
  ArrowDown,
  Check,
  X,
  Save
} from 'lucide-react';

const AdminModesPaiement: React.FC = () => {
  const [modesPaiement, setModesPaiement] = useState<ModePaiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingMode, setEditingMode] = useState<ModePaiement | null>(null);
  const [configMode, setConfigMode] = useState<ModePaiement | null>(null);
  const [formData, setFormData] = useState<Partial<ModePaiementCreate>>({
    nom: '',
    code: '',
    type: TypePaiement.CARTE_BANCAIRE,
    actif: true,
    ordre: 0,
    environnement: Environnement.PRODUCTION,
    fraisPourcentage: 0,
    fraisFixe: 0
  });
  const [configData, setConfigData] = useState<string>('');

  useEffect(() => {
    loadModesPaiement();
  }, []);

  const loadModesPaiement = async () => {
    try {
      setLoading(true);
      const data = await modePaiementService.getAllModesPaiement();
      setModesPaiement(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des modes de paiement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: TypePaiement) => {
    switch (type) {
      case TypePaiement.CARTE_BANCAIRE:
        return <CreditCard className="w-5 h-5" />;
      case TypePaiement.MOBILE_MONEY:
        return <Smartphone className="w-5 h-5" />;
      case TypePaiement.VIREMENT_BANCAIRE:
        return <Building2 className="w-5 h-5" />;
      case TypePaiement.CASH:
        return <DollarSign className="w-5 h-5" />;
      case TypePaiement.PORTEFEUILLE:
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMode) {
        await modePaiementService.updateModePaiement(editingMode.id, formData);
      } else {
        await modePaiementService.createModePaiement(formData as ModePaiementCreate);
      }
      setShowModal(false);
      setEditingMode(null);
      resetForm();
      loadModesPaiement();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleToggleActif = async (id: number, actif: boolean) => {
    try {
      await modePaiementService.toggleActif(id, !actif);
      loadModesPaiement();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mode de paiement ?')) {
      try {
        await modePaiementService.deleteModePaiement(id);
        loadModesPaiement();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleUpdateConfig = async () => {
    if (!configMode) return;
    
    try {
      await modePaiementService.updateConfiguration(configMode.id, {
        modePaiementId: configMode.id,
        configuration: configData
      });
      setShowConfigModal(false);
      setConfigMode(null);
      setConfigData('');
      alert('Configuration mise à jour avec succès');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la mise à jour de la configuration');
    }
  };

  const openEditModal = (mode: ModePaiement) => {
    setEditingMode(mode);
    setFormData({
      nom: mode.nom,
      code: mode.code,
      type: mode.type,
      description: mode.description,
      logo: mode.logo,
      actif: mode.actif,
      instructions: mode.instructions,
      fraisPourcentage: mode.fraisPourcentage,
      fraisFixe: mode.fraisFixe,
      montantMinimum: mode.montantMinimum,
      montantMaximum: mode.montantMaximum,
      paysSupportes: mode.paysSupportes,
      delaiTraitement: mode.delaiTraitement,
      ordre: mode.ordre,
      environnement: mode.environnement
    });
    setShowModal(true);
  };

  const openConfigModal = (mode: ModePaiement) => {
    setConfigMode(mode);
    setConfigData('{\n  "apiKey": "",\n  "merchantId": "",\n  "webhookUrl": ""\n}');
    setShowConfigModal(true);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      type: TypePaiement.CARTE_BANCAIRE,
      actif: true,
      ordre: 0,
      environnement: Environnement.PRODUCTION,
      fraisPourcentage: 0,
      fraisFixe: 0
    });
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...modesPaiement];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    const orderedIds = newOrder.map(m => m.id);
    try {
      await modePaiementService.reorderModesPaiement(orderedIds);
      loadModesPaiement();
    } catch (err: any) {
      alert('Erreur lors de la réorganisation');
    }
  };

  const moveDown = async (index: number) => {
    if (index === modesPaiement.length - 1) return;
    const newOrder = [...modesPaiement];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const orderedIds = newOrder.map(m => m.id);
    try {
      await modePaiementService.reorderModesPaiement(orderedIds);
      loadModesPaiement();
    } catch (err: any) {
      alert('Erreur lors de la réorganisation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Modes de Paiement</h1>
          <p className="text-gray-600 mt-2">Gérez les modes de paiement disponibles sur votre plateforme</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingMode(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouveau Mode
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mode de Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frais
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Env.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modesPaiement.map((mode, index) => (
              <tr key={mode.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{mode.ordre}</span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === modesPaiement.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                      {getTypeIcon(mode.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{mode.nom}</div>
                      <div className="text-sm text-gray-500">{mode.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {mode.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mode.fraisPourcentage ? `${mode.fraisPourcentage}%` : ''} 
                  {mode.fraisFixe ? ` + ${mode.fraisFixe} XOF` : ''}
                  {!mode.fraisPourcentage && !mode.fraisFixe ? 'Gratuit' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    mode.environnement === Environnement.PRODUCTION 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mode.environnement}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActif(mode.id, mode.actif)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      mode.actif 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {mode.actif ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {mode.actif ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openConfigModal(mode)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Configuration"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(mode)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Modifier"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(mode.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de création/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingMode ? 'Modifier le Mode de Paiement' : 'Nouveau Mode de Paiement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TypePaiement })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {Object.values(TypePaiement).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Environnement *
                  </label>
                  <select
                    required
                    value={formData.environnement}
                    onChange={(e) => setFormData({ ...formData, environnement: e.target.value as Environnement })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {Object.values(Environnement).map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions || ''}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frais (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fraisPourcentage || 0}
                    onChange={(e) => setFormData({ ...formData, fraisPourcentage: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frais fixe (XOF)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fraisFixe || 0}
                    onChange={(e) => setFormData({ ...formData, fraisFixe: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={formData.ordre || 0}
                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant minimum
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.montantMinimum || ''}
                    onChange={(e) => setFormData({ ...formData, montantMinimum: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant maximum
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.montantMaximum || ''}
                    onChange={(e) => setFormData({ ...formData, montantMaximum: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Actif
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingMode(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de configuration */}
      {showConfigModal && configMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              Configuration - {configMode.nom}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration JSON
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Entrez la configuration au format JSON (API keys, merchant ID, etc.)
                </p>
                <textarea
                  value={configData}
                  onChange={(e) => setConfigData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  rows={10}
                  placeholder='{\n  "apiKey": "votre_cle_api",\n  "merchantId": "votre_merchant_id",\n  "webhookUrl": "https://..."\n}'
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    setConfigMode(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateConfig}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer la Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModesPaiement;

