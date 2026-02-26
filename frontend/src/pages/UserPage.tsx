import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Loader2, 
  MapPin, 
  Package, 
  Edit2, 
  Check, 
  ChevronRight,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/hooks/use-authstore";
import { useCartStore } from "@/hooks/use-cartstore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export interface OrderItem {
  id: number;
  productName: string;
  image: string | null;
  size: string;
  quantity: number;
  price: number; 
}

export interface Order {
  id: number;
  status: 'pending' | 'paid' | 'shipping' | 'cancelled' | 'delivered' | 'refunded';
  total_ammount: number; 
  shipping_cost: number | null;
  created_at: string;
  // Optional fields that get populated after fetching details
  items?: OrderItem[];
  email?: string;
  first_name?: string;
  last_name?: string;
  address_line?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

const UserPage = () => {
  const navigate = useNavigate();
  
  // Zustand State
  const { user, setUser, address, setAddress, clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();

  // --- UI Loading States ---
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  
  // New States for Profile Editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // New State for Real Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // --- Forms State ---
  const [addressForm, setAddressForm] = useState({
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Romania",
  });

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone: ""
  });

  // --- Sync Data Effects ---
  useEffect(() => {
    if (address) {
      setAddressForm({
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      });
    }
  }, [address]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  // Fetch Orders Implementation
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/get`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const ordersData = data.result || [];
        setOrders(ordersData);

      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // --- Handlers ---

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");

      clearAuth();
      clearCart();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error("Could not log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/updateData`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      setUser(data.user); 
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);

    const isExisting = !!address;
    const endpoint = isExisting ? "updateAddress" : "addAddress";
    const method = isExisting ? "PUT" : "POST";

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to save address");
      
      setAddress(data.address);
      setIsEditingAddress(false);
      toast.success(isExisting ? "Address updated" : "Address created");
    } catch (err: any) {
      toast.error(err.message || "Failed to save address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const getInitials = () => {
    if (user?.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const handleViewOrder = async (orderId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/order/details/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to get order details");

      const newOrds = orders.map((item) => {
        if (item.id === orderId) {
          return {
            ...item,
            items: data.items,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            address_line: data.address_line,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
          };
        } else {
          return item;
        }
      });

      setOrders(newOrds);

    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast.error(error.message || "Could not load order details");
    }
  };

  // Helper to collapse an order (clear its details locally)
  const handleHideOrder = (orderId: number) => {
    const newOrds = orders.map((item) => {
      if (item.id === orderId) {
        return { ...item, items: undefined };
      }
      return item;
    });
    setOrders(newOrds);
  };

  return (
    <div className="min-h-screen bg-secondary/10">
      <Navbar />
      <main className="container-custom py-24 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile & Address */}
          <div className="space-y-6">
            
            {/* PROFILE CARD */}
            <div className="bg-background p-6 border border-border rounded-lg shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-pink/20 flex items-center justify-center text-pink-accent text-xl font-bold border border-pink/30">
                    {getInitials()}
                  </div>
                  <div>
                    {!isEditingProfile && (
                      <h1 className="text-xl font-semibold text-foreground">
                        {user?.first_name ? `${user.first_name} ${user.last_name}` : "My Account"}
                      </h1>
                    )}
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      Member
                    </span>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)} 
                    className="text-xs text-pink-accent hover:underline flex items-center gap-1 font-medium transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground ml-1">First Name</label>
                      <input
                        placeholder="First Name"
                        className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground ml-1">Last Name</label>
                      <input
                        placeholder="Last Name"
                        className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">Phone Number</label>
                    <input
                      placeholder="Phone Number"
                      className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground ml-1">Email (Cannot be changed)</label>
                    <input
                      value={user?.email || ""}
                      disabled
                      className="w-full text-sm border border-border bg-secondary/30 p-2 rounded text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={isSavingProfile} className="flex-1 text-xs py-2 h-auto">
                      {isSavingProfile ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={14} className="mr-1" />}
                      Save
                    </Button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)} 
                      className="px-3 text-xs border border-border rounded hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 border-t border-border pt-4">
                  <div className="flex items-center gap-3 text-sm group">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      <Mail size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium truncate max-w-[200px]" title={user?.email}>{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm group">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 w-full mt-6 py-2.5 px-4 text-sm text-red-600 hover:bg-red-50 border border-red-100 transition-colors rounded-md font-medium"
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut size={16} />}
                Logout
              </button>
            </div>

            {/* ADDRESS CARD */}
            <div className="bg-background p-6 border border-border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-muted-foreground" />
                  <h2 className="font-semibold">Shipping Address</h2>
                </div>
                {!isEditingAddress && address && (
                  <button onClick={() => setIsEditingAddress(true)} className="text-xs text-pink-accent hover:underline flex items-center gap-1 font-medium">
                    <Edit2 size={12} /> Edit
                  </button>
                )}
              </div>

              {isEditingAddress || !address ? (
                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <input
                    placeholder="Address Line (Strada, Nr, Bl, Ap)"
                    className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                    value={addressForm.address_line}
                    onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="City"
                      className="text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                    <input
                      placeholder="State/County"
                      className="text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    placeholder="Postal Code"
                    className="w-full text-sm border border-border p-2 rounded focus:outline-pink-accent bg-transparent"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    required
                  />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={isSavingAddress} className="flex-1 text-xs py-2 h-auto">
                      {isSavingAddress ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={14} className="mr-1" />}
                      Save Address
                    </Button>
                    {address && (
                      <button type="button" onClick={() => setIsEditingAddress(false)} className="px-3 text-xs border border-border rounded hover:bg-secondary transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="text-sm text-muted-foreground space-y-1 pl-1 border-l-2 border-pink-accent/50">
                  <p className="text-foreground font-medium">{address.address_line}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>{address.postal_code}</p>
                  <p>{address.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background p-6 border border-border rounded-lg shadow-sm min-h-[400px]">
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <Package size={20} className="text-muted-foreground" />
                <h2 className="text-xl font-semibold">Order History</h2>
              </div>

              {isLoadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Loading your orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    // 1. Calculations
                    const totalCents = Number(order.total_ammount);
                    const shippingCents = Number(order.shipping_cost || 0);
                    const finalDollars = (totalCents + shippingCents) / 100;

                    // 2. Check if this specific order has details loaded
                    const showDetails = order.items && order.items.length > 0;

                    return (
                      <div 
                        key={order.id} 
                        className="flex flex-col border border-border rounded-lg bg-secondary/5 transition-all hover:border-pink/50"
                      >
                        {/* --- TOP SECTION (Always Visible) --- */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                                #{order.id}
                              </p>
                              {/* Dynamic Status Badge */}
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                order.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>

                            {/* Price Display */}
                            <div className="mt-2 flex flex-col">
                              <p className="text-sm font-bold">
                                ${finalDollars.toFixed(2)}
                              </p>
                              {shippingCents > 0 ? (
                                <span className="text-[10px] text-muted-foreground">
                                  (Includes ${(shippingCents / 100).toFixed(2)} shipping)
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">
                                  (Free Shipping)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => {
                              if (showDetails) {
                                handleHideOrder(order.id);
                              } else {
                                handleViewOrder(order.id);
                              }
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary hover:text-foreground transition-all group h-fit self-start md:self-center"
                          >
                            {showDetails ? "Hide Details" : "View Details"}
                            <ChevronRight 
                              size={14} 
                              className={`text-muted-foreground transition-transform duration-300 ${showDetails ? "rotate-90" : ""}`} 
                            />
                          </button>
                        </div>

                        {/* --- EXPANDED DETAILS SECTION (Conditionally Rendered) --- */}
                        {showDetails && order.items && (
                          <div className="border-t border-border bg-secondary/10 p-4 animate-in fade-in slide-in-from-top-2">
                            <div className="grid gap-6 md:grid-cols-2">
                              
                              {/* Column 1: Order Items */}
                              <div>
                                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                  Items ({order.items.length})
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      {/* Product Image */}
                                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-border bg-white">
                                        {item.image ? (
                                          <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px]">No Img</div>
                                        )}
                                      </div>
                                      
                                      {/* Product Info */}
                                      <div className="flex-1">
                                        <p className="text-sm font-medium leading-none">{item.productName}</p>
                                        <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                                          <span>Size: {item.size}</span>
                                          <span>Qty: {item.quantity}</span>
                                        </div>
                                      </div>
                                      
                                      {/* Price */}
                                      <p className="text-sm font-medium">
                                        ${((item.price * item.quantity) / 100).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Column 2: Shipping & Payment Info */}
                              <div className="space-y-6 md:border-l md:border-border md:pl-6">
                                
                                {/* Shipping Address */}
                                {order.address_line && (
                                  <div>
                                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                      Shipping Address
                                    </h4>
                                    <div className="text-sm">
                                      <p className="font-medium">{order.first_name} {order.last_name}</p>
                                      <p className="text-muted-foreground">{order.address_line}</p>
                                      <p className="text-muted-foreground">
                                        {order.city}, {order.state} {order.postal_code}
                                      </p>
                                      <p className="mt-1 text-xs text-muted-foreground">{order.email}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Payment Breakdown */}
                                <div>
                                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                      Payment Summary
                                  </h4>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${(totalCents / 100).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>${(shippingCents / 100).toFixed(2)}</span>
                                  </div>
                                  <div className="mt-2 flex justify-between border-t border-border pt-2 font-bold">
                                    <span>Total Paid</span>
                                    <span>${finalDollars.toFixed(2)}</span>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <Package size={32} className="text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">Looks like you haven't placed any orders yet. Start shopping to fill this page.</p>
                  <button onClick={() => navigate('/women')} className="mt-6 btn-primary px-8">
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserPage;