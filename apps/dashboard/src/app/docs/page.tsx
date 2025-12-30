import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="not-prose">
      <h1 className="text-4xl font-bold tracking-tight">
        OpenFacilitator <span className="text-primary">Documentation</span>
      </h1>
      <p className="text-xl text-muted-foreground mt-4">
        Run your own x402 payment facilitator with full network support.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        <Link href="/docs/quickstart" className="block p-6 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
          <h3 className="font-semibold text-lg">Quickstart</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Get started in 5 minutes
          </p>
        </Link>

        <Link href="/docs/sdk" className="block p-6 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
          <h3 className="font-semibold text-lg">SDK Reference</h3>
          <p className="text-muted-foreground text-sm mt-1">
            TypeScript SDK documentation
          </p>
        </Link>

        <Link href="/docs/api" className="block p-6 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
          <h3 className="font-semibold text-lg">HTTP API</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Raw API endpoints
          </p>
        </Link>

        <Link href="/docs/networks" className="block p-6 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
          <h3 className="font-semibold text-lg">Networks</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Supported chains and IDs
          </p>
        </Link>
      </div>
    </div>
  );
}
