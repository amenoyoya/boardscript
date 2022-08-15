'use strict';

/**
 * Components definition codes.
 *
 * @type {Object<string, *>}
 */
App.components = {
  /**
   * Main component.
   * <${App.components.Main} />
   */
  Main: (props) => App.html`
   <main class="landscape:w-2/3 landscape:h-full portrait:h-2/3 portrait:w-full overflow-auto">
    ${props.children}
   </main>
  `,

  /**
   * Menu component.
   * <${App.components.Menu} />
   */
  Menu: (props) => App.html`
    <aside
      class="fixed z-10 p-5 bg-slate-800 overflow-auto
        landscape:w-1/3 landscape:h-full landscape:right-0 landscape:top-0 portrait:w-full portrait:h-1/3 portrait:left-0 portrait:bottom-0"
    >
      ${props.children}
    </aside>
  `,

  /**
   * Modal dialog related functions.
   */
  modal: {
    /**
     * Modal dialog component.
     * <${App.components.modal.Component} />
     */
     Component: class extends preact.Component {
      state = {
        Content: () => App.html``
      }

      render() {
        /**
         * Set modal dialog content.
         *
         * @param {preact.Component} Content - Modal dialog content component.
         */
        App.components.modal.setContent = (Content) => {
          this.setState((state) => ({
            ...state,
            Content: Content || (() => App.html``)
          }));
        };

        return App.html`
          <section
            id="modal-area"
            class="invisible opacity-0 fixed z-30 top-0 left-0 w-full h-full ease-in duration-200"
          >
            <div class="w-full h-full bg-gray-900 opacity-80" onclick="${App.components.modal.close}"></div>
            <div class="absolute top-1/2 left-1/2 w-4/5 p-8 bg-slate-600 translate-x-[-50%] translate-y-[-50%] overflow-auto">
              <${this.state.Content} />
              <div
                class="absolute top-2 right-3 cursor-pointer"
                onclick="${App.components.modal.close}"
              >
                <i class="game-icon game-icon-tire-iron-cross"></i>
              </div>
            </div>
          </section>
        `;
      }
    },

    /**
     * Open modal dialog.
     *
     * @param {preact.Component} Content - Component of the modal dialog content to be renderered.
     * @returns {boolean} It returns false if the modal dialog is already opened.
     */
    open: (Content) => {
      const modalArea = document.getElementById('modal-area');

      if (!modalArea.classList.contains('invisible')) {
        return false;
      }

      App.components.modal.setContent(Content);

      ['invisible', 'opacity-0'].forEach(
        (cls) => modalArea.classList.remove(cls)
      );
      return true;
    },

    /**
     * Close modal dialog.
     *
     * @returns {boolean} It returns false if the modal dialog is already closed.
     */
    close: () => {
      const modalArea = document.getElementById('modal-area');

      if (modalArea.classList.contains('invisible')) {
        return false;
      }

      ['invisible', 'opacity-0'].forEach(
        (cls) => modalArea.classList.add(cls)
      );
      return true;
    }
  }
};
