import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
	ArrowLeft, 
	Plus, 
	Trash2, 
	Save, 
	X, 
	Edit2, 
	Loader2, 
	Package 
} from 'lucide-react';
import { toast } from 'sonner';

// --- CONFIGURATION ---
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const EditVariantPage = () => {
	const { id: productId } = useParams();
	const navigate = useNavigate();

	// --- STATES ---
	const [productName, setProductName] = useState('');
	const [variants, setVariants] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	
	// State for adding a new variant
	const [newSize, setNewSize] = useState('');
	const [newQuantity, setNewQuantity] = useState(''); // Kept as string initially to allow empty input
	const [isAdding, setIsAdding] = useState(false);

	// State for editing an existing variant
	const [editingId, setEditingId] = useState(null);
	const [editFormData, setEditFormData] = useState({ size: '', quantity: 0 });
	const [isSaving, setIsSaving] = useState(false);

	// --- 1. FETCH DATA ---
	const fetchVariants = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/products/${productId}`, {
					credentials: "include"
			});
			
			if (!response.ok) throw new Error("Nu s-a putut încărca produsul");

			const data = await response.json();
			
			const productObj = data.product?.product || data.product;
			const variantsArr = data.product?.variants || [];

			setProductName(productObj.name);
			setVariants(variantsArr.sort((a, b) => a.id - b.id));

		} catch (error) {
			console.error(error);
			toast.error("Eroare la încărcarea variantelor");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (productId) fetchVariants();
	}, [productId]);


	// --- 2. ADD VARIANT (POST) ---
	const handleAddVariant = async (e) => {
		e.preventDefault();
		if (!newSize || newQuantity === '') {
				toast.error("Te rog completează mărimea și cantitatea");
				return;
		}

		setIsAdding(true);
		const token = localStorage.getItem('token');

		try {
			const response = await fetch(`${API_URL}/products/admin/variant/${productId}`, {
				method: 'POST',
				headers: { 
						'Content-Type': 'application/json',
						...(token && { 'Authorization': `Bearer ${token}` })
				},
				body: JSON.stringify({
						size: newSize,
						quantity: Number(newQuantity)
				}),
				credentials: "include"
			});

			if (!response.ok) {
					const err = await response.json();
					throw new Error(err.message || "Nu s-a putut adăuga varianta");
			}

			toast.success("Variantă adăugată!");
			setNewSize('');
			setNewQuantity('');
			fetchVariants();

		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsAdding(false);
		}
	};


	// --- 3. DELETE VARIANT (DELETE) ---
	const handleDeleteVariant = async (variantId) => {
		if (!window.confirm("Ștergi această variantă de mărime?")) return;

		const token = localStorage.getItem('token');
		try {
				const response = await fetch(`${API_URL}/products/admin/variant/${variantId}`, {
						method: 'DELETE',
						headers: { 
								'Content-Type': 'application/json',
								...(token && { 'Authorization': `Bearer ${token}` })
						},
						credentials: "include"
				});

				if (!response.ok) throw new Error("Nu s-a putut șterge varianta");

				toast.success("Variantă ștearsă");
				setVariants(prev => prev.filter(v => v.id !== variantId));

		} catch (error) {
				toast.error(error.message);
		}
	};


	// --- 4. START EDITING ---
	const startEdit = (variant) => {
			setEditingId(variant.id);
			setEditFormData({ size: variant.size, quantity: variant.quantity });
	};

	const cancelEdit = () => {
			setEditingId(null);
			setEditFormData({ size: '', quantity: 0 });
	};


	// --- 5. SAVE EDIT (PUT) ---
	const handleUpdateVariant = async (variantId) => {
		setIsSaving(true);
		const token = localStorage.getItem('token');

		try {
				const response = await fetch(`${API_URL}/products/admin/variant/${variantId}`, {
						method: 'PUT',
						headers: { 
								'Content-Type': 'application/json',
								...(token && { 'Authorization': `Bearer ${token}` })
						},
						body: JSON.stringify({
								size: editFormData.size,
								quantity: Number(editFormData.quantity)
						}),
						credentials: "include"
				});

				if (!response.ok) throw new Error("Nu s-a putut actualiza varianta");

				toast.success("Variantă actualizată");
				setEditingId(null);
				fetchVariants();

		} catch (error) {
				toast.error(error.message);
		} finally {
				setIsSaving(false);
		}
	};


	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="animate-spin text-blue-600" size={32} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50 p-6">
			<div className="max-w-4xl mx-auto space-y-6">
				
				{/* Header */}
				<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
								<button 
										onClick={() => navigate(`/admin/products/${productId}`)}
										className="p-2 hover:bg-white rounded-full transition border border-transparent hover:border-gray-200"
								>
										<ArrowLeft size={20} className="text-gray-600" />
								</button>
								<div>
										<h1 className="text-2xl font-bold text-gray-900">Gestionează Variante</h1>
										<p className="text-gray-500">Editare stoc pentru: <span className="font-medium text-gray-900">{productName}</span></p>
								</div>
						</div>
				</div>

				{/* ADD NEW VARIANT CARD */}
				<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
						<h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
								<Plus size={16} /> Adaugă Mărime Nouă
						</h2>
						<form onSubmit={handleAddVariant} className="flex flex-col md:flex-row gap-4 items-end">
								<div className="w-full md:w-1/3">
										<label className="block text-sm font-medium text-gray-700 mb-1">Etichetă Mărime</label>
										<input 
												type="text" 
												placeholder="ex. S, M, XL, 38, 42"
												value={newSize}
												onChange={(e) => setNewSize(e.target.value)}
												className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
										/>
								</div>
								<div className="w-full md:w-1/3">
										<label className="block text-sm font-medium text-gray-700 mb-1">Cantitate</label>
										<input 
												type="number" 
												min="0"
												placeholder="0"
												value={newQuantity}
												// FIX: Ensure value is treated as number, or keep as string for adding logic
												onChange={(e) => setNewQuantity(e.target.value)}
												className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
										/>
								</div>
								<button 
										type="submit"
										disabled={isAdding}
										className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
								>
										{isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
										Adaugă Variantă
								</button>
						</form>
				</div>

				{/* VARIANTS TABLE */}
				<div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
								<table className="w-full text-left border-collapse">
										<thead>
												<tr className="bg-gray-50 border-b border-gray-200">
														<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mărime</th>
														<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cantitate Stoc</th>
														<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acțiuni</th>
												</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
												{variants.length > 0 ? (
														variants.map((variant) => (
																<tr key={variant.id} className="hover:bg-gray-50/50 transition">
																		{/* --- EDIT MODE --- */}
																		{editingId === variant.id ? (
																				<>
																						<td className="px-6 py-4">
																								<input 
																										type="text" 
																										value={editFormData.size}
																										onChange={(e) => setEditFormData({...editFormData, size: e.target.value})}
																										className="w-24 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
																										autoFocus
																								/>
																						</td>
																						<td className="px-6 py-4">
																								<input 
																										type='number'
																										value={editFormData.quantity}
																										// FIX: Convert string input to number immediately
																										onChange={(e) => {
																											const val = e.target.value;
																											setEditFormData({
																												...editFormData, 
																												// If empty, set to 0, otherwise parse as integer
																												quantity: val === '' ? 0 : parseInt(val, 10)
																											})
																										}}
																										className="w-24 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
																								/>
																						</td>
																						<td className="px-6 py-4 text-right">
																								<div className="flex items-center justify-end gap-2">
																										<button 
																												onClick={() => handleUpdateVariant(variant.id)}
																												disabled={isSaving}
																												className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
																												title="Salvează"
																										>
																												{isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
																										</button>
																										<button 
																												onClick={cancelEdit}
																												className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
																												title="Anulează"
																										>
																												<X size={16} />
																										</button>
																								</div>
																						</td>
																				</>
																		) : (
																				/* --- VIEW MODE --- */
																				<>
																						<td className="px-6 py-4 font-medium text-gray-900">
																								<span className="bg-gray-100 px-2 py-1 rounded text-sm border border-gray-200">
																										{variant.size}
																								</span>
																						</td>
																						<td className="px-6 py-4">
																								<div className="flex items-center gap-2">
																										<Package size={16} className={variant.quantity > 0 ? "text-gray-400" : "text-red-400"} />
																										<span className={variant.quantity === 0 ? "text-red-600 font-bold" : "text-gray-700"}>
																												{variant.quantity}
																										</span>
																										{variant.quantity === 0 && (
																												<span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Stoc Epuizat</span>
																										)}
																								</div>
																						</td>
																						<td className="px-6 py-4 text-right">
																								<div className="flex items-center justify-end gap-2">
																										<button 
																												onClick={() => startEdit(variant)}
																												className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
																												title="Editează"
																										>
																												<Edit2 size={16} />
																										</button>
																										<button 
																												onClick={() => handleDeleteVariant(variant.id)}
																												className="p-2 text-red-600 hover:bg-red-50 rounded transition"
																												title="Șterge"
																										>
																												<Trash2 size={16} />
																										</button>
																								</div>
																						</td>
																				</>
																		)}
																</tr>
														))
												) : (
														<tr>
																<td colSpan={3} className="px-6 py-12 text-center text-gray-500">
																		<Package size={32} className="mx-auto mb-2 text-gray-300" />
																		Nicio variantă găsită. Adaugă o mărime mai sus.
																</td>
														</tr>
												)}
										</tbody>
								</table>
						</div>
				</div>
			</div>
		</div>
	);
};

export default EditVariantPage;