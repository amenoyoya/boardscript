'use strict';

/**
 * Tailwind CSS configuration.
 *
 * @type {Object<string, *>}
 */
 tailwind.config = {
  theme: {
    extend: {
      width: {
        '1/2-screen':	'50vw',
        '1/3-screen':	'33.333333vw',
        '2/3-screen':	'66.666667vw',
        '1/4-screen':	'25vw',
        '2/4-screen':	'50vw',
        '3/4-screen':	'75vw',
        '1/5-screen':	'20vw',
        '2/5-screen':	'40vw',
        '3/5-screen':	'60vw',
        '4/5-screen':	'80vw',
        '1/6-screen':	'16.666667vw',
        '2/6-screen':	'33.333333vw',
        '3/6-screen':	'50vw',
        '4/6-screen':	'66.666667vw',
        '5/6-screen':	'83.333333vw'
      },
      height: {
        '1/2-screen':	'50vh',
        '1/3-screen':	'33.333333vh',
        '2/3-screen':	'66.666667vh',
        '1/4-screen':	'25vh',
        '2/4-screen':	'50vh',
        '3/4-screen':	'75vh',
        '1/5-screen':	'20vh',
        '2/5-screen':	'40vh',
        '3/5-screen':	'60vh',
        '4/5-screen':	'80vh',
        '1/6-screen':	'16.666667vh',
        '2/6-screen':	'33.333333vh',
        '3/6-screen':	'50vh',
        '4/6-screen':	'66.666667vh',
        '5/6-screen':	'83.333333vh'
      }
    }
  }
};

(() => {
  preact.render(App.components.Page(), document.body);
  App.location.locate('system_editor');
})();
