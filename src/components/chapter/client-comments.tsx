'use client';

import { refreshTag, revalidateCache } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/services/api';
import { CornerDownRight, Send, Trash2, User } from 'lucide-react';
import * as React from 'react';
import type { CommentType } from './comments';

interface ClientCommentsProps {
  chapterId: number;
  comments: CommentType[];
}

export function ClientComments({
  chapterId,
  comments: initialComments,
}: ClientCommentsProps) {
  const { user } = useAuth();

  const [comments, setComments] =
    React.useState<CommentType[]>(initialComments);

  const refreshComments = async () => {
    try {
      const data = await api
        .get(`comments/`, { searchParams: { chapter: chapterId } })
        .json<CommentType[]>();
      setComments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const [content, setContent] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<number | null>(
    null
  );
  const [replyContent, setReplyContent] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    parentId: number | null = null
  ) => {
    e.preventDefault();
    if (!user) return;

    const text = parentId ? replyContent : content;
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`comments/`, {
        json: { content: text, parent: parentId, chapter: chapterId },
      });
      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setContent('');
      }
      refreshComments();
      revalidateCache('comments');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!user) return;
    if (!confirm('Tem certeza que deseja apagar este comentário?'))
      return;

    try {
      await api.delete(`comments/${commentId}/`);
      refreshComments();
      refreshTag('comments');
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderComment = (comment: CommentType, isReply = false) => {
    const isOwner = user && user.username === comment.user_name;

    return (
      <div
        key={comment.id}
        className={`flex gap-3 ${isReply ? 'ml-8 mt-4' : 'mt-6'}`}
      >
        {comment.user_avatar ? (
          <img
            src={comment.user_avatar}
            alt={comment.user_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <div className="bg-card w-full rounded-xl p-4 border border-border/40 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">
                {comment.user_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
              {comment.content}
            </p>

            <div className="mt-3 flex items-center gap-4">
              {user && (
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment.id ? null : comment.id
                    )
                  }
                  className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  Responder
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs font-medium text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Apagar
                </button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <form
              onSubmit={(e) => handleSubmit(e, comment.id)}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                placeholder="Escreva uma resposta..."
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !replyContent.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </form>
          )}

          {/* Replies */}
          {comment.replies &&
            comment.replies.map((reply) =>
              renderComment(reply, true)
            )}
        </div>
      </div>
    );
  };

  return (
    <>
      {user ? (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex gap-4 mb-8"
        >
          {user.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt="Seu avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              placeholder="O que achou deste capítulo?"
              className="w-full bg-card border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !content.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Comentar
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-muted/30 border border-border/50 rounded-xl p-6 text-center mb-8">
          <p className="text-muted-foreground text-sm mb-4">
            Entre na sua conta para participar da discussão.
          </p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/login')}
          >
            Fazer Login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-sm bg-card rounded-xl border border-border/20">
            Seja o primeiro a comentar!
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </>
  );
}
