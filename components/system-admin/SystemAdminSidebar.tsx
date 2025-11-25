
import React from 'react';

type SystemAdminView = 'dashboard' | 'stats' | 'assignment' | 'reports' | 'settings';

interface SystemAdminSidebarProps {
  activeView: SystemAdminView;
  setActiveView: (view: SystemAdminView) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  stats: {
    inQueue: number;
    assigned: number;
    enRoute: number;
  };
}

const NavItem: React.FC<{
  view: SystemAdminView,
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const TruckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Stats Icons
const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


const SystemAdminSidebar: React.FC<SystemAdminSidebarProps> = ({ activeView, setActiveView, isOpen, setOpen, stats }) => {
    
  const handleNavClick = (view: SystemAdminView) => {
    setActiveView(view);
    if(window.innerWidth < 1024) {
        setOpen(false);
    }
  }

  const navItems = [
    { view: 'dashboard' as SystemAdminView, label: 'داشبورد', Icon: ChartBarIcon },
    { view: 'stats' as SystemAdminView, label: 'آمار رانندگان', Icon: ClipboardListIcon },
    { view: 'assignment' as SystemAdminView, label: 'تخصیص بار', Icon: TruckIcon },
    { view: 'reports' as SystemAdminView, label: 'گزارشات', Icon: DocumentTextIcon },
    { view: 'settings' as SystemAdminView, label: 'تنظیمات', Icon: CogIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      ></div>

      <aside className={`fixed lg:relative top-0 right-0 h-full bg-gray-900 text-white w-72 p-6 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 border-l border-gray-800 flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">پنل ادمین کل</h2>
                    <p className="text-xs text-gray-400">مدیریت سیستم</p>
                </div>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Live Stats Widget */}
        <div className="mb-6 grid grid-cols-3 gap-2">
            <div className="bg-gray-800/50 rounded-lg p-2 flex flex-col items-center justify-center border border-gray-700/50">
                <div className="text-emerald-400 mb-1">
                    <ClockIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">{stats.inQueue}</span>
                <span className="text-[10px] text-gray-400 text-center">در نوبت</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 flex flex-col items-center justify-center border border-gray-700/50">
                <div className="text-amber-400 mb-1">
                    <BoxIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">{stats.assigned}</span>
                <span className="text-[10px] text-gray-400 text-center">بار گرفته</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 flex flex-col items-center justify-center border border-gray-700/50">
                <div className="text-blue-400 mb-1">
                    <MapPinIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">{stats.enRoute}</span>
                <span className="text-[10px] text-gray-400 text-center">در مسیر</span>
            </div>
        </div>

        <nav className="space-y-1 flex-1">
          <ul className="space-y-2">
            {navItems.map(item => (
              <NavItem
                key={item.view}
                view={item.view}
                label={item.label}
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

export default SystemAdminSidebar;
