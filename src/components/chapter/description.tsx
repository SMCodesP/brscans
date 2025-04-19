import { TabItem } from '../ui/animated-tabs';
import { AnimatedTabs, TabProvider } from '../ui/animated-tabs';
import ContainerAnimation from '../ui/container-animation';
import { SplitTextPoor } from '../ui/split-text-poor';

import { searchManga } from '@/services/anilist';
import { translate } from '@/services/translate';

const ChapterDescription: React.FC<{
  manga: TManga;
}> = async ({ manga }) => {
  const anilist = await searchManga(manga?.title);
  const descriptionPortuguese = await translate(anilist?.description);

  return (
    <TabProvider defaultTab="portuguese">
      <AnimatedTabs
        tabs={[
          { label: 'Português', value: 'portuguese' },
          { label: 'English', value: 'english' },
        ]}
      />

      <TabItem value="portuguese">
        <div>
          <SplitTextPoor
            split=""
            config="sm"
            className="text-lg font-semibold"
          >
            Descrição:
          </SplitTextPoor>
          <ContainerAnimation className="text-sm">
            <p
              dangerouslySetInnerHTML={{
                __html: descriptionPortuguese,
              }}
            />
          </ContainerAnimation>
        </div>
      </TabItem>
      <TabItem value="english">
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
      </TabItem>
    </TabProvider>
  );
};
export { ChapterDescription };
