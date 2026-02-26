import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Save, 
  Trash2, 
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';

// --- CONFIGURATION ---
const API_URL = `/api`;

// --- DATA STRUCTURE (As provided) ---
import { navigationData } from '@/data/navigation';


const ProductPageAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    price: '', 
    gender: 'women', // Default
    category: '',
    subCategory: '',
    bigSizes: false,
    image: null 
  });


  // --- DERIVED DATA ---
  
  // 1. Get Categories based on selected Gender
  const availableCategories = useMemo(() => {
    return navigationData[formData.gender] || [];
  }, [formData.gender]);

  // 2. Get Subcategories based on selected Category
  const availableSubcategories = useMemo(() => {
    const categoryObj = availableCategories.find(c => c.slug === formData.category);
    return categoryObj?.subcategories || [];
  }, [availableCategories, formData.category]);

  // --- FETCHING ---
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          credentials: "include",
          method: "get"
        });
        
        if (!response.ok) {
           if (response.status === 404) throw new Error("Produsul nu a fost găsit");
           throw new Error("Nu s-a putut încărca produsul");
        }

        const data = await response.json();
        const product = data.product?.product || data.product;

        if (!product) throw new Error("Date invalide primite");

        // Pre-fill Form
        setFormData({
            name: product.name,
            description: product.description || '',
            material: product.material || '',
            price: (product.price / 100).toFixed(2), 
            gender: product.gender,
            category: product.category,
            subCategory: product.subCategory || '',
            bigSizes: product.bigSizes || false,
            image: product.image
        });

      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // --- HANDLERS ---

  // Generic Text Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gender Change: Resets Category & SubCategory
  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    const genderCategories = navigationData[newGender] || [];
    
    setFormData((prev) => ({
      ...prev,
      gender: newGender,
      category: genderCategories.length > 0 ? genderCategories[0].slug : '',
      subCategory: '' 
    }));
  };

  // Category Change: Resets SubCategory
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      subCategory: ''
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, bigSizes: e.target.checked }));
  };

  // Update (PUT)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        price: Math.round(Number(formData.price) * 100),
        subCategory: formData.subCategory === "" ? null : formData.subCategory,
        description: formData.description === "" ? null : formData.description,
        material: formData.material === "" ? null : formData.material,
        image: formData.image 
      };

      const response = await fetch(`${API_URL}/products/admin/item/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Actualizarea a eșuat");
      }

      toast.success("Produsul a fost actualizat cu succes!");

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!window.confirm("Sigur dorești să ștergi acest produs? Această acțiune este ireversibilă.")) {
        return;
    }

    setIsDeleting(true);
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products/admin/item/${id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            credentials: "include"
        });

        if (!response.ok) throw new Error("Ștergerea a eșuat");

        toast.success("Produs șters.");
        navigate('/admin/products');

    } catch (err) {
        console.error(err);
        toast.error(err.message);
        setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">Eroare la încărcarea produsului</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => navigate('/admin/products')} className="text-blue-600 hover:underline">
                Înapoi la produse
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
            <button 
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                Înapoi la listă
            </button>
            
            <div className="flex items-center gap-3">
                 <button
                    onClick={() => navigate(`/admin/products/variant/${id}`)}
                    className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition font-medium"
                 >
                    <LayoutGrid size={18} />
                    Editează variante
                 </button>

                 <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                 >
                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    Șterge
                 </button>
            </div>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Top Bar with Image Preview */}
            <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-start gap-6">
                 <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-300">
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">Fără imagine</div>
                    )}
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900">Editează produs</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono">{id}</span></p>
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit border border-orange-100">
                        Editarea imaginii este dezactivată în această vizualizare.
                    </div>
                 </div>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-8">
                
                {/* --- BASIC INFO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nume produs</label>
                    <input
                    required
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preț</label>
                    <div className="relative">
                        <input
                            required
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 pl-4 pr-12 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">RON</span>
                        </div>
                    </div>
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                    name="material"
                    type="text"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
                </div>

                {/* --- DEPENDENT CATEGORIZATION --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                
                {/* 1. GENDER */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gen</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleGenderChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-blue-500 focus:outline-none"
                    >
                    <option value="women">Femei</option>
                    <option value="men">Bărbați</option>
                    </select>
                </div>

                {/* 2. CATEGORY (Dependent on Gender) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-blue-500 focus:outline-none"
                    >
                    <option value="" disabled>Selectează categoria</option>
                    {availableCategories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                    </select>
                </div>

                {/* 3. SUB-CATEGORY (Dependent on Category) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-categorie</label>
                    <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange} // Standard handle change is fine here
                        disabled={!formData.category || availableSubcategories.length === 0}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    >
                    <option value="">-- Niciuna --</option>
                    {availableSubcategories.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                    </select>
                    {/* Helper text if no subcategories available */}
                    {formData.category && availableSubcategories.length === 0 && (
                        <p className="text-xs text-gray-500 mt-1">Nu există sub-categorii disponibile.</p>
                    )}
                </div>
                </div>

                {/* --- EXTRAS --- */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <input
                    id="bigSizes"
                    name="bigSizes"
                    type="checkbox"
                    checked={formData.bigSizes}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="bigSizes" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer select-none">
                    Disponibil în mărimi mari (Plus Size)
                </label>
                </div>

                {/* --- SUBMIT BUTTON --- */}
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all"
                    >
                        Anulează
                    </button>
                    
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`
                        flex items-center justify-center px-8 py-3 rounded-lg text-white font-medium shadow-sm transition-all
                        ${isSaving 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'}
                        `}
                    >
                        {isSaving ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            Se salvează...
                        </>
                        ) : (
                        <>
                            <Save className="-ml-1 mr-2 h-5 w-5" />
                            Salvează modificările
                        </>
                        )}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPageAdmin;