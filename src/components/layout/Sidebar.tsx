
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  BookOpen, 
  Bot, 
  User, 
  Shield,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/authStore';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'API Settings', url: '/api-settings', icon: Settings },
  { title: 'Knowledge Base', url: '/knowledge', icon: BookOpen },
  { title: 'Bot Settings', url: '/bot-settings', icon: Bot },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
  { title: 'Profile', url: '/profile', icon: User },
];

const adminItems = [
  { title: 'Admin Panel', url: '/admin', icon: Shield },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="sidebar-gradient w-64 min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-bold text-lg">ChatPilot</h1>
            <p className="text-sidebar-foreground/60 text-xs">AI Customer Service</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <Separator className="my-4 bg-sidebar-border" />
            {adminItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground font-medium text-sm truncate">
              {user?.name}
            </p>
            <p className="text-sidebar-foreground/60 text-xs truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
