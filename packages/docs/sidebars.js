module.exports = {
  someSidebar: [
    {
      type: 'category',
      label: 'LineUp-lite',
      items: ['_index', 'design-principles'],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/_index', 'getting-started/hooks', 'getting-started/components'],
    },
    {
      type: 'category',
      label: 'LineUp-lite Components',
      items: [
        'components/_index',
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
      items: [
        'hooks/_index',
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
      items: [
        'table/_index',
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
      items: [
        'examples/_index',
        'examples/animation',
        'examples/sidepanel',
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
