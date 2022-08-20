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

  App.installContent(
    App.Board.id,
    App.Board.title,
    App.Board.content
  );
})();
