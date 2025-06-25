
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Project
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500" /> using modern web technologies
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © 2024 Your Project. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
