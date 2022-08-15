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
  /**
   * Board game content.
   */
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
  },

  /**
   * Contents editor content.
   */
  system_editor: {
    main: () => App.html`
      <div id="code-editor" class="min-h-full"></div>

      <script>
        ace.config.set('basePath', './js/ace-1.9.5/');

        ace.currentEditor = ace.edit('code-editor', {
          theme: 'ace/theme/monokai',
          mode: 'ace/mode/typescript',
          value: '',
          tabSize: 2,
          minLines: 2
        });
      </script>
    `,
    side: class extends preact.Component {
      state = {
        contents: []
      }

      constructor(props) {
        super(props);
        this.state.contents = Object.keys(App.contents);
      }

      render() {
        /**
         * Save the content definition code.
         * System content (content name: `system_*`) cannot be saved.
         *
         * @param {string} contentName - Content name to be saved.
         * @returns {boolean} It returns false if the content name is invalid.
         */
        const saveContentDefinition = (contentName) => {
          const validContentName = contentName.trim();
          if (validContentName.length === 0) {
            iziToast.error({
              message: 'コンテンツ名を入力してください'
            });
            return false;
          }
          if (validContentName.match(/^system_/)) {
            iziToast.error({
              message: 'システムコンテンツは編集できません'
            });
            return false;
          }

          // Update contents list.
          App.contents[validContentName] = App.deserialize(
            ace.currentEditor.getValue()
          );
          this.setState((state) => {
            return {
              ...state,
              contents: Object.keys(App.contents)
            }
          });

          // Show toast message and close the modal.
          iziToast.success({
            message: `コンテンツが保存されました: ${validContentName}`
          });
          App.components.modal.close();
        };

        /**
         * Update the editor content.
         *
         * @param {Event} e - Change event object.
         */
        const updateEditorContent = (e) => {
          const contentDef = App.contents[e.target.value];

          ace.currentEditor.setValue(
            contentDef
              ? App.serialize(contentDef)
              : ''
          );
        };

        /**
         * Save content form.
         *
         * @param {Object} props - Component properties.
         * @param {string} props.defaultSaveName - Default content name to be saved.
         * @returns {preact.Context} It returns a save content form context.
         */
        const SaveContentForm = (props) => {
          return App.html`
            <form onsubmit="${(e) => {
              e.preventDefault();
              saveContentDefinition(
                document.getElementById('contentSaveForm__contentName').value
              );
            }}">
              <div class="mb-6">
                <label for="contentSaveForm__contentName" class="${tailwind.classes.label()}">
                  Content Name
                </label>
                <input
                  type="text"
                  id="contentSaveForm__contentName"
                  class="${tailwind.classes.input()}"
                  placeholder="yourContentName"
                  value="${props.defaultSaveName || ''}"
                  required
                />
              </div>
              <button
                type="submit"
                class="${tailwind.classes.button()} mr-4"
              >
                Save
              </button>
              <button
                class="${tailwind.classes.button('violet')} mr-4"
                onclick="${(e) => {
                  e.preventDefault();
                  App.components.modal.close();
                }}"
              >
                Cancel
              </button>
            </form>
          `;
        };

        /**
         * Save content button click event.
         */
        const onSaveContentButtonClick = () => {
          const defaultSaveName =
            document.getElementById('content-selector').value;
          App.components.modal.open(
            () => App.html`<${SaveContentForm} defaultSaveName="${defaultSaveName}" />`
          );
          setTimeout(() => {
            document.getElementById('contentSaveForm__contentName').focus();
          }, 100);
        };

        return App.html`
          <div class="flex flex-wrap items-end">
            <select
              id="content-selector"
              class="${tailwind.classes.select()} mr-4"
              onchange="${updateEditorContent}"
            >
              <option value="" selected>New Content</option>
              ${
                this.state.contents.map((contentName) => App.html`
                  <option value="${contentName}">${contentName}</option>
                `)
              }
            </select>

            <button
              class="mr-4 text-3xl"
              onclick="${onSaveContentButtonClick}"
            >
              <i class="game-icon game-icon-save" />
            </button>

            <button
              class="mr-4 text-3xl"
              onclick="${() => App.location.locate(
                document.getElementById('content-selector').value
              )}"
            >
              <i class="game-icon game-icon-linked-rings" />
            </button>
          </div>
        `;
      }
    }
  }
};
