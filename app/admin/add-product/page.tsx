'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Loader2, Plus } from 'lucide-react';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget); // Initialize formData first!

        const hiddenInput = document.getElementById('image-base64') as HTMLInputElement;
        const imageBase64 = hiddenInput?.value;

        const data = {
            name: formData.get('name'),
            category: formData.get('category'),
            image: imageBase64, // Use the base64 string
            stock: parseInt(formData.get('stock') as string),
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert("Failed to add product");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            name="name"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900"
                            placeholder="e.g. Vintage Denim Jacket"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                name="category"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Casual">Casual</option>
                                <option value="T-Shirt">T-Shirt</option>
                                <option value="Jacket">Jacket</option>
                                <option value="Dress">Dress</option>
                                <option value="Shirt">Shirt</option>
                                <option value="Pants">Pants</option>
                                <option value="Suit">Suit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Count</label>
                            <input
                                name="stock"
                                type="number"
                                defaultValue={100}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <div className="relative">
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                                        <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> product image</p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        required
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    const base64String = reader.result as string;
                                                    const hiddenInput = document.getElementById('image-base64') as HTMLInputElement;
                                                    if (hiddenInput) hiddenInput.value = base64String;
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <input type="hidden" name="image" id="image-base64" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">For demo, verify the URL is publicly accessible.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                            {loading ? 'Adding Product...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
