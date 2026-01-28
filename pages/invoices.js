import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Invoices() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    // Charger les factures
    const { data: invoicesData } = await supabase
      .from('invoices')
      .select('*, clients(name, email)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Charger les clients
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    setInvoices(invoicesData || []);
    setClients(clientsData || []);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-slate-100 text-slate-700';
      case 'cancelled': return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const updateInvoiceStatus = (invoice) => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') {
      return invoice.status;
    }
    
    const now = new Date();
    const dueDate = new Date(invoice.due_date);
    
    if (invoice.status === 'sent' && dueDate < now) {
      return 'overdue';
    }
    
    return invoice.status;
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;

      alert('Facture supprimée avec succès !');
      await loadData(user.id);
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', invoiceId);

      if (error) throw error;

      alert('Facture marquée comme payée !');
      await loadData(user.id);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const filteredInvoices = invoices
    .map(inv => ({ ...inv, status: updateInvoiceStatus(inv) }))
    .filter(invoice => {
      const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
      const matchesSearch = 
        invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.clients?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => updateInvoiceStatus(i) === 'sent').length,
    overdue: invoices.filter(i => updateInvoiceStatus(i) === 'overdue').length,
    paid: invoices.filter(i => i.status === 'paid').length,
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Factures</h1>
            <p className="text-slate-600">{invoices.length} facture{invoices.length > 1 ? 's' : ''} au total</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-amber-500 transition"
            >
              ← Dashboard
            </Link>
            <Link
              href="/invoices/new"
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              + Nouvelle facture
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'all'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600">Toutes</p>
          </button>

          <button
            onClick={() => setFilterStatus('draft')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'draft'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{stats.draft}</p>
            <p className="text-sm text-slate-600">Brouillons</p>
          </button>

          <button
            onClick={() => setFilterStatus('sent')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'sent'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{stats.sent}</p>
            <p className="text-sm text-slate-600">Envoyées</p>
          </button>

          <button
            onClick={() => setFilterStatus('overdue')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'overdue'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <p className="text-sm text-slate-600">En retard</p>
          </button>

          <button
            onClick={() => setFilterStatus('paid')}
            className={`p-4 rounded-lg border-2 transition ${
              filterStatus === 'paid'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 bg-white hover:border-amber-300'
            }`}
          >
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            <p className="text-sm text-slate-600">Payées</p>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une facture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Liste des factures */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-600 mb-4">
              {searchQuery || filterStatus !== 'all' ? 'Aucune facture trouvée' : 'Aucune facture pour le moment'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link
                href="/invoices/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition"
              >
                Créer ma première facture
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">N° Facture</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Client</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Montant</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Échéance</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Statut</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-4 px-6">
                        <Link href={`/invoices/${invoice.id}`} className="font-semibold text-slate-900 hover:text-amber-600">
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {invoice.clients?.name || 'Client inconnu'}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {parseFloat(invoice.total_amount).toFixed(2)}€
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                            <button
                              onClick={() => handleMarkAsPaid(invoice.id)}
                              className="text-green-600 hover:text-green-700 font-semibold text-sm"
                              title="Marquer comme payée"
                            >
                              ✓
                            </button>
                          )}
                          <Link
                            href={`/invoices/${invoice.id}`}
                            className="text-amber-500 hover:text-amber-600 font-semibold text-sm"
                          >
                            Voir
                          </Link>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
