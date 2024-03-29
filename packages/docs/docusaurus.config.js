const path = require('path');
const exec = require('child_process').execSync;
const pkg = require('./package.json');

require('dotenv').config({
  path: path.resolve('../../.env'),
});

function resolveGitBranch() {
  return exec('git rev-parse --abbrev-ref HEAD').toString();
}

module.exports = {
  title: 'LineUp-lite',
  tagline: 'a LineUp implementation based on react-table',
  url: 'https://lineup-lite.js.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'sgratzl', // Usually your GitHub org/user name.
  projectName: 'lineup-lite', // Usually your repo name.
  customFields: {
    branch: resolveGitBranch(),
    version: pkg.version,
  },
  themeConfig: {
    image: 'img/preview.png',
    metadata: [{ name: 'twitter:card', content: 'summary' }],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'star_me', // Any value that will identify this message.
      content:
        '⭐️ If you like and use <a target="_blank" rel="noopener noreferrer" href="https://github.com/sgratzl/lineup-lite">@lineup-lite</a>, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/sgratzl/lineup-lite">GitHub</a>! ⭐️!',
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'LineUp Lite',
      hideOnScroll: true,
      logo: {
        alt: 'LineUp Lite',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'api',
          activeBasePath: 'api',
          label: 'API',
          position: 'left',
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/sgratzl/lineup-lite',
          label: 'GitHub',
          position: 'right',
        },
        {
          label: '@sgratzl',
          href: 'https://github.com/sgratzl',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Docs',
              to: 'docs',
            },
            {
              label: 'Getting Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Examples',
              to: 'docs/examples',
            },
            {
              label: 'API Reference',
              to: 'api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sgratzl/lineup-lite',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/sgratzl/lineup-lite/dicussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: '@sgratzl',
              href: 'https://github.com/sgratzl',
            },
            {
              label: 'LineUp.js',
              href: 'https://lineup.js.org',
            },
            {
              label: 'UpSet.js',
              href: 'https://upset.js.org',
            },
          ],
        },
      ],
      copyright: `<a href="https://github.com/sgratzl/lineup-lite/releases/v${pkg.version}">v${
        pkg.version
      }</a>. Copyright © ${new Date().getFullYear()} <a href="https://www.sgratzl.com">Samuel Gratzl</a>. All rights reserved. Built with Docusaurus.`,
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: 'lineup-lite',

      // Optional: see doc section bellow
      contextualSearch: false,

      // Optional: Algolia search parameters
      searchParameters: {},

      //... other Algolia params
    },
  },
  themes: ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/sgratzl/lineup-lite/edit/main/packages/docs',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/main/packages/docs',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
