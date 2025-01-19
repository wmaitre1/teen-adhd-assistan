import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain, Calendar, Book, Heart, Notebook, Settings, LogOut } from 'lucide-react';
import { useStore } from '../../lib/store';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useStore();

  const getNavItems = () => {
    if (!user) return [];
    
    const basePrefix = user.role === 'parent' ? '/parent' : '';
    const items = [
      { name: 'Dashboard', href: `${basePrefix}/dashboard`, icon: Brain },
      { name: 'Tasks', href: `${basePrefix}/tasks`, icon: Calendar },
      { name: 'Homework', href: `${basePrefix}/homework`, icon: Book },
      { name: 'Mindfulness', href: `${basePrefix}/mindfulness`, icon: Heart },
      { name: 'Journal', href: `${basePrefix}/journal`, icon: Notebook },
      { name: 'Settings', href: `${basePrefix}/settings`, icon: Settings },
    ];

    return items;
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to={user?.role === 'parent' ? '/parent/dashboard' : '/dashboard'} 
            className="flex items-center space-x-2"
          >
            <Brain className="h-8 w-8" />
            <span className="text-2xl font-bold">ADHD Assist</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                to={href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === href
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  to={href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === href
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
