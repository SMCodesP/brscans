import { SWRProvider } from '@/providers/swr-provider';

const LayoutChapter: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <SWRProvider>{children}</SWRProvider>;
};

export default LayoutChapter;
