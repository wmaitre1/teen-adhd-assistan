import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Calendar, Book, Heart, Settings } from 'lucide-react';
import { useStore } from '../../lib/store';

export function MobileNav() {
  const location = useLocation();
  const { user } = useStore();

  if (!user) return null;

  const basePrefix = user.role === 'parent' ? '/parent' : '';
  const navigation = [
    { name: 'Dashboard', href: `${basePrefix}/dashboard`, icon: Brain },
    { name: 'Tasks', href: `${basePrefix}/tasks`, icon: Calendar },
    { name: 'Homework', href: `${basePrefix}/homework`, icon: Book },
    { name: 'Mindfulness', href: `${basePrefix}/mindfulness`, icon: Heart },
    { name: 'Settings', href: `${basePrefix}/settings`, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              to={href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                location.pathname === href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}