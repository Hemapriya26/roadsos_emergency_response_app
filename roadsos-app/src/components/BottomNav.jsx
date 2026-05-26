import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const getNavClass = ({ isActive }) => 
    `flex flex-col items-center justify-center px-4 py-1.5 active:scale-95 transition-all duration-150 group ${
      isActive 
        ? 'bg-primary-container dark:bg-primary-fixed text-on-primary-container dark:text-on-primary-fixed rounded-full' 
        : 'text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed-dim'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-3 pt-2 bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-xl border-t border-outline-variant/30 dark:border-outline/20 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:hidden"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
    >
      <NavLink to="/" className={getNavClass}>
        <span className="material-symbols-outlined text-[22px] mb-0.5 transition-transform group-hover:scale-110">dashboard</span>
        <span className="font-label-md text-[11px] leading-tight">Dashboard</span>
      </NavLink>
      <NavLink to="/nearby" className={getNavClass}>
        <span className="material-symbols-outlined text-[22px] mb-0.5 transition-transform group-hover:scale-110">map</span>
        <span className="font-label-md text-[11px] leading-tight">Nearby</span>
      </NavLink>
      <NavLink to="/contacts" className={getNavClass}>
        <span className="material-symbols-outlined text-[22px] mb-0.5 transition-transform group-hover:scale-110">group</span>
        <span className="font-label-md text-[11px] leading-tight">Contacts</span>
      </NavLink>
      <NavLink to="/settings" className={getNavClass}>
        <span className="material-symbols-outlined text-[22px] mb-0.5 transition-transform group-hover:scale-110">settings</span>
        <span className="font-label-md text-[11px] leading-tight">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
