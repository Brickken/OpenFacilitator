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
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 flex justify-center min-w-0">
            <article className="w-full max-w-3xl px-8 py-12">
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
