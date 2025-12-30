import { Sidebar } from '@/components/docs/Sidebar';
import { Navbar } from '@/components/navbar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 max-w-4xl px-8 py-12">
          <article className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-semibold prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
