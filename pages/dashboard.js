import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    overdueRevenue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [subscription, setSubscription] = useState(null);

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
    
    // Récupérer l'abonnement
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    if (userData) {
      if (userData.is_premium) {
        setSubscription('Premium');
      } else if (userData.remaining_uses && userData.remaining_uses > 0) {
        setSubscription('Pro');
      } else {
        setSubscription(null);
      }
    }

    await loadDashboardData(user.id);
    setLoading(false);
  };

  const loadDashboardData = async (userId) => {
    try {
      // Charger les clients
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId);

      // Charger les factures
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (clients && invoices) {
        const now = new Date();
        const overdueInvoices = invoices.filter(
          inv => inv.status !== 'paid' && new Date(inv.due_date) < now
        );
        const paidInvoices = invoices.filter(inv => inv.status === 'paid');

        setStats({
          totalClients: clients.length,
          activeClients: clients.filter(c => c.is_active).length,
          totalInvoices: invoices.length,
          paidInvoices: paidInvoices.length,
          overdueInvoices: overdueInvoices.length,
          totalRevenue: paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
          pendingRevenue: invoices
            .filter(inv => inv.status === 'sent')
            .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
          overdueRevenue: overdueInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
        });

        setRecentInvoices(invoices.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'sent': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      default: return status;
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Bienvenue {user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/clients"
              className="px-6 py-2 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-amber-500 transition"
            >
              Clients
            </Link>
            <Link
              href="/invoices"
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              + Nouvelle facture
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-600">Clients</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalClients}</p>
            <p className="text-sm text-slate-500 mt-1">{stats.activeClients} actifs</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-600">Chiffre d'affaires</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalRevenue.toFixed(2)}€</p>
            <p className="text-sm text-slate-500 mt-1">{stats.paidInvoices} factures payées</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-600">En attente</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.pendingRevenue.toFixed(2)}€</p>
            <p className="text-sm text-slate-500 mt-1">{stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices} factures</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-600">En retard</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.overdueRevenue.toFixed(2)}€</p>
            <p className="text-sm text-slate-500 mt-1">{stats.overdueInvoices} factures</p>
          </div>
        </div>

        {/* Factures récentes */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Factures récentes</h2>
            <Link
              href="/invoices"
              className="text-amber-500 hover:text-amber-600 font-semibold text-sm"
            >
              Voir tout →
            </Link>
          </div>
          
          {recentInvoices.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-600 mb-4">Aucune facture pour le moment</p>
              <Link
                href="/invoices/new"
                className="inline-block px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition"
              >
                Créer ma première facture
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">N° Facture</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Montant</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Échéance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Statut</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-4 px-4 font-semibold text-slate-900">{invoice.invoice_number}</td>
                      <td className="py-4 px-4 text-slate-700">Client #{invoice.client_id?.substring(0, 8)}</td>
                      <td className="py-4 px-4 font-semibold text-slate-900">{parseFloat(invoice.total_amount).toFixed(2)}€</td>
                      <td className="py-4 px-4 text-slate-600">
                        {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="text-amber-500 hover:text-amber-600 font-semibold text-sm"
                        >
                          Voir →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Abonnement */}
        {!subscription && (
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">🚀 Passez à la vitesse supérieure</h3>
            <p className="mb-6 text-amber-100">
              Débloquez toutes les fonctionnalités pour gérer vos clients et factures efficacement
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-bold hover:bg-amber-50 transition"
            >
              Voir les formules
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
