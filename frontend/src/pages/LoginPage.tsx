import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for redirect
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Added Loader icon
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import useAuthStore from "@/hooks/use-authstore"; // Import your Zustand store
import { useCartStore, CartItem } from "@/hooks/use-cartstore.ts"; // Importă store-ul de coș


const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state: any) => state.setUser);
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const useCart=useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin 
      ? { email, password } 
      : { email, password, phone, first_name:firstName, last_name:lastName };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (isLogin ? "Autentificarea a eșuat" : "Înregistrarea a eșuat"));
      }

      setUser(data.user);
      
      toast.success(isLogin ? `Bine ai revenit, ${data.user.first_name || 'Utilizator'}!` : 'Cont creat cu succes!');
      navigate("/");
      localStorage.clear()
      location.reload()

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center pt-[105px]">
        <div className="container-custom py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md"
          >
            <div className="text-center">
              <h1 className="font-heading text-3xl font-semibold">
                {isLogin ? 'Bine ai revenit' : 'Creează Cont'}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {isLogin
                  ? 'Intră în cont pentru a accesa profilul tău'
                  : 'Alătură-te nouă pentru oferte exclusive și noutăți'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {!isLogin && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Prenume</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Nume</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Telefon</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Parolă</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border bg-transparent px-4 py-3 pr-12 text-sm focus:border-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLogin ? 'Intră în cont' : 'Creează Cont'}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Nu ai un cont?" : 'Ai deja un cont?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  {isLogin ? 'Înregistrează-te' : 'Intră în cont'}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;