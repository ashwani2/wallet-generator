// Sidebar.jsx
import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  setIsOpen, 
  darkMode, 
  setActiveComponent, 
  activeComponent,
  menuItems 
}) => {
  const handleNavigation = (componentId) => {
    setActiveComponent(componentId);
    // On mobile, close the sidebar after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 z-40 bg-gradient-to-b ${
        darkMode ? 'from-gray-800 to-gray-900 text-white' : 'from-white to-gray-50 text-gray-900'
      } shadow-xl p-6 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button
          className={`p-2 rounded-md ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                activeComponent === item.id
                  ? darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;