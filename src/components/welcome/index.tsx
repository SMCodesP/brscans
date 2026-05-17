import Image from 'next/image';

import { Quote } from 'lucide-react';

import { cn } from '@/lib/utils';
import getQuote from '@/services/quote';
import { getLuminance, transparentize } from 'polished';

const Welcome: React.FC = async () => {
  const data = await getQuote();

  if (!data) {
    return null;
  }

  const isLight = getLuminance(data.color_anime) < 0.25;

  return (
    <div
      className={cn(
        'flex relative w-full min-h-72 sm:min-h-80 rounded-2xl overflow-hidden md:bg-transparent!'
      )}
      style={{
        boxShadow: `0 0 40px 0 ${transparentize(0.7, data.color_anime)}`,
        background: data.color_anime,
      }}
    >
      <div
        className="flex flex-col sm:flex-row pt-16 pl-8 sm:pl-12 pb-8 pr-8 gap-4 sm:gap-4 md:gap-8 lg:gap-16 xl:gap-24 w-full z-10 justify-between rounded-2xl"
        style={{
          background: `linear-gradient(to right, ${data.color_anime} 75%, ${transparentize(0.6, data.color_anime)})`,
        }}
      >
        <div
          className={cn(isLight ? 'text-slate-100' : 'text-gray-800')}
        >
          <div className="relative">
            <Quote className="absolute -top-6 -start-6 size-12 text-white/15 rotate-180 stroke-[3px]" />
            <div className="relative z-10">
              <q className="font-semibold italic text-lg sm:text-xl leading-relaxed">
                {data.quote}
              </q>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-medium text-base italic opacity-80">
              — {data.character}
            </p>
          </div>
        </div>
        <Image
          src={data.image_character}
          width={128}
          height={128}
          className="rounded-xl self-center w-1/3 sm:w-28 md:self-end md:w-32"
          alt="Character"
        />
      </div>
      <div className="absolute self-end right-0 top-0 h-full aspect-square hidden md:flex">
        <Image
          src={data.image_anime}
          width={384}
          height={384}
          className="h-full w-full object-cover rounded-2xl"
          alt="Anime"
        />
      </div>
    </div>
  );
};

export default Welcome;
