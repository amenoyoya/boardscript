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
      <div class="flex flex-wrap">
        <button
          class="mr-4 text-3xl ${App.location.history.length === 0 ? 'hidden': ''}"
          onclick="${App.location.back}"
        >
          <i class="game-icon game-icon-return-arrow"></i>
        </button>
        <button class="mr-4 text-3xl" onclick="${() => App.location.locate('system_board')}">
          <i class="game-icon game-icon-empty-chessboard"></i>
        </button>
        <button class="mr-4 text-3xl" onclick="${() => App.location.locate('system_editor')}">
          <i class="game-icon game-icon-notebook"></i>
        </button>
      </div>
      <hr class="my-4 border-gray-200" />
      ${props.children}
    </aside>
  `,

  /**
   * Modal dialog related functions.
   */
  modal: {
    /**
     * Open modal dialog.
     *
     * @param {preact.FC} Content - Functional component of the modal dialog content to be renderered.
     * @returns {boolean} It returns false if the modal dialog is already opened.
     */
    open: (Content) => {
      const modalArea = document.getElementById('modal-area');

      if (!modalArea.classList.contains('invisible')) {
        return false;
      }

      const ContentComponent = Content || (() => App.html``);
      App.render(ContentComponent(), document.getElementById('modal-content'));

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
    },

    /**
     * Modal dialog component.
     * <${App.components.modal.Component} />
     */
    Component: () => App.html`
      <section
        id="modal-area"
        class="invisible opacity-0 fixed z-30 top-0 left-0 w-full h-full ease-in duration-200"
      >
        <div class="w-full h-full bg-gray-900 opacity-80" onclick="${App.components.modal.close}"></div>
        <div class="absolute top-1/2 left-1/2 w-4/5 p-8 bg-slate-600 translate-x-[-50%] translate-y-[-50%] overflow-auto">
          <div id="modal-content" class="w-full h-full"></div>
          <div
            class="absolute top-2 right-3 cursor-pointer"
            onclick="${App.components.modal.close}"
          >
            <i class="game-icon game-icon-tire-iron-cross"></i>
          </div>
        </div>
      </section>
    `
  },

  /**
   * Main page component.
   * This component will be rendered to the page.
   * <${App.components.Page} />
   */
  Page: () => App.html`
    <div class="w-screen h-screen">
      <${App.components.Main}>
        <div id="main-content" class="w-full h-full"></div>
      </ ${App.components.Main}>
      <${App.components.Menu}>
        <div id="side-content" class="w-full h-full"></div>
      </ ${App.components.Menu}>
    </div>
    <${App.components.modal.Component} />
  `
};
