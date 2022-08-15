'use strict';

/**
 * Main page related function.
 */
App.location = {
  /**
   * Main page component.
   * This component will be rendered to the top page.
   *
   * <${App.location.Page} />
   */
  Main: class extends preact.Component {
    state = {
      /**
       * Located content history.
       *
       * @type {Array<string>}
       */
      history: [],

      /**
       * Main content component.
       */
      Main: () => App.html``,

      /**
       * Side content component.
       */
      Side: () => App.html``
    };

    render() {
      /**
       * Update the location history of the Main component state.
       *
       * @param {Array<string>} history - Location history list to be send.
       */
      App.location.updateHistory = (history) => {
        this.setState((state) => ({
          ...state,
          history: history,
        }));
      };

      /**
       * Get the location history from the Main component state.
       *
       * @returns {Array<string>} It returns the location history.
       */
      App.location.getHistory = () => this.state.history.slice();

      /**
       * Set the location and render the main + side content.
       *
       * @param {string} content - Content name to be located.
       * @returns {boolean} It returns false if the content is not defined in App.contents.* property.
       */
      App.location.set = (content) => {
        const contentDef = App.contents[content];
        if (!contentDef) {
          return false;
        }

        this.setState((state) => ({
          ...state,
          Main: contentDef.main || (() => App.html``),
          Side: contentDef.side || (() => App.html``)
        }));
        return true;
      };

      return App.html`
        <div class="w-screen h-screen">
          <${App.components.Main}>
            <${this.state.Main} />
          </ ${App.components.Main}>
          <${App.components.Menu}>
            <div class="flex flex-wrap">
              <button
                class="mr-4 text-3xl ${this.state.history.length < 2 ? 'hidden': ''}"
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
            <${this.state.Side} />
          </ ${App.components.Menu}>
        </div>
        <${App.components.modal.Component} />
      `;
    }
  },

  /**
   * Locate the main + side content and record the location history.
   * If the current location is same as the target location, do not locate.
   *
   * @param {string} content - Content name. This is same as the App.contents.* property name.
   */
  locate: (content) => {
    const history = App.location.getHistory();
    const currentContent = history.slice(-1)[0];
    if (currentContent === content) {
      return;
    }
    
    if (!App.location.set(content)) {
      iziToast.warning({
        message: `コンテンツが存在しません: ${content}`
      });
      return;
    }
    
    // Record location history.
    history.push(content);
    App.location.updateHistory(history);
  },

  /**
   * Back to the previous location.
   */
  back: () => {
    const history = App.location.getHistory()
    // At least 2 location histories are required to back to the previous location.
    if (history.length < 2) {
      iziToast.warning({
        message: '履歴が存在しません'
      });
      return;
    }
    history.pop(); // Pop the last location.

    const content = history.slice(-1)[0];
    App.location.set(content);
    App.location.updateHistory(history);
  }
};

(() => {
  preact.render(App.html`<${App.location.Main} />`, document.body);
  App.location.locate('system_board');
})();
