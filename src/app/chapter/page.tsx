'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import api from '@/services/api';
import { Loader, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ChapterSearch = () => {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      url: '',
    },
  });

  const getManga = async (link: string) => {
    const { data } = await api.get<TChapter>('/chapters/download', {
      params: {
        link,
      },
    });
    router.push(`/chapter/${data.id}`);
  };

  const onSubmit = handleSubmit((values) => {
    setSearching(true);

    toast.promise(getManga(values.url), {
      loading: 'Buscando capitulo...',
      success: 'Capitulo encontrado!',
      error: 'Erro ao buscar capitulo...',
      finally: () => setSearching(false),
    });
  });

  return (
    <div className="flex items-center justify-center min-h-svh w-full bg-neutral-200">
      <form
        className="flex flex-col gap-4 items-center justify-center w-full px-3"
        onSubmit={onSubmit}
      >
        <div className="relative flex items-center w-full max-w-3xl">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Insira a url do capitulo para ser traduzido..."
            className="w-full transition-all duration-500 pl-8"
            {...register('url')}
          />
        </div>

        <Button type="submit" disabled={searching}>
          {searching ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          {searching ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
    </div>
  );
};

export default ChapterSearch;
