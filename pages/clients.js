import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Clients() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
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
    await loadClients(user.id);
    setLoading(false);
  };

  const loadClients = async (userId) => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement clients:', error);
    } else {
      setClients(data || []);
    }
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: client.address || '',
        notes: client.notes || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Le nom du client est obligatoire');
      return;
    }

    try {
      if (editingClient) {
        // Mise à jour
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', editingClient.id);

        if (error) throw error;
        alert('Client mis à jour avec succès !');
      } else {
        // Création
        const { error } = await supabase
          .from('clients')
          .insert([{
            ...formData,
            user_id: user.id,
          }]);

        if (error) throw error;
        alert('Client créé avec succès !');
      }

      handleCloseModal();
      await loadClients(user.id);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue : ' + error.message);
    }
  };

  const handleDelete = async (clientId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      alert('Client supprimé avec succès !');
      await loadClients(user.id);
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    }
  };

  const handleToggleActive = async (client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ is_active: !client.is_active })
        .eq('id', client.id);

      if (error) throw error;

      await loadClients(user.id);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur : ' + error.message);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Clients</h1>
            <p className="text-slate-600">{clients.length} client{clients.length > 1 ? 's' : ''} au total</p>
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
              + Nouveau client
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Liste des clients */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-slate-600 mb-4">
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client pour le moment'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-block px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition"
              >
                Créer mon premier client
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:border-amber-500 transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-bold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{client.name}</h3>
                      {client.company && (
                        <p className="text-sm text-slate-500">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(client)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      client.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {client.is_active ? 'Actif' : 'Inactif'}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {client.phone}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(client)}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
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

      {/* Modal Créer/Modifier Client */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingClient ? 'Modifier le client' : 'Nouveau client'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                  placeholder="Notes internes sur ce client..."
                />
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
                  {editingClient ? 'Mettre à jour' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
