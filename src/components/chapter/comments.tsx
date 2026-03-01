import { fetcher } from '@/services/api-server';
import { MessageSquare } from 'lucide-react';
import { ClientComments } from './client-comments';

interface CommentsProps {
  chapterId: number;
}

export interface CommentType {
  id: number;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
  parent: number | null;
  replies: CommentType[];
}

export async function Comments({ chapterId }: CommentsProps) {
  const comments = await fetcher<CommentType[]>(
    'comments',
    ['comments'],
    { chapter: chapterId }
  ).catch(() => []);

  return (
    <div className="w-full max-w-[800px] mx-auto mt-12 mb-16 px-4">
      <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">
          Comentários{' '}
          {comments.length > 0 ? `(${comments.length})` : ''}
        </h2>
      </div>

      <ClientComments chapterId={chapterId} comments={comments} />
    </div>
  );
}
