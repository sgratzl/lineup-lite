module.exports = {
  title: 'LineUp Lite',
  tagline: 'a LineUp implementation based on react-table',
  url: 'https://lineup-lite.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'sgratzl', // Usually your GitHub org/user name.
  projectName: 'lineup-lite', // Usually your repo name.
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'star_me', // Any value that will identify this message.
      content:
        '⭐️ If you like and use <a target="_blank" rel="noopener noreferrer" href="https://github.com/sgratzl/lineup-lite">@lineup-lite</a>, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/sgratzl/lineup-lite">GitHub</a>! ⭐️!',
    },
    navbar: {
      title: 'LineUp Lite',
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
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/sgratzl/lineup-lite',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/getting-started',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sgratzl/lineup-lite',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Samuel Gratzl Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/sgratzl/lineup-lite/edit/main/packages/docs',
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
