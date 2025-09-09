import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'plugNmeet | Open Source Web Conferencing System',
  tagline: 'The free and open-source video conferencing platform for full control and privacy. Host scalable, customizable meetings on your own servers.',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://www.plugnmeet.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'mynaparrot', // Usually your GitHub org/user name.
  projectName: 'plugNmeet-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mynaparrot/plugNmeet-docs/edit/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
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
          href: 'https://www.plugnmeet.cloud',
          label: 'Cloud',
          position: 'right',
        },
        {
          href: 'https://plugnmeet.medium.com',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://demo.plugnmeet.com/landing.html',
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
            {
              label: 'Cloud',
              href: 'https://www.plugnmeet.cloud',
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
              label: 'Discord chat',
              href: 'https://discord.gg/2X2ZaCHu4C',
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
              href: 'https://demo.plugnmeet.com/landing.html',
            },
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MynaParrot SL.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      {
        name: 'keywords',
          content: 'webrtc, self-hosted, on-premise, open source, video conferencing, web conference, video call, video chat, online meetings, webinar, zoom alternative, jitsi alternative, BigBlueButton alternative, wordpress webrtc, joomla webrtc, moodle webrtc, online class, free webrtc, video conferencing api, video conferencing sdk'
      }
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;