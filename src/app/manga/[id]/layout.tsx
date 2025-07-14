import Manhwa from '@/services/actions/Manhwa';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await new Manhwa().get(id);

  if (!data) {
    return {
      title: 'Mangá não encontrado',
      description:
        'Este mangá não foi encontrado em nossa base de dados.',
    };
  }

  const keywords = [
    data.title,
    'manga',
    'manhwa',
    'ler online',
    'capítulos',
    ...(data.genres || []),
  ];

  const imageUrl =
    data.thumbnail?.original || '/public/mesh-gradient.png';

  return {
    title: data.title,
    description: `Leia ${data.title} online em português. Descubra a história, personagens e todos os capítulos disponíveis em nosso site.`,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/manga/${id}`,
    },
    openGraph: {
      title: data.title,
      description: `Leia ${data.title} online em português. Descubra a história, personagens e todos os capítulos disponíveis em nosso site.`,
      url: `/manga/${id}`,
      type: 'book',
      locale: 'pt_BR',
      images: [
        {
          url: imageUrl,
          alt: `Capa de ${data.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: `Leia ${data.title} online em português. Descubra a história, personagens e todos os capítulos disponíveis em nosso site.`,
      images: [imageUrl],
    },
  };
}

export default function MangaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
