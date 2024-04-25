export const filterDefinition = () => {
  return [
    {
      'id': 'screen',
      'components': ['teaser', 'image-list']
    },
    {
      'id': 'image-list',
      'components': ['adventure', 'article']
    }
  ];
};

export const modelDefinition = () => {
  return [
    {
      'id': 'teaser',
      'fields': [
        {
          'component': 'text-input',
          'name': 'title',
          'label': 'Title',
          'valueType': 'string'
        },
        {
          'component': 'text-area',
          'name': 'description',
          'label': 'Description',
          'valueType': 'string'
        },
        {
          'component': 'text-input',
          'name': 'callToAction',
          'label': 'Call to Action',
          'valueType': 'string'
        },
        {
          'component': 'asset',
          'name': 'asset',
          'label': 'Asset',
          'valueType': 'asset'
        }
      ]
    }
  ];
};

export const componentDefinition = (context) => {
  return {
    'groups': [
      {
        'title': 'teaser',
        'id': 'teaser',
        'components': [
          {
            'title': 'Teaser',
            'id': 'teaser',
            'plugins': {
              'aem': {
                'cf': {
                  'name': 'teaser',
                  'cfModel': '/conf/aem-demo-assets/settings/dam/cfm/models/teaser',
                  'cfFolder': `/content/dam/${context.project}/site/`,
                  'title': 'Teaser',
                  'description': 'Teaser Content Fragment',
                  'template': {
                    'title': 'The title',
                    'style': 'hero',
                    'asset': `/content/dam/${context.project}/assets/AdobeStock_238607111.jpeg`
                  }
                }
              }
            }
          }
        ]
      }
    ]
  };
};