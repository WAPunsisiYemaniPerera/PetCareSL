import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () =>{
    return(
        <footer className="bg-[#3C3F36] text-white pt-10 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Column 1: Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-[#A0522D] mb-4">PetCareSL 🐾</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Your trusted partner for pet adoption, care tips, and premium pet products. 
                            We make sure your furry friends get the love they deserve.
                        </p>
                    </div>
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#C7E3B8]">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link to="/" className="hover:text-[#A0522D] transition">Home</Link></li>
                            <li><Link to="/products" className="hover:text-[#A0522D] transition">Marketplace</Link></li>
                            <li><Link to="/adoption" className="hover:text-[#A0522D] transition">Adopt a Pet</Link></li>
                            <li><Link to="/services" className="hover:text-[#A0522D] transition">Services</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#C7E3B8]">Contact Us</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>📍 123, Pet Street, Colombo 07</li>
                            <li>📞 +94 77 123 4567</li>
                            <li>✉️ support@petcaresl.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} PetCareSL. All Rights Reserved.
                </div>
            </div>
        </footer>


    )
}
export default Footer;