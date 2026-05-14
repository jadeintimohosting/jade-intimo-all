import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GenderProvider } from "@/context/GenderContext";

import useAuthStore from "@/hooks/use-authstore.ts";
import { useCartStore, CartItem } from "@/hooks/use-cartstore.ts";

import Index from "./pages/Index";
import GenderPage from "./pages/GenderPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import UserPage from "./pages/UserPage.tsx";
import NewPage from "./pages/NewPage.tsx";

import AdminLayout from "./pages/admin/AdminLayout.tsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.tsx";
import AddProductPageAdmin from "./pages/admin/AddProductPageAdmin.jsx";
import ProductListAdmin from "./pages/admin/ProductListAdmin.tsx";
import ProductPageAdmin from "./pages/admin/ProductPageAdmin.tsx";
import SuccessPage from "./pages/SucessPageOrder.tsx";
import EditVariantPage from "./pages/admin/EditVariantPage.tsx";
import OrderListAdmin from "./pages/admin/OrderListAdmin.tsx";
import OrderDetailsAdmin from "./pages/admin/OrderDetailsAdmin.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import Faq from "./pages/footerPages/Faq.tsx";
import Asistenta from "./pages/footerPages/Asistenta.tsx";
import LivrareRetur from "./pages/footerPages/LivrareRetur.tsx";
import TermeniConditii from "./pages/footerPages/TermeniConditii.tsx";

import RouteTracker from "./hooks/RouteTracker.tsx";
import PrivacyPolicy from "./pages/footerPages/PrivacyPolicy.tsx";
import CookieConsent from "./hooks/CookieConsent.tsx";

const queryClient = new QueryClient();

const App = () => {
  const user=useAuthStore((state)=>state.user)
  const setUser = useAuthStore((state) => state.setUser);
  const setAddress = useAuthStore((state) => state.setAddress);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`/api/auth/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          try {
            const addressResponse = await fetch(`/api/auth/getAddress`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            if (addressResponse.ok) {
              const addressData = await addressResponse.json();
              setAddress(addressData.address);
            }
          } catch (addrError) {
            console.error("Failed to fetch address:", addrError);
          }

          try {
            const cartResponse = await fetch(`/api/cart`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (cartResponse.ok) {
              const cartData = await cartResponse.json();
              const backendGroups = cartData.data || [];
              
              const flatCartItems: CartItem[] = backendGroups.flatMap((prod: any) => 
                prod.variants.map((variant: any) => ({
                  id: prod.id,
                  variantId: variant.variantId,
                  name: prod.name,
                  price: prod.price,
                  image: prod.image,
                  size: variant.size,
                  quantity: variant.quantity,
                  category: "",
                  subCategory: "",
                  gender: "women",
                  soldPieces: 0,
                  bigSizes: false
                }))
              );

              useCartStore.setState({ cart: flatCartItems });
            }
          } catch (cartError) {
            console.error("Failed to fetch cart from DB:", cartError);
          }

        } else {
          setUser(null);
          setAddress(null);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setUser(null);
        setAddress(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [setUser, setAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GenderProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteTracker/>
              <CookieConsent/>

              <Routes>
                <Route path="/" element={<Index />} />

                {/* Women's Section */}
                <Route path="/women">
                  <Route index element={<GenderPage />} />
                  <Route path="cauta" element={<SearchPage/>}/>
                  <Route path="noutati" element={<NewPage />} />
                  <Route path=":category">
                    <Route index element={<CategoryPage />} />
                    <Route path=":subcategory" element={<CategoryPage />} />
                  </Route>
                </Route>

                {/* Men's Section */}
                <Route path="/men">
                  <Route index element={<GenderPage />} />
                  <Route path="cauta" element={<SearchPage/>}/>
                  <Route path="noutati" element={<NewPage />} />
                  <Route path=":category">
                    <Route index element={<CategoryPage />} />
                    <Route path=":subcategory" element={<CategoryPage />} />
                  </Route>
                </Route>

                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage/>}/>
                <Route
                  path="/login"
                  element={isAuthenticated ? <UserPage /> : <LoginPage />}
                />

                <Route
                  path="/admin"
                  element={(isAuthenticated && user.role === "admin") ? <AdminLayout/> : <Navigate to={"/"}/>}
                >
                  <Route index element={<DashboardAdmin/>}></Route>
                  <Route path="products">
                    <Route index element={<ProductListAdmin/>}></Route>
                    <Route path=":id" element={<ProductPageAdmin/>}></Route>
                    <Route path="variant/:id" element={<EditVariantPage/>}/>
                    <Route path="new" element={<AddProductPageAdmin/>}></Route>
                  </Route>
                  <Route path="orders">
                    <Route index element={<OrderListAdmin/>}/>
                    <Route path=":id" element={<OrderDetailsAdmin/>}/>
                  </Route>
                  
                </Route>

                <Route path="faq" element={<Faq/>}/>
                <Route path="asistenta" element={<Asistenta/>}/>
                <Route path="livrare_si_retur" element={<LivrareRetur/>}/>
                <Route path="termeni_si_conditii" element={<TermeniConditii/>}/>
                <Route path="politica_si_confidentialitate" element={<PrivacyPolicy/>}/>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </GenderProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;