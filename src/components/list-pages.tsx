import { Loader } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { TabsCookies, TabsList, TabsTrigger } from './ui/tabs';

async function ListPages({
  chapter,
}: {
  chapter: TChapter;
}) {
  const type = (await cookies()).get('type')?.value || 'original';
  const isTranslating = chapter?.pages?.some(
    (page) => page.images.translated === null
  );

  return (
    <TabsCookies
      name="type"
      defaultValue="original"
      className="relative flex flex-col"
      value={type}
    >
      <TabsList className="sticky top-4 w-full">
        <TabsTrigger className="flex-1" value="original">
          Original
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="translated">
          {isTranslating ? 'Traduzindo...' : 'Português (Brazil)'}
        </TabsTrigger>
      </TabsList>
      <div>
        {((!isTranslating && type === 'translated') ||
          type !== 'translated') &&
          chapter?.pages?.map((page, index) => (
            <Image
              key={page.id}
              src={String((page.images as any)[type || 'original'])}
              alt=""
              className="w-full"
              priority={index === 0}
              width={1000}
              height={1000}
              unoptimized
            />
          ))}
        {chapter?.pages?.length === 0 && (
          <div className="flex flex-col gap-4 mt-20 items-center justify-center w-full">
            <Loader className="w-8 h-8 animate-spin" />
            <div>
              <h2 className="text-xl text-center text-neutral-600 font-semibold">
                Carregando...
              </h2>
              <h3 className="text-neutral-600">
                Aguarde um momento.
              </h3>
            </div>
          </div>
        )}
        {isTranslating && type === 'translated' && (
          <div className="flex flex-col gap-4 mt-20 items-center justify-center w-full">
            <Loader className="w-8 h-8 animate-spin" />
            <div>
              <h2 className="text-xl text-center text-neutral-600 font-semibold">
                Traduzindo...
              </h2>
              <h3 className="text-neutral-600">
                Aguarde um momento.
              </h3>
            </div>
          </div>
        )}
      </div>
    </TabsCookies>
  );
}

export { ListPages };
