import {
  BookOpenText,
  Heart,
  LogIn,
  Plus,
  ScrollText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="py-10 px-2 md:px-12">
      <nav className="flex justify-between">
        <Link href="/">
          <h1 className="font-extrabold text-2xl uppercase">Logo</h1>
        </Link>

        <ul className="gap-6 text-slate-400 hidden sm:flex">
          <Link href="/">
            <li className="cursor-pointer transition-colors hover:text-slate-700">
              Início
            </li>
          </Link>
          <li className="cursor-pointer transition-colors hover:text-slate-700">
            Novos
          </li>
          <li className="cursor-pointer transition-colors hover:text-slate-700">
            Popular
          </li>
          <li className="cursor-pointer transition-colors hover:text-slate-700">
            Notícias
          </li>
          <li className="cursor-pointer transition-colors hover:text-slate-700">
            Discord
          </li>
        </ul>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Adicionar novo:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="text-slate-600">
                <Link href="/manga">
                  <DropdownMenuItem>
                    <ScrollText className="w-4 h-4 mr-1.5" />
                    Capítulo
                  </DropdownMenuItem>
                </Link>
                <Link href="/manga">
                  <DropdownMenuItem>
                    <BookOpenText className="w-4 h-4 mr-1.5" />
                    Manga
                  </DropdownMenuItem>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="gap-2 px-3">
            Entrar
            <LogIn className="w-4 h-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
