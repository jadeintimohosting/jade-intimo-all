import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LockKeyhole, ShoppingBag, User, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGender } from '@/context/GenderContext';
import { navigationData } from '@/data/navigation';
import useAuthStore from '@/hooks/use-authstore';

const domain = import.meta.env.VITE_CLOUDFLARE_DOMAIN;
const logo = `${domain}/logo.webp`;

import { useCartStore } from '@/hooks/use-cartstore';

const Navbar = () => {
  const { gender, setGender } = useGender();
  const navigate = useNavigate();
  
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const categories = gender === 'women' ? navigationData.women : navigationData.men;

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState<string | null>(null);

  const handleCategoryHover = (slug: string | null) => {
    setActiveCategory(slug);
  };

  const toggleMobileCategory = (slug: string) => {
    setExpandedMobileCategory(expandedMobileCategory === slug ? null : slug);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (search && search.trim() !== '') {
        navigate(`/${gender}/cauta/?keyword=${encodeURIComponent(search.trim())}`);
      } else {
        navigate("/");
      }
      
      setIsSearchOpen(false); 
      setSearch('');
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-background shadow-soft">
      {/* Gender Toggle Bar */}
      <div className="border-b border-border bg-secondary/50">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-8 py-2">
            <button
              onClick={() => setGender('women')}
              className={`text-xs font-medium uppercase tracking-widest transition-all duration-base ${
                gender === 'women'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Femei
              {gender === 'women' && (
                <motion.div
                  layoutId="genderIndicator"
                  className="mt-1 h-[1px] bg-foreground"
                />
              )}
            </button>
            <button
              onClick={() => setGender('men')}
              className={`text-xs font-medium uppercase tracking-widest transition-all duration-base ${
                gender === 'men'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Barbati
              {gender === 'men' && (
                <motion.div
                  layoutId="genderIndicator"
                  className="mt-1 h-[1px] bg-foreground"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-border">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 md:p-2 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link to="/" className="flex flex-row gap-2">
                {/* Logo mai mic pe mobil (w-20) și normal pe desktop (md:w-28) */}
                <img src={logo} alt="logo" className='w-20 md:w-28'/>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-6">
              {categories.map((category) => (
                <div
                  key={category.slug}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category.slug)}
                  onMouseLeave={() => handleCategoryHover(null)}
                >
                  <Link
                    to={`/${gender}/${category.slug}`}
                    className="nav-link flex items-center gap-1 py-4 text-xs font-medium uppercase tracking-wider"
                  >
                    {category.name}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-base ${activeCategory === category.slug ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </Link>

                  {/* Subcategory Dropdown */}
                  <AnimatePresence>
                    {activeCategory === category.slug && category.subcategories && category.subcategories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full min-w-[220px] bg-background py-3 shadow-medium z-50"
                      >
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            to={`/${gender}/${category.slug}/${sub.slug}`}
                            className="block px-5 py-2 text-sm transition-colors duration-base hover:bg-secondary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            {/* Am micșorat gap-ul pe mobil la gap-0.5 */}
            <div className="flex items-center gap-0.5 md:gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 md:p-2 transition-opacity duration-base hover:opacity-70"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px] md:h-5 md:w-5" />
              </button>
              <Link
                to="/login"
                className="p-1.5 md:p-2 transition-opacity duration-base hover:opacity-70 md:block"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px] md:h-5 md:w-5" />
              </Link>
              {(isAuthenticated && user.role==="admin") && (
                <Link
                  to="/admin"
                  className="p-1.5 md:p-2 transition-opacity duration-base hover:opacity-70 md:block"
                  aria-label="Admin"
                >
                  <LockKeyhole className="h-[18px] w-[18px] md:h-5 md:w-5" />
                </Link>
              )}
              <Link
                to="/cart"
                className="relative p-1.5 md:p-2 transition-opacity duration-base hover:opacity-70"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px] md:h-5 md:w-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-0 top-0 md:-right-1 md:-top-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-pink text-[10px] md:text-xs font-medium text-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background"
          >
            <div className="container-custom py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-[18px] md:w-[18px]" />
                <input
                  type="text"
                  placeholder="Căutați produse..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={search || ''} 
                  onKeyDown={handleSearch}
                  className="w-full border-b border-border bg-transparent py-3 pl-12 pr-4 text-sm focus:border-foreground focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 top-[105px] z-50 bg-background lg:hidden overflow-y-auto"
          >
            {/* ... restul meniului de mobil rămâne la fel ... */}
            <nav className="container-custom py-8">
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <div>
                        <button
                          onClick={() => toggleMobileCategory(category.slug)}
                          className="flex w-full items-center justify-between py-3 text-lg font-medium"
                        >
                          {category.name}
                          <ChevronRight 
                            size={18} 
                            className={`transition-transform duration-200 ${
                              expandedMobileCategory === category.slug ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobileCategory === category.slug && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="border-l-2 border-border ml-2 pl-4 py-2 space-y-2">
                                <Link
                                  to={`/${gender}/${category.slug}`}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block py-2 text-base text-muted-foreground hover:text-foreground"
                                >
                                  Vezi toate
                                </Link>
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    to={`/${gender}/${category.slug}/${sub.slug}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 text-base text-muted-foreground hover:text-foreground"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={`/${gender}/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-lg font-medium"
                      >
                        {category.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <hr className="border-border my-4" />
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-lg font-medium"
                >
                  Sign In / Sign Up
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;