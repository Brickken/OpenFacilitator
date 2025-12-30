import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import rehypePrettyCode from 'rehype-pretty-code';

const nextConfig: NextConfig = {
  transpilePackages: ['@openfacilitator/core'],
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: true,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
