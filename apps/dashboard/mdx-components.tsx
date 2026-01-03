import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/docs/Callout';
import { PageHeader } from '@/components/docs/PageHeader';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    PageHeader,

    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-2 text-foreground">{children}</h1>
    ),

    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mt-12 mb-4 text-foreground first:mt-0">{children}</h2>
    ),

    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-8 mb-3 text-foreground">{children}</h3>
    ),

    h4: ({ children }) => (
      <h4 className="text-base font-semibold mt-6 mb-2 text-foreground">{children}</h4>
    ),

    p: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
    ),

    pre: ({ children }) => (
      <pre className="my-6 p-4 bg-[#0d1117] border border-border rounded-lg overflow-x-auto text-sm">
        {children}
      </pre>
    ),

    code: ({ children, className }) => {
      // Inline code (no className) vs code block (has className)
      if (!className) {
        return (
          <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },

    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),

    a: ({ href, children }) => (
      <a href={href} className="text-primary hover:text-primary/80 underline underline-offset-4">
        {children}
      </a>
    ),

    hr: () => (
      <hr className="my-12 border-border" />
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 my-6 text-muted-foreground italic">
        {children}
      </blockquote>
    ),

    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="border-b border-border">{children}</thead>
    ),

    th: ({ children }) => (
      <th className="text-left py-3 px-3 font-semibold text-foreground">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="py-3 px-3 border-b border-border text-muted-foreground">
        {children}
      </td>
    ),

    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),

    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
  };
}
