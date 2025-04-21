import Image from 'next/image';

import { Button } from '../ui/button';
import ContainerAnimation from '../ui/container-animation';
import { Link } from '../ui/link';
import { SplitTextPoor } from '../ui/split-text-poor';

import { searchManga } from '@/services/anilist';

import anilistImage from '@/public/anilist.svg';

const ChapterDescription: React.FC<{
  manga: TManga;
}> = async ({ manga }) => {
  const anilist = await searchManga(manga?.title);

  return (
    <div>
      <>
        <SplitTextPoor
          split=""
          config="sm"
          className="text-lg font-semibold"
        >
          Description:
        </SplitTextPoor>
        <ContainerAnimation className="text-sm">
          <p
            dangerouslySetInnerHTML={{
              __html: anilist?.description || manga.description,
            }}
          />
        </ContainerAnimation>
      </>

      {anilist && (
        <ContainerAnimation delay={0.2}>
          <Link
            href={`https://anilist.co/manga/${anilist?.id}`}
            target="_blank"
          >
            <Button className="mt-4">
              <Image
                src={anilistImage}
                alt="Anilist"
                className="size-5 mr-2"
              />
              Ver no Anilist
            </Button>
          </Link>
        </ContainerAnimation>
      )}
    </div>
  );
};
export { ChapterDescription };
