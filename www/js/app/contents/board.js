'use strict';

/**
 * Board content.
 *
 * @typedef {Object} BoardContent
 * @property {string} id - ID of the content.
 * @property {preact.Component} title - Title of the content to be displayed in the navigation tab.
 * @property {preact.Component} content - Board content to be displayed in the tab content.
 *
 * @type {BoardContent}
 */
App.Board = {
  id: 'board',
  title: () => App.html`<span class="text-xl leading-3"><i class="game-icon game-icon-empty-chessboard"></i></span>`,
  content: class extends preact.Component {
    render() {
      return App.html`
        <div class="w-screen h-screen">
          <div class="w-full h-full" id="fabric-canvas-area">
            <canvas id="fabric-canvas"></canvas>
          </div>
          <aside
            class="fixed z-10 p-5 bg-slate-800 overflow-auto
              landscape:w-1/3 landscape:h-full landscape:right-0 landscape:top-0 portrait:w-full portrait:h-1/3 portrait:left-0 portrait:bottom-0"
          >
            <div class="flex mb-4">
              <button
                id="exec-fabric-script-btn"
                class="${tailwind.classes.button()} pb-0 w-auto"
              >
                <i class="game-icon game-icon-play-button"></i>
              </button>
            </div>
            <div id="fabric-editor" class="h-2/3"></div>
          </aside>
        </div>
      `;
    }

    componentDidMount() {
      /**
       * Create fabric canvas.
       */
      const canvas = new fabric.Canvas('fabric-canvas', {
        backgroundColor: tailwind.colors['zinc-700']
      });

      function resizeFabricCanvas() {
        canvas.setWidth(
          document.getElementById('fabric-canvas-area').clientWidth
        );
        canvas.setHeight(
          document.getElementById('fabric-canvas-area').clientHeight
        );
      }

      window.addEventListener('DOMContentLoaded', resizeFabricCanvas);
      window.addEventListener('resize', () => resizeFabricCanvas);

      /**
       * Create fabric editor.
       */
      ace.config.set('basePath', './js/ace-1.9.5/');

      const editor = ace.edit('fabric-editor', {
        theme: 'ace/theme/monokai',
        mode: 'ace/mode/typescript',
        value: '',
        tabSize: 2,
        minLines: 2
      });

      document.getElementById('exec-fabric-script-btn')
        .addEventListener('click', () => {
          const script = editor.getValue();
          const functionGenerator = Function(`'use strict'; return (canvas) => {${script}}`);
          const fabricFunction = functionGenerator();

          fabricFunction(canvas);
        });
    }
  }
};
