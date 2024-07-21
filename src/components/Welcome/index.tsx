import Image from 'next/image';

import { Quote } from 'lucide-react';

import { cn } from '@/lib/utils';
import getQuote from '@/services/quote';
import { getLuminance, transparentize } from 'polished';

const Welcome: React.FC = async () => {
  const data = await getQuote();

  const isLight = getLuminance(data.color_anime) < 0.25;

  return (
    <div
      className={cn(
        'flex relative w-full min-h-96 rounded-lg md:!bg-transparent'
      )}
      style={{
        boxShadow: `0 0 10px 0 ${data.color_anime}`,
        background: data.color_anime,
      }}
    >
      <div
        className="flex flex-col sm:flex-row pt-20 pl-16 pb-8 pr-8 gap-4 sm:gap-4 md:gap-8 lg:gap-16 xl:gap-24 w-full z-10 justify-between rounded-lg"
        style={{
          background: `linear-gradient(to right, ${data.color_anime} 80%, ${transparentize(0.5, data.color_anime)})`,
        }}
      >
        <div
          className={cn(isLight ? 'text-slate-100' : 'text-gray-800')}
        >
          <div className="relative">
            <Quote className="absolute -top-8 -start-8 size-16 text-gray-100/20 dark:text-neutral-700 rotate-180 stroke-[3px]" />
            <div className="relative z-10">
              <q className="font-semibold italic text-xl">
                {data.quote}
              </q>
            </div>
          </div>
          <div className="mt-8">
            <p className="font-medium text-lg italic">
              - {data.character}
            </p>
          </div>
        </div>
        <Image
          src={data.image_character}
          width={128}
          height={128}
          className="rounded-lg self-center w-1/2 md:self-end md:w-32"
          alt="Character"
        />
      </div>
      <div className="absolute self-end right-0 top-0 h-full aspect-[6/8] hidden md:flex">
        <Image
          src={data.image_anime}
          width={384}
          height={384}
          className="h-full w-full object-cover rounded-md"
          alt="Anime"
        />
      </div>
    </div>
  );
};

export default Welcome;
