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
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex">
          {/* Sidebar - fixed width, sticky */}
          <aside className="w-64 shrink-0 border-r border-border">
            <div className="sticky top-20 pr-6">
              <Sidebar />
            </div>
          </aside>

          {/* Content - left aligned, max-width constrained */}
          <main className="flex-1 min-w-0">
            <article className="max-w-3xl pl-12 pr-8 pt-6 pb-24">
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
