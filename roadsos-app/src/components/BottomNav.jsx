import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const getNavClass = ({ isActive }) => 
    `flex flex-col items-center justify-center px-5 py-1 active:scale-95 transition-all duration-150 group ${
      isActive 
        ? 'bg-primary-container dark:bg-primary-fixed text-on-primary-container dark:text-on-primary-fixed rounded-full' 
        : 'text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pt-2 pb-safe-bottom-zone bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-xl border-t border-outline-variant/30 dark:border-outline/20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden rounded-t-xl">
      <NavLink to="/" className={getNavClass}>
        <span className="material-symbols-outlined mb-1 transition-transform group-hover:scale-110">dashboard</span>
        <span className="font-label-md text-label-md">Dashboard</span>
      </NavLink>
      <NavLink to="/nearby" className={getNavClass}>
        <span className="material-symbols-outlined mb-1 transition-transform group-hover:scale-110">map</span>
        <span className="font-label-md text-label-md">Nearby</span>
      </NavLink>
      <NavLink to="/contacts" className={getNavClass}>
        <span className="material-symbols-outlined mb-1 transition-transform group-hover:scale-110">group</span>
        <span className="font-label-md text-label-md">Contacts</span>
      </NavLink>
      <NavLink to="/settings" className={getNavClass}>
        <span className="material-symbols-outlined mb-1 transition-transform group-hover:scale-110">settings</span>
        <span className="font-label-md text-label-md">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
