'use strict';

(() => {
  eruda.init({
    autoScale: true,
    defaults: {
      transparency: 0.9,
      theme: 'Dark'
    }
  });

  App.show();

  App.installContent(App.Board.id, App.Board.title, App.Board.content);

  App.installContent(
    'json-editor',
    () => App.html`JSON Editor`,
    class extends preact.Component {
      render() {
        return App.html`<div class='m-2' id='json-editor'></div>`;
      }

      componentDidMount() {
        const editor = new JSONEditor(document.getElementById('json-editor'), {
          theme: 'tailwind',
          schema: {
            title: 'Person',
            type: 'object',
            required: [
              'name',
              'age',
              'date',
              'favorite_color',
              'gender',
              'location',
              'pets'
            ],
            properties: {
              name: {
                type: 'string',
                description: 'First and Last name',
                minLength: 4,
                default: 'Jeremy Dorn'
              },
              age: {
                type: 'integer',
                default: 25,
                minimum: 18,
                maximum: 99
              },
              favorite_color: {
                type: 'string',
                format: 'color',
                title: 'favorite color',
                default: '#ffa500'
              },
              gender: {
                type: 'string',
                enum: ['male', 'female', 'other']
              },
              date: {
                type: 'string',
                format: 'date',
                options: {
                  flatpickr: {}
                }
              },
              location: {
                type: 'object',
                title: 'Location',
                properties: {
                  city: {
                    type: 'string',
                    default: 'San Francisco'
                  },
                  state: {
                    type: 'string',
                    default: 'CA'
                  },
                  citystate: {
                    type: 'string',
                    description:
                      'This is generated automatically from the previous two fields',
                    template: '{{city}}, {{state}}',
                    watch: {
                      city: 'location.city',
                      state: 'location.state'
                    }
                  }
                }
              },
              pets: {
                type: 'array',
                format: 'table',
                title: 'Pets',
                uniqueItems: true,
                items: {
                  type: 'object',
                  title: 'Pet',
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['cat', 'dog', 'bird', 'reptile', 'other'],
                      default: 'dog'
                    },
                    name: {
                      type: 'string'
                    }
                  }
                },
                default: [
                  {
                    type: 'dog',
                    name: 'Walter'
                  }
                ]
              }
            }
          }
        });
      }
    }
  );
})();
