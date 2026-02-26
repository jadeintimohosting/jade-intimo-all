import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { toast } from 'sonner';

// --- HELPER FUNCTION: PAD AND GROUP DATA ---
const formatChartData = (rawData, rangeStr) => {
  const days = parseInt(rangeStr, 10);
  const interval = days === 30 ? 5 : days === 90 ? 15 : 1;
  
  const dataMap = rawData.reduce((acc, curr) => {
    acc[curr.date] = curr.orderCount;
    return acc;
  }, {});

  const allDates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split('T')[0]; 
    
    allDates.push({
      date: dateString,
      orderCount: dataMap[dateString] || 0,
      label: d.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' })
    });
  }

  if (interval === 1) {
    return allDates.map(item => ({ date: item.label, orderCount: item.orderCount }));
  }

  const groupedData = [];
  for (let i = 0; i < allDates.length; i += interval) {
    const chunk = allDates.slice(i, i + interval);
    const sum = chunk.reduce((total, item) => total + item.orderCount, 0);
    const startLabel = chunk[0].label;
    const endLabel = chunk[chunk.length - 1].label;
    const groupLabel = startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
    
    groupedData.push({
      date: groupLabel,
      orderCount: sum
    });
  }

  return groupedData;
};

const DashboardAdmin = () => {
  // Chart & Orders State
  const [timeRange, setTimeRange] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Low Stock State
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalLowStock, setTotalLowStock] = useState(0);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  // Pending Orders State
  const [pendingOrders, setPendingOrders] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  // Fetch Chart Data
  useEffect(() => {
    const fetchOrderEvolution = async () => {
      setIsLoadingChart(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/order-evolution/${timeRange}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Nu s-au putut încărca datele pentru grafic.');
        
        const data = await response.json();
        
        const formattedData = formatChartData(data.arr || data.data, timeRange);
        setTotalOrders(data.orders || data.totalOrders);
        setTotalRevenue(data.total || data.totalRevenue);
        setChartData(formattedData);
        
      } catch (error) {
        toast.error("Eroare la încărcarea graficului");
        console.error("Error fetching order evolution:", error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    fetchOrderEvolution();
  }, [timeRange]);

  // Fetch Low Stock Products
  useEffect(() => {
    const fetchLowStock = async () => {
      setIsLoadingStock(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/low-stock`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Nu s-au putut încărca alertele de stoc.');
        
        const data = await response.json();
        
        setLowStockItems(data.arr || data.items);
        setTotalLowStock(data.total);
        
      } catch (error) {
        toast.error("Eroare la încărcarea produselor cu stoc limitat");
        console.error("Error fetching low stock products:", error);
      } finally {
        setIsLoadingStock(false);
      }
    };

    fetchLowStock();
  }, []);

  // Fetch Pending Orders
  useEffect(() => {
    const fetchPendingOrders = async () => {
      setIsLoadingPending(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pending-orders`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Nu s-au putut încărca comenzile în așteptare.');
        
        const data = await response.json();
        
        setPendingOrders(data.arr);
        setTotalPending(data.total);
        
      } catch (error) {
        toast.error("Eroare la încărcarea comenzilor");
        console.error("Error fetching pending orders:", error);
      } finally {
        setIsLoadingPending(false);
      }
    };

    fetchPendingOrders();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bine ai venit înapoi! Iată ce se întâmplă în magazinul tău.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-md border border-border">
            Ultima actualizare: Azi, 14:30
          </span>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex justify-between flex-col gap-2">
            <h3 className="text-lg font-extrabold">Selectează perioada dorită</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-pink-500/20 cursor-pointer"
            >
              <option value="7">Ultimele 7 zile</option>
              <option value="30">Ultimele 30 zile</option>
              <option value="90">Ultimele 90 zile</option>
            </select>
          </div>
        </div>
        <KpiCard 
          title="Venituri Totale" 
          value={(totalRevenue/100).toFixed(2) + " Lei"} 
          icon={DollarSign} 
        />
        <KpiCard 
          title="Comenzi Noi" 
          value={totalOrders} 
          icon={ShoppingBag} 
        />
      </div>

      {/* 3. Charts & Stock Section */}
      <div className="grid gap-4 lg:grid-cols-7">
        
        {/* Sales Chart */}
        <div className="col-span-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Evoluție Comenzi</h3>
          </div>

          <div className="h-[300px] w-full relative">
            {isLoadingChart && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 11}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#ec4899', fontWeight: 'bold' }}
                  labelStyle={{ color: '#374151', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="orderCount" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" />
              Stoc Limitat <span className="text-sm font-normal text-muted-foreground">({totalLowStock})</span>
            </h3>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 relative" style={{ maxHeight: '300px' }}>
            {isLoadingStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm">
                <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
              </div>
            )}
            
            {!isLoadingStock && lowStockItems.length === 0 ? (
               <div className="text-center text-muted-foreground py-8">
                 Nu există produse cu stoc limitat.
               </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.variant_id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-border transition-all">
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-white shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={item.name}>{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">Cod: {item.cod}</span>
                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-md font-medium">Mărime: {item.size}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-sm font-bold text-red-600">{item.quantity} buc</span>
                    <span className="text-[10px] text-muted-foreground">Rămase</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Pending Orders Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Comenzi Care Necesită Procesare ({totalPending})</h3>
            <p className="text-sm text-muted-foreground">Comenzi primite care nu au fost încă expediate.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="text-sm font-medium text-foreground bg-secondary px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          >
            Vezi toate comenzile
          </button>
        </div>
        
        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoadingPending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          )}
          
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Acțiune</th>
              </tr>
            </thead>
            <tbody>
              {!isLoadingPending && pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nu există comenzi în așteptare.
                  </td>
                </tr>
              ) : (
                pendingOrders.map((order) => {
                  const customerName = `${order.first_name} ${order.last_name}`;
                  const formattedDate = new Date(order.created_at).toLocaleDateString('ro-RO', { 
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                  });
                  const orderTotal = ((order.total_ammount + (order.shipping_cost || 0)) / 100).toFixed(2);

                  return (
                    <tr key={order.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">#ORD-{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                            {order.first_name.charAt(0)}
                          </div>
                          {customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                        <Clock size={14} />
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 font-medium">{orderTotal} Lei</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          În Așteptare
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => window.location.href = `/admin/orders/${order.id}`}
                          className="text-pink-600 hover:text-pink-700 font-medium text-xs inline-flex items-center gap-1"
                        >
                          Procesează <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- Helper Components ---

const KpiCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-full bg-pink-50 text-pink-600">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardAdmin;