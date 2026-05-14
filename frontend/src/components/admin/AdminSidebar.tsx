import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const domain=import.meta.env.VITE_CLOUDFLARE_DOMAIN

const logo = `${domain}/logo.webp`;

// Mock Data Structure for Admin (Replace with your real data later)
const adminNavigation = [
  {
    name: 'Panou Principal',
    href: '/admin',
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: 'Produse',
    icon: Package,
    href: '/admin/products', // Parent link (optional)
    children: [
      { name: 'Toate Produsele', href: '/admin/products', icon: List },
      { name: 'Adaugă Produs', href: '/admin/products/new', icon: Plus },
    ],
  },
  {
    name: 'Comenzi',
    icon: ShoppingCart,
    children: [
      { name: 'Toate Comenzile', href: '/admin/orders', icon: List },
    ],
  },
];

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Helper to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  // Shared Sidebar Content (Used for both Desktop and Mobile)
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-background border-r border-border">
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-center border-b border-border px-6">
        <Link to="/">
          <img src={logo} alt="Admin Logo" className="w-24 object-contain" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-6">
          {adminNavigation.map((item) => (
            <div key={item.name}>
              {/* Main Category */}
              {item.href && !item.children ? (
                <Link
                  to={item.href}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ) : (
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  <div className="flex items-center gap-2">
                    <item.icon size={16} />
                    {item.name}
                  </div>
                </div>
              )}

              {/* Subcategories (Always Visible) */}
              {item.children && (
                <div className="mt-1 space-y-1 ml-4 border-l border-border pl-2">
                  {item.children.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive(subItem.href)
                          ? 'bg-secondary/50 text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                      }`}
                    >
                      {/* Optional: Add icons to subitems or keep simple dots */}
                      {/* <subItem.icon size={14} /> */} 
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

    </div>
  );

  return (
    <>
      {/* --- Mobile Top Bar (Visible only on small screens) --- */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          <span className="font-heading font-semibold">Admin Panel</span>
        </div>
        <img src={logo} alt="Logo" className="w-20" />
      </div>

      {/* --- Mobile Sidebar Drawer --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            {/* Slide-out Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-background lg:hidden"
            >
              <div className="absolute right-2 top-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Desktop Static Sidebar (Visible on LG screens) --- */}
      <aside className="hidden fixed inset-y-0 left-0 z-40 w-64 lg:block">
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;