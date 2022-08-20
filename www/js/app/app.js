'use strict';

/**
 * Application variables.
 *
 * @typedef {Object} Application
 * @property {(string) => HResult|Array<HResult>} html - HTML virtual DOM renderer.
 * @property {(*, number) => string} serialize - Function for serializing an object to a string.
 * @property {(string) => Object} deserialize - Function for deserialize a string to an object.
 * @property {(string, preact.Component, preact.Component) => void} installContent - Function for installing a content.
 * @property {(string) => void} uninstallContent - Function for uninstalling a content.
 * @property {() => void} show - Function for showing the main content in the document.body.
 *
 * @type {Application}
 */
window.App = {
  /**
   * HTML virtual DOM renderer.
   */
  html: htm.bind(preact.h),

  /**
   * Serialize an object to a string.
   *
   * @param {*} object - An object to be serialized.
   * @param {number} [_indent] - Indent of the current processing object.
   * @returns {string} It returns a serialized string.
   */
  serialize: (object, _indent) => {
    const indent = _indent || 0;
    const objectType = Object.prototype.toString.call(object);

    if (objectType === '[object Array]') {
      return `[\n${
        object
          .map((v) => (' ').repeat(2 * (indent + 1)) + App.serialize(v, indent + 1))
          .join(',\n')
      }\n${(' ').repeat(2 * indent)}]`;
    }
    if (objectType === '[object Object]') {
      return `{\n${
        Object.entries(object)
          .map(([key, value]) => `${(' ').repeat(2 * (indent + 1))}${key}: ${App.serialize(value, indent + 1)}`)
          .join(',\n')
      }\n${(' ').repeat(2 * indent)}}`;
    }
    if (objectType === '[object Function]') {
      return object.toString();
    }
    return JSON.stringify(object);
  },

  /**
   * Deserialize a string to an object.
   *
   * @param {string} serialized - A string serialized by App.serialize.
   * @returns {*} It returns a deserialized object.
   */
  deserialize: (serialized) => {
    const generator = Function(`'use strict'; return ${serialized}`);

    return generator();
  },

  /**
   * Install a content. (New tab content)
   * This function will be activated after App.show() function is called.
   *
   * @param {string} id - Content ID.
   * @param {preact.Compoennt} title - Content title displaying in the tab.
   * @param {preact.Compoennt} content - Component object of the content. 
   */
  installContent: (id, name, content) => ({
    id, name, content
  }),

  /**
   * Uninstall a content. (Delete tab content)
   * This function will be activated after App.show() function is called.
   *
   * @param {string} id - Content ID to be uninstalled.
   */
  uninstallContent: (id) => ({
    id
  }),

  /**
   * Show the main content in the document.body.
   */
  show: () => {
    class Main extends preact.Component {
      state = {
        contents: [],
        activeTab: 0
      }

      render() {
        /**
         * Install content API.
         */
        App.installContent = (id, title, content) => {
          this.setState((state) => ({
            ...state,
            contents: [
              ...state.contents,
              {
                id,
                title,
                content
              }
            ]
          }));
        };

        /**
         * Uninstall content API.
         */
         App.uninstallContent = (id) => {
          this.setState((state) => ({
            ...state,
            contents: state.contents.filter(
              (content) => content.id !== id
            ),
            activeTab: 0 // Reset active tab to 0.
          }));
        };

        if (this.state.contents.length === 0) {
          return App.html`<main></main>`;
        }
        return App.html`
          <nav class="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul class="flex flex-nowrap w-full overflow-x-auto -mb-px text-sm font-medium text-center" id="nav-tab" data-tabs-toggle="#tab-content" role="tablist">
              ${
                this.state.contents.map((content, index) => App.html`
                  <li class="${index < this.state.contents.length - 1 ? 'mr-2': ''}" role="presentation">
                    <button
                      class="inline-block p-4 rounded-t-lg border-b-2 ${index === this.state.activeTab ? '': 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}"
                      id="${content.id}-tab"
                      data-tabs-target="#${content.id}"
                      type="button"
                      role="tab"
                      aria-controls="${content.id}"
                      aria-selected="${index === this.state.activeTab ? 'true': 'false'}"
                      onclick="${() => {
                        if (index !== this.state.activeTab) {
                          this.setState((state) => ({
                            ...state,
                            activeTab: index
                          }));
                        }
                      }}"
                    ><${content.title} /></button>
                  </li>
                `)
              }
            </ul>
          </nav>
          <main id="tab-content">
            ${
              this.state.contents.map((content, index) => App.html`
                <div class="${index === this.state.activeTab ? '' : 'hidden'}" id="${content.id}" role="tabpanel" aria-labelledby="${content.id}-tab">
                  <${content.content} />
                </div>
              `)
            }
          </main>
        `;
      }
    }

    preact.render(App.html`<${Main} />`, document.body);
  }
};
