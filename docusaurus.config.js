// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'plugNmeet - Open source web conferencing system',
  tagline: 'WebRTC based Scalable, High Performance, Open source web conferencing that is simple to use and customizable',
  url: 'https://www.plugnmeet.org/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'mynaparrot', // Usually your GitHub org/user name.
  projectName: 'plugNmeet-server', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/mynaparrot/plugNmeet-docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'plugNmeet',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'right',
            label: 'Getting Started',
          },
          {
            type: 'doc',
            docId: 'user-guide/overview',
            position: 'right',
            label: 'User Guide',
          },
          {
            type: 'doc',
            docId: 'api/intro',
            position: 'right',
            label: 'API',
          },
          {
            href: 'https://plugnmeet.medium.com',
            label: 'Blog',
            position: 'right',
          },
          {
            href: 'https://demo.plugnmeet.com/login.html',
            label: 'Demo',
            position: 'right',
          },
          {
            href: 'https://github.com/mynaparrot/plugNmeet-server',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Quick links',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
              {
                label: 'API',
                to: '/docs/api/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'https://github.com/mynaparrot/plugNmeet-server/discussions',
              },
              {
                label: 'Slack',
                href: 'https://join.slack.com/t/plugnmeet/shared_invite/zt-1ex9xaydu-RiN6VunWBHo8UDn2P1XQRg',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/mynaparrot/plugNmeet-server',
              },
              {
                label: 'Blog',
                href: 'https://plugnmeet.medium.com',
              },
              {
                label: 'Demo',
                href: 'https://demo.plugnmeet.com/login.html',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MynaParrot SL.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
