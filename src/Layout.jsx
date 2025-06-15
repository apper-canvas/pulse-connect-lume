import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Desktop Header */}
      <header className="hidden md:flex flex-shrink-0 h-16 bg-surface border-b border-surface-200 z-40">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-6xl">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg custom-gradient flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-surface-900">Pulse Connect</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-surface-600 hover:text-primary hover:bg-surface-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full rounded-full bg-surface-100 flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-surface-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar - Hidden, using header navigation instead */}
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex-shrink-0 bg-surface border-t border-surface-200 z-40">
        <nav className="flex items-center justify-around py-2">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 p-2 transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-surface-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}>
                    <ApperIcon
                      name={route.icon}
                      className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-surface-500'}`}
                    />
                  </div>
                  <span className="text-xs font-medium">{route.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;