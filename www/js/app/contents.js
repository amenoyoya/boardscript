'use strict';

/**
 * @typedef {Object} ContentDefinition
 * @property {Function} [main] - Main content definition.
 * @property {Function} [side] - Side content definition.
 * @property {Function} [script] - JavaScript code to be executed after the contents are rendered. 
 */

/**
 * Contents definition codes.
 * System embedded contents should be named as `system_***`.
 * System embedded contents are unable to edit (save).
 *
 * @type {Object<string, ContentDefinition>}
 */
App.contents = {
  system_editor: {
    main: () => App.html`
      <div id="code-editor" class="min-h-full"></div>
    `,
    side: () => App.html`
      <div class="flex flex-wrap items-end">
        <select
          id="content-selector"
          class="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="" selected>New Content</option>
          ${
            Object.keys(App.contents).map((contentName) => App.html`
              <option value="${contentName}">${contentName}</option>
            `)
          }
        </select>
        <button id="save-content-btn" class="mr-4 text-3xl">
          <i class="game-icon game-icon-save" />
        </button>
        <button id="locate-content-btn" class="mr-4 text-3xl">
          <i class="game-icon game-icon-linked-rings" />
        </button>
      </div>
    `,
    script: () => {
      ace.config.set('basePath', './js/ace-1.9.5/');

      const aceEditor = ace.edit('code-editor', {
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/typescript',
        tabSize: 2,
        minLines: 2
      });

      /**
       * Save the content definition code.
       * System content (content name: `system_*`) cannot be saved.
       *
       * @param {string} contentName - Content name to be saved.
       * @returns {boolean} It returns false if the content name is invalid.
       */
      function saveContentDefinition(contentName) {
        const validContentName = contentName.trim();
        if (validContentName.length === 0) {
          console.error('コンテンツ名を入力してください');
          return false;
        }
        if (validContentName.match(/^system_/)) {
          console.error('システムコンテンツは編集できません');
          return false;
        }

        if (!App.contents[validContentName]) {
          // Create new content to the list.
          const option = document.createElement('option');

          option.value = validContentName;
          option.innerText = validContentName;
          document.getElementById('content-selector').appendChild(option);
        }
        App.contents[validContentName] = App.deserialize(
          aceEditor.getValue()
        );
        console.log(validContentName, App.contents[validContentName]);
        App.components.modal.close();
      }

      document.getElementById('content-selector')
        .addEventListener('change', (e) => {
          const contentDef = App.contents[e.target.value];

          aceEditor.setValue(
            contentDef
              ? App.serialize(contentDef)
              : ''
          );
        });

      document.getElementById('save-content-btn')
        .addEventListener('click', () => {
          const defaultSaveName =
            document.getElementById('content-selector').value;
          App.components.modal.open(() => App.html`
            <form onsubmit="${(e) => {
              e.preventDefault();
              saveContentDefinition(
                document.getElementById('contentSaveForm__contentName').value
              );
            }}">
              <div class="mb-6">
                <label for="contentSaveForm__contentName" class="block mb-2 text-gray-900 dark:text-gray-300">
                  Content Name
                </label>
                <input
                  type="text"
                  id="contentSaveForm__contentName"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="yourContentName"
                  value="${defaultSaveName}"
                  required
                />
              </div>
              <button
                type="submit"
                class="mr-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Save
              </button>
              <button
                class="mr-4 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 rounded-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
                onclick="${(e) => {
                  e.preventDefault();
                  App.components.modal.close();
                }}"
              >
                Cancel
              </button>
            </form>
          `);
          setTimeout(() => {
            document.getElementById('contentSaveForm__contentName').focus();
          }, 100);
        });

      document.getElementById('locate-content-btn')
        .addEventListener('click', () => {
          App.location.locate(
            document.getElementById('content-selector').value
          );
        });
    }
  },
  system_board: {
    main: (_props) => {
      const board = {
        width: 50,
        height: 50
      };
      return Array.from(
        { length: board.height },
        () => App.html`
          <div class="flex flex-nowrap">
            ${Array.from(
              { length: board.width },
              () => App.html`
                <div class="flex-none border border-gray-400 w-24 h-24"></div>
              `
            )}
          </div>
        `
      );
    }
  } 
};
