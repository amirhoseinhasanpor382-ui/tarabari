
import React from 'react';

type AdminView = 'dashboard' | 'users' | 'settings' | 'managerDetails' | 'requests' | 'reports' | 'alerts' | 'vehicles' | 'workshop';

interface SidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  hasUnreadAlerts: boolean;
}

const NavItem: React.FC<{
  view: AdminView,
  label: React.ReactNode,
  Icon: React.ElementType,
  isActive: boolean,
  onClick: () => void
}> = ({ view, label, Icon, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1.5 rounded-xl transition-all duration-300 group ${
        isActive 
          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 translate-x-1' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-1'
      }`}
    >
      <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="mr-3 font-medium relative tracking-wide">{label}</span>
    </a>
  </li>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IdentificationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4m-9 4h2m-2 4h4m4-4h2m-2 4h4m-6-4v4" />
    </svg>
);

const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-2H5M17 16l-4-4" />
  </svg>
);

const WrenchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17l-4.242-4.242a2.652 2.652 0 010-3.75l4.242-4.242a2.652 2.652 0 013.75 0l4.242 4.242a2.652 2.652 0 010 3.75l-4.242 4.242M11.42 15.17L15.17 11.42" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setOpen, hasUnreadAlerts }) => {
    
  const handleNavClick = (view: AdminView) => {
    setActiveView(view);
    if(window.innerWidth < 1024) { // Tailwind's lg breakpoint
        setOpen(false);
    }
  }

  const navItems = [
    { view: 'dashboard' as AdminView, label: 'آمار و گزارشات', Icon: ChartBarIcon },
    { view: 'alerts' as AdminView, label: 'هشدارها و اعلانات', Icon: BellIcon },
    { view: 'requests' as AdminView, label: 'مدیریت درخواست‌ها', Icon: ClipboardListIcon },
    { view: 'managerDetails' as AdminView, label: 'لیست مدیران', Icon: IdentificationIcon },
    { view: 'users' as AdminView, label: 'مدیریت کارکنان', Icon: UsersIcon },
    { view: 'vehicles' as AdminView, label: 'ناوگان خودرویی', Icon: TruckIcon },
    { view: 'workshop' as AdminView, label: 'تعمیرگاه مرکزی', Icon: WrenchIcon },
    { view: 'reports' as AdminView, label: 'گزارش‌گیری جامع', Icon: DocumentTextIcon },
    { view: 'settings' as AdminView, label: 'تنظیمات سیستم', Icon: CogIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      ></div>

      <aside className={`fixed lg:relative top-0 right-0 h-full bg-gray-900 text-white w-72 p-6 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 border-l border-gray-800`}>
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <TruckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">پنل مدیریت</h2>
                    <p className="text-xs text-gray-400">سیستم ترابری سنگین</p>
                </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <nav className="space-y-1">
          <ul className="space-y-2">
            {navItems.map(item => (
              <NavItem
                key={item.view}
                view={item.view}
                label={
                  <>
                    {item.label}
                    {item.view === 'alerts' && hasUnreadAlerts && (
                       <span className="absolute top-0 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-gray-900"></span>
                      </span>
                    )}
                  </>
                }
                Icon={item.Icon}
                isActive={activeView === item.view}
                onClick={() => handleNavClick(item.view)}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
