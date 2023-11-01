import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'plugNmeet - Open source web conferencing system',
  tagline: 'WebRTC based Scalable, High Performance, Open source web conferencing that is simple to use and customizable',
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
        content: 'self-hosted WebRTC,self-hosted conference system,'+
        'open source web conference,open source video conference,open source audio conference,'+
        'open-source WebRTC,wordpress WebRTC,joomla WebRTC,moodle WebRTC,'+ 
        'wordpress video call,moodle video call,moodle video call,online class,free WebRTC'
      }
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;