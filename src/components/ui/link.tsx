import NextLink from 'next/link';
import { ComponentProps } from 'react';

const Link: React.FC<
  ComponentProps<typeof NextLink> & {
    disabled?: boolean;
  }
> = ({ disabled, ...props }) => {
  const Component = disabled ? 'div' : NextLink;
  return <Component {...(props as any)} />;
};

export { Link };
