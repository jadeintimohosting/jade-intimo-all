import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Search, 
  Eye,
  Clock,     // Adăugat pentru iconița de status
  Truck,     // Adăugat pentru iconița de status
  XCircle    // Adăugat pentru iconița de status
} from 'lucide-react';

const API_URL = `/api`;

const OrderListAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filters (FĂRĂ status)
  const [searchEmail, setSearchEmail] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, limit, searchEmail, searchOrderId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      if (searchEmail) params.append('email', searchEmail);
      if (searchOrderId) params.append('orderId', searchOrderId);

      const token = localStorage.getItem('token'); 
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/order/admin?${params.toString()}`, {
        method: 'GET',
        headers: headers,
        credentials: "include"
      });

      if (!response.ok) {
          if (response.status === 401) throw new Error("Neautorizat. Te rog autentifică-te.");
          throw new Error('Nu s-au putut prelua comenzile');
      }
      
      const data = await response.json();
      setOrders(data);

      if (data.length === limit) {
        setTotalPages(currentPage + 1);
      } else {
        setTotalPages(currentPage); 
      }

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchEmail('');
    setSearchOrderId('');
    setCurrentPage(1);
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  // --- Funcția adăugată pentru designul statusului ---
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full w-max"><Clock size={12} /> În Așteptare</span>;
      case 'shipping':
        return <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full w-max"><Truck size={12} /> Expediată</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full w-max"><XCircle size={12} /> Anulată</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full w-max">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Comenzi</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestionează și urmărește comenzile plasate.
          </p>
        </div>

        {/* SEARCH & FILTERS TOOLBAR */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
              <label className="text-xs font-medium text-gray-500">ID Comandă</label>
              <input 
                type="text"
                placeholder="#123"
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full"
                value={searchOrderId}
                onChange={(e) => { setSearchOrderId(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
              <label className="text-xs font-medium text-gray-500">Email Client</label>
              <input 
                type="email"
                placeholder="client@email.com"
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full"
                value={searchEmail}
                onChange={(e) => { setSearchEmail(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {(searchEmail || searchOrderId) && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition h-[38px] w-full md:w-auto"
              >
                Resetează
              </button>
            )}
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 font-medium">Eroare la încărcarea comenzilor</p>
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        )}

        {/* TABLE CONTENT */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Se încarcă lista de comenzi...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-4">ID</th>
                        <th scope="col" className="px-6 py-4">Client</th>
                        <th scope="col" className="px-6 py-4">Data</th>
                        {/* --- Coloana pentru Status adăugată aici --- */}
                        <th scope="col" className="px-6 py-4">Status</th>
                        <th scope="col" className="px-6 py-4">Total</th>
                        <th scope="col" className="px-6 py-4 text-right">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">{order.first_name} {order.last_name}</span>
                              <span className="text-xs text-gray-500">{order.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {formatDate(order.created_at)}
                          </td>
                          {/* --- Celula pentru Status adăugată aici --- */}
                          <td className="px-6 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            {formatPrice(order.total_ammount + order.shipping_cost)} <span className="text-xs font-normal text-gray-500">RON</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              to={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              <Eye size={14} /> Detalii
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <Search size={24} />
                    </div>
                    <p className="text-lg font-medium">Nu s-au găsit comenzi</p>
                    <p className="text-sm">Încearcă să ajustezi parametrii de căutare.</p>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {orders.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
                <p className="text-sm text-gray-500">
                    Pagina <span className="font-medium">{currentPage}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderListAdmin;