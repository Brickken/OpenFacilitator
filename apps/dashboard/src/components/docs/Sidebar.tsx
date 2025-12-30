'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { title: 'Overview', href: '/docs' },
  { title: 'Quickstart', href: '/docs/quickstart' },
  {
    title: 'SDK',
    href: '/docs/sdk',
    children: [
      { title: 'Installation', href: '/docs/sdk/installation' },
      { title: 'verify()', href: '/docs/sdk/verify' },
      { title: 'settle()', href: '/docs/sdk/settle' },
      { title: 'supported()', href: '/docs/sdk/supported' },
      { title: 'Networks', href: '/docs/sdk/networks' },
      { title: 'Errors', href: '/docs/sdk/errors' },
    ],
  },
  { title: 'HTTP API', href: '/docs/api' },
  { title: 'Networks', href: '/docs/networks' },
  { title: 'DNS Setup', href: '/docs/dns-setup' },
  { title: 'Self-Hosting', href: '/docs/self-hosting' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0">
      <div className="sticky top-20 py-6 pr-4 space-y-0.5">
        {navigation.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'block px-3 py-1.5 rounded-md text-sm',
                pathname === item.href
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.title}
            </Link>
            {item.children && (
              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/50 pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'block px-2 py-1 rounded text-sm',
                      pathname === child.href
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
