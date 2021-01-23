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
      label: 'Abstraction Levels',
      items: [
        {
          type: 'category',
          label: 'LineUp-lite Table',
          items: [
            'table/_index',
            {
              type: 'link',
              label: 'API',
              href: '/api/table',
            },
          ],
        },
        {
          type: 'category',
          label: 'LineUp-lite Hooks',
          items: [
            'hooks/_index',
            {
              type: 'link',
              label: 'API',
              href: '/api/components',
            },
          ],
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
            {
              type: 'link',
              label: 'API',
              href: '/api/components',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/_index'],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        {
          type: 'link',
          label: 'Table',
          href: '/api/table',
        },
        {
          type: 'link',
          label: 'Hooks',
          href: '/api/hooks',
        },
        {
          type: 'link',
          label: 'Components',
          href: '/api/components',
        },
      ],
    },
  ],
};
