import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // 👈 1. Import Toast
import '../App.css'; 

const AdminPetEditScreen = () => {
    const { id: petId } = useParams();
    const navigate = useNavigate();
    
    const isEditMode = Boolean(petId);

    // --- State variables ---
    const [name, setName] = useState('');
    const [petType, setPetType] = useState('Dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState(0);
    const [status, setStatus] = useState('For Adoption');
    const [story, setStory] = useState('');
    const [shelterInfo, setShelterInfo] = useState('');
    const [image, setImage] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(isEditMode);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchPetDetails = async () => {
                try {
                    const token = localStorage.getItem('petCareToken');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get(`https://yemani-petcare-backend.hf.space/api/admin/pets/${petId}`, config);
                    
                    setName(data.name);
                    setPetType(data.petType);
                    setBreed(data.breed);
                    setAge(data.age);
                    setStatus(data.status);
                    setStory(data.story || '');
                    setShelterInfo(data.shelterInfo || '');
                    setImage(data.image || '');
                    setContact(data.contact || '');
                    setLoading(false);
                } catch (error) {
                    console.error('Failed to fetch pet details', error);
                    setLoading(false);
                    // Error Toast for Fetching
                    toast.error("Failed to load pet details. 😿", { theme: "colored" });
                }
            };
            fetchPetDetails();
        } else {
            setLoading(false);
        }
    }, [petId, isEditMode]);

    const uploadFileHandler = async (e) =>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try{
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const {data} = await axios.post('https://yemani-petcare-backend.hf.space/api/upload', formData, config);
            setImage(data);
            setUploading(false);
            // 👇 2. Image Upload Success Toast
            toast.success("Image Uploaded! 📸", { theme: "colored" });
        } catch(error){
            console.error(error);
            setUploading(false);
            // 👇 3. Image Upload Error Toast
            toast.error('Image upload failed!', { theme: "colored" });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            const petData = { name, petType, breed, age: Number(age), status, story, shelterInfo, image, contact };

            if (isEditMode) {
                await axios.put(`https://yemani-petcare-backend.hf.space/api/admin/pets/${petId}`, petData, config);
                // 👇 4. Update Success Toast
                toast.success('Pet Profile Updated! 💾', { theme: "colored", style: { backgroundColor: '#3C3F36', color: '#fff' } });
            } else {
                await axios.post('https://yemani-petcare-backend.hf.space/api/admin/pets', petData, config);
                // 👇 5. Create Success Toast
                toast.success('New Pet Added! 🐾', { theme: "colored", style: { backgroundColor: '#A0522D', color: '#fff' } });
            }
            navigate('/admin/petlist');
        } catch (error) {
            console.error('Failed to save pet', error);
            // 👇 6. Save Error Toast
            toast.error('Failed to save pet details.', { theme: "colored" });
        }
    };

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8 animate-fade-in-up">
                <Link to="/admin/petlist" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#A0522D] mb-4 transition-colors">
                    &larr; Back to Pet List
                </Link>
                <h1 className="text-3xl font-extrabold text-[#3C3F36]">
                    {isEditMode ? 'Edit Pet Profile ✏️' : 'Add New Pet 🐾'}
                </h1>
                <p className="text-gray-500">Fill in the details to find them a lovely home.</p>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 animate-fade-in-up delay-100">
                <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* --- LEFT COLUMN: Image Upload --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <label className="block text-sm font-bold text-gray-700">Pet Image</label>
                        
                        <div className="relative group">
                            <div className="w-full h-80 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                                {image ? (
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <span className="text-4xl block mb-2">📸</span>
                                        <span className="text-sm font-medium">No image uploaded</span>
                                    </div>
                                )}
                                
                                {/* Overlay for Uploading */}
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0522D]"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* File Inputs */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:border-[#A0522D] outline-none"
                                    value={image} 
                                    onChange={(e) => setImage(e.target.value)} 
                                    placeholder="https://example.com/dog.jpg"
                                />
                            </div>
                            <div className="text-center text-gray-400 text-xs font-bold">- OR -</div>
                            <div>
                                <label className="block w-full cursor-pointer bg-[#A0522D] text-white text-center py-3 rounded-xl font-bold hover:bg-[#8B4513] transition-colors shadow-md">
                                    Upload File 📂
                                    <input type="file" className="hidden" onChange={uploadFileHandler} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Form Fields --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Buddy" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={petType} onChange={(e) => setPetType(e.target.value)}>
                                    <option value="Dog">Dog 🐶</option>
                                    <option value="Cat">Cat 🐱</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Breed</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={breed} onChange={(e) => setBreed(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Age (Years)</label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={age} onChange={(e) => setAge(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="For Adoption">For Adoption 🏠</option>
                                    <option value="Adopted">Adopted ✅</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="077 123 4567" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Story / Bio</label>
                            <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none resize-none" placeholder="Tell us about the pet's personality..." value={story} onChange={(e) => setStory(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Shelter / Location Info</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" placeholder="e.g., Happy Paws Shelter, Colombo" value={shelterInfo} onChange={(e) => setShelterInfo(e.target.value)} />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-4 bg-[#3C3F36] text-white font-bold rounded-xl shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {isEditMode ? 'Update Pet Profile 💾' : 'Create Pet Profile ✨'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPetEditScreen;