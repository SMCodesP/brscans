'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/services/api';
import { Bell, Check, CheckCircle2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import useSWR from 'swr';

interface NotificationType {
  id: number;
  type: string;
  manhwa_title: string;
  manhwa: string;
  chapter_title: string;
  chapter: string;
  read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const { user, token } = useAuth();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const fetcher = (url: string) =>
    api
      .get(url, { headers: { Authorization: `Token ${token}` } })
      .json<NotificationType[]>();

  const { data: notifications, mutate } = useSWR(
    user && token ? `notifications/` : null,
    fetcher,
    { refreshInterval: 60000 } // Refresh every minute
  );

  const unreadCount =
    notifications?.filter((n) => !n.read).length || 0;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id: number) => {
    if (!token) return;
    try {
      await api.post(`notifications/${id}/read/`, {
        headers: { Authorization: `Token ${token}` },
      });
      mutate();
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const markAllAsRead = async () => {
    if (!token || unreadCount === 0) return;
    try {
      await api.post(`notifications/read-all/`, {
        headers: { Authorization: `Token ${token}` },
      });
      mutate();
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  const now = Date.now();
  const formatDate = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="icon"
        className="relative bg-transparent border-border/50 hover:bg-accent"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-sm">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {!notifications ? (
              <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
                Carregando...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Você não possui notificações no momento.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex flex-col gap-1 p-4 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/manga/${notif.manhwa}/chapter/${notif.chapter}/`}
                        className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                        onClick={() => {
                          if (!notif.read) markAsRead(notif.id);
                          setOpen(false);
                        }}
                      >
                        <span className="text-primary mr-1">
                          Novo Capítulo:
                        </span>
                        {notif.manhwa_title} - {notif.chapter_title}
                      </Link>
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"
                          title="Marcar como lida"
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications && notifications.length > 0 && (
            <div className="p-2 border-t border-border bg-muted/10 text-center">
              <span className="text-xs text-muted-foreground">
                Fim das notificações
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
