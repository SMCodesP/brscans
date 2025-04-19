import ContainerAnimation from '../ui/container-animation';
import { SplitTextPoor } from '../ui/split-text-poor';

import { searchManga } from '@/services/anilist';

const ChapterDescription: React.FC<{
  manga: TManga;
}> = async ({ manga }) => {
  const anilist = await searchManga(manga?.title);

  return (
    <div>
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
            __html: anilist?.description,
          }}
        />
      </ContainerAnimation>
    </div>
  );
};
export { ChapterDescription };
