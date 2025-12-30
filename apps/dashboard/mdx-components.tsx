import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/docs/Callout';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
  };
}
