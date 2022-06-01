module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'LineUp-lite',
      link: {
        type: 'doc',
        id: 'index',
      },
      items: ['design-principles'],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
      items: ['getting-started/hooks', 'getting-started/components'],
    },
    {
      type: 'category',
      label: 'LineUp-lite Components',
      link: {
        type: 'doc',
        id: 'components/index',
      },
      items: [
        'components/text',
        'components/categorical',
        'components/number',
        'components/date',
        'components/set',
        'components/numbers',
        {
          type: 'link',
          label: 'API',
          href: 'https://lineup-lite.js.org/api/components/modules.html',
        },
      ],
    },
    {
      type: 'category',
      label: 'LineUp-lite Hooks',
      link: {
        type: 'doc',
        id: 'hooks/index',
      },
      items: [
        'hooks/useRowRankColumn',
        'hooks/useRowSelectColumn',
        'hooks/useRowExpandColumn',
        'hooks/useStats',
        'hooks/renderers',
        {
          type: 'link',
          label: 'API',
          href: 'https://lineup-lite.js.org/api/components/modules.html',
        },
      ],
    },
    {
      type: 'category',
      label: 'LineUp-lite Table',
      link: {
        type: 'doc',
        id: 'table/index',
      },
      items: [
        'table/LineUpLite',
        'table/LineUpLiteVirtual',
        'table/SidePanel',
        'table/IconPacks',
        {
          type: 'link',
          label: 'API',
          href: 'https://lineup-lite.js.org/api/table/modules.html',
        },
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      link: {
        type: 'doc',
        id: 'examples/index',
      },
      items: [
        'examples/animation',
        'examples/sidepanel',
        'examples/filter-action',
        'examples/virtualized-rows',
        'examples/pagination',
        'examples/fontawesome',
        'examples/controlled-state',
        'examples/multi-sorting',
        'examples/i18n',
        'examples/sets',
        'examples/numbers',
        'examples/stackedbar',
        'examples/column-resizing',
        'examples/flex-layout',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        {
          type: 'link',
          label: 'Table',
          href: 'https://lineup-lite.js.org/api/table/modules.html',
        },
        {
          type: 'link',
          label: 'Hooks',
          href: 'https://lineup-lite.js.org/api/hooks/modules.html',
        },
        {
          type: 'link',
          label: 'Components',
          href: 'https://lineup-lite.js.org/api/components/modules.html',
        },
      ],
    },
    'faq',
  ],
};
