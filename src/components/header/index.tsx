'use client';

import { useEffect, useRef, useState } from 'react';

import {
  BookOpen,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from 'lucide-react';

import { NotificationBell } from '@/components/notifications/notification-bell';
import { CommandPalette } from '@/components/search/command-palette';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Mangás', href: '/mangas' },
  { label: 'Discord', href: 'https://discord.gg', external: true },
];

const Header: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle Command Palette with Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
          >
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-xl font-extrabold tracking-tight">
              BR<span className="text-primary">Scans</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search hint */}
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Buscar...</span>
              <kbd className="ml-2 text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {user && !loading && <NotificationBell />}

            {/* Favorites */}
            {user && (
              <Link href="/favoritos">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent border-border/50 hover:bg-accent"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </Link>
            )}

            {/* Auth */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
                    >
                      {user.profile?.avatar ? (
                        <img
                          src={user.profile.avatar}
                          alt={user.username}
                          className="w-7 h-7 rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                        {user.profile?.discord_username ||
                          user.username}
                      </span>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        <Link
                          href="/favoritos"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Favoritos
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-accent transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="default"
                      className="hidden sm:flex items-center gap-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-transparent border-border/50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-xl p-4 animate-in slide-in-from-top-2">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-border">
              {user ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/favoritos"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Favoritos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:bg-accent rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="default"
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <CommandPalette open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
};

export default Header;
