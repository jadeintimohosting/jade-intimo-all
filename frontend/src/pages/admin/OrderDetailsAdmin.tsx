import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  User, 
  MapPin, 
  CreditCard, 
  Package, 
  Clock, 
  Truck, 
  XCircle,
  Save,
  CheckCircle,
  RefreshCw // Adăugat pentru iconița de Update Status
} from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const OrderDetailsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States pentru update status
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  // Fetch Order Details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token'); 
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/order/admin/${id}`, {
          method: 'GET',
          headers: headers,
          credentials: "include"
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Neautorizat.");
          if (response.status === 404) throw new Error("Comanda nu a fost găsită.");
          throw new Error('Nu s-au putut prelua detaliile comenzii.');
        }
        
        const data = await response.json();
        setOrder(data);
        setSelectedStatus(data.status); 

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // Update Status Logic
  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/order/admin/${id}`, {
        method: 'PATCH',
        headers: headers,
        credentials: "include",
        body: JSON.stringify({ status: selectedStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la actualizarea statusului.');
      }

      setUpdateMessage('Statusul a fost actualizat cu succes!');
      setOrder(prev => ({ ...prev, status: selectedStatus })); 
      
      setTimeout(() => setUpdateMessage(null), 3000);

    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Helpers
  const formatPrice = (cents) => (cents / 100).toFixed(2);
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full"><Clock size={16} /> În Așteptare</span>;
      case 'shipping':
        return <span className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"><Truck size={16} /> Expediată</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1.5 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full"><XCircle size={16} /> Anulată</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Se încarcă detaliile comenzii...</p>
        </div>
      </div>
    );
  }

  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium text-lg mb-4">{error || "Comanda nu există."}</p>
          <Link to="/admin/orders" className="text-blue-600 hover:underline inline-flex items-center gap-1"><ArrowLeft size={16}/> Înapoi la comenzi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER & BACK BUTTON */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => navigate('/admin/orders')}
              className="mt-1 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 shadow-sm"
              title="Înapoi la listă"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Comanda #{order.id}</h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-muted-foreground text-sm mt-1 text-gray-500">
                Plasată pe {formatDate(order.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 font-medium">Eroare</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {updateMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <p className="font-medium">{updateMessage}</p>
          </motion.div>
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN (Items & Status) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STATUS UPDATE CARD */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <RefreshCw size={20} className="text-gray-400" /> 
                Actualizare Status
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <select 
                  className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none w-full sm:w-64 font-medium text-gray-700"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="pending">În Așteptare (Pending)</option>
                  <option value="shipping">Expediată (Shipping)</option>
                  <option value="cancelled">Anulată (Cancelled)</option>
                </select>
                
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || selectedStatus === order.status}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shadow-sm"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Salvează Modificarea
                </button>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-gray-400" /> 
                Produse Comandate ({order.items?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={item.id || index} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="h-20 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">Fără Img</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                      
                      {/* --- AICI ESTE ADĂUGAT CODUL PRODUSULUI --- */}
                      {item.cod && (
                        <p className="text-xs text-gray-500 font-mono mt-0.5 mb-1.5 flex items-center gap-1.5">
                          Cod: <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-700 tracking-wide">{item.cod}</span>
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500">Mărime: <span className="font-semibold text-gray-700">{item.size}</span></p>
                        <span className="text-gray-300 text-xs">•</span>
                        <p className="text-sm text-gray-500">Cantitate: <span className="font-semibold text-gray-700">{item.quantity}</span></p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(item.price)} RON</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-500 mt-1">Total: {formatPrice(item.price * item.quantity)} RON</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Customer, Address, Summary) */}
          <div className="space-y-6">
            
            {/* CUSTOMER INFO */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-gray-400" /> Client
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Nume Complet</p>
                  <p className="font-medium text-gray-900">{order.first_name} {order.last_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <a href={`mailto:${order.email}`} className="font-medium text-blue-600 hover:underline">{order.email}</a>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">User ID</p>
                  <p className="font-medium text-gray-900">{order.user_id}</p>
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" /> Adresă Livrare
              </h2>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p className="font-medium text-gray-900">{order.first_name} {order.last_name}</p>
                <p>{order.address_line}</p>
                <p>{order.city}, {order.state} {order.postal_code}</p>
                <p className="font-medium pt-1">{order.country}</p>
              </div>
            </div>

            {/* PAYMENT SUMMARY */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} className="text-gray-400" /> Sumar Plată
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal produse</span>
                  <span>{formatPrice(order.total_ammount)} RON</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Cost Livrare</span>
                  <span>{formatPrice(order.shipping_cost || 0)} RON</span>
                </div>
                
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total General</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatPrice(order.total_ammount + (order.shipping_cost || 0))} RON
                  </span>
                </div>
              </div>

              {order.stripe_payment_id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">ID Plată Stripe</p>
                  <p className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-200 break-all text-gray-700">
                    {order.stripe_payment_id}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsAdmin;