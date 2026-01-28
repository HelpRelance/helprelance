import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Reminders() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    reminder_type: 'friendly',
    subject: '',
    body: '',
    days_after_due: 7,
    is_active: true,
  });

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    await loadData(user.id);
    setLoading(false);
  };

  const loadData = async (userId) => {
    // Charger les templates
    const { data: templatesData } = await supabase
      .from('reminder_templates')
      .select('*')
      .eq('user_id', userId)
      .order('days_after_due');

    // Charger les relances envoyées
    const { data: remindersData } = await supabase
      .from('reminders')
      .select('*, invoices(invoice_number, total_amount, clients(name))')
      .order('sent_at', { ascending: false })
      .limit(20);

    setTemplates(templatesData || []);
    setReminders(remindersData || []);
  };

  const reminderTypes = {
    friendly: { label: 'Amicale', color: 'bg-blue-100 text-blue-700' },
    firm: { label: 'Ferme', color: 'bg-amber-100 text-amber-700' },
    urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
    final: { label: 'Finale', color: 'bg-slate-900 text-white' },
  };

  const handleOpenModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        reminder_type: template.reminder_type,
        subject: template.subject,
        body: template.body,
        days_after_due: template.days_after_due,
        is_active: template.is_active,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        reminder_type: 'friendly',
        subject: '',
        body: '',
        days_after_due: 7,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('reminder_templates')
          .update(formData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        alert('Template mis à jour !');
      } else {
        const { error } = await supabase
          .from('reminder_templates')
          .insert([{
            ...formData,
            user_id: user.id,
          }]);

        if (error) throw error;
        alert('Template créé !');
      }

      handleCloseModal();
      await loadData(user.id);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm('Supprimer ce template ?')) return;

    try {
      const { error } = await supabase
        .from('reminder_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      alert('Template supprimé !');
      await loadData(user.id);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const handleToggleActive = async (template) => {
    try {
      const { error } = await supabase
        .from('reminder_templates')
        .update({ is_active: !template.is_active })
        .eq('id', template.id);

      if (error) throw error;
      await loadData(user.id);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur : ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Relances automatiques</h1>
            <p className="text-slate-600">Configurez vos emails de relance</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-amber-500 transition"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              + Nouveau template
            </button>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Comment ça fonctionne ?</h3>
              <p className="text-blue-800 text-sm">
                Les relances sont envoyées automatiquement selon vos templates. Utilisez les variables <code className="bg-blue-200 px-2 py-1 rounded">{'{{invoice_number}}'}</code>, <code className="bg-blue-200 px-2 py-1 rounded">{'{{client_name}}'}</code>, <code className="bg-blue-200 px-2 py-1 rounded">{'{{amount}}'}</code>, <code className="bg-blue-200 px-2 py-1 rounded">{'{{due_date}}'}</code> pour personnaliser vos messages.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Templates */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Templates de relance</h2>
            
            {templates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-600 mb-4">Aucun template configuré</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition"
                >
                  Créer mon premier template
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${reminderTypes[template.reminder_type].color}`}>
                          {reminderTypes[template.reminder_type].label}
                        </span>
                        <h3 className="font-bold text-slate-900">{template.name}</h3>
                      </div>
                      <button
                        onClick={() => handleToggleActive(template)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          template.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {template.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">
                      Envoyée <strong>{template.days_after_due} jours</strong> après l'échéance
                    </p>

                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Objet :</p>
                      <p className="text-sm text-slate-900">{template.subject}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(template)}
                        className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="px-4 py-2 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historique des relances */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Relances envoyées</h2>
            
            {reminders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-slate-600">Aucune relance envoyée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {reminder.invoices?.invoice_number}
                        </p>
                        <p className="text-sm text-slate-600">
                          {reminder.invoices?.clients?.name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${reminderTypes[reminder.reminder_type]?.color || 'bg-slate-100 text-slate-700'}`}>
                        {reminderTypes[reminder.reminder_type]?.label || reminder.reminder_type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{new Date(reminder.sent_at).toLocaleDateString('fr-FR')}</span>
                      <span className={`font-semibold ${
                        reminder.status === 'opened' ? 'text-green-600' :
                        reminder.status === 'clicked' ? 'text-blue-600' :
                        'text-slate-500'
                      }`}>
                        {reminder.status === 'sent' && '📧 Envoyée'}
                        {reminder.status === 'opened' && '✓ Ouverte'}
                        {reminder.status === 'clicked' && '🔗 Cliquée'}
                        {reminder.status === 'replied' && '💬 Réponse'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Créer/Modifier Template */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom du template *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type de relance *
                  </label>
                  <select
                    value={formData.reminder_type}
                    onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                    required
                  >
                    <option value="friendly">Amicale</option>
                    <option value="firm">Ferme</option>
                    <option value="urgent">Urgente</option>
                    <option value="final">Finale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Envoyée combien de jours après l'échéance ? *
                </label>
                <input
                  type="number"
                  value={formData.days_after_due}
                  onChange={(e) => setFormData({ ...formData, days_after_due: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Objet de l'email *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Ex: Rappel - Facture {{invoice_number}}"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Corps de l'email *
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows="8"
                  placeholder="Bonjour {{client_name}},&#10;&#10;Je me permets de vous contacter concernant la facture {{invoice_number}}..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none font-mono text-sm"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Variables disponibles : {'{{invoice_number}}'}, {'{{client_name}}'}, {'{{amount}}'}, {'{{due_date}}'}, {'{{user_name}}'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-amber-500 border-2 border-slate-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">
                  Activer ce template immédiatement
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-slate-300 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition"
                >
                  {editingTemplate ? 'Mettre à jour' : 'Créer le template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
