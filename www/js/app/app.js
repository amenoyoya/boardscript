'use strict';

/**
 * @typedef {Object} ContentDefinition
 * @property {Function} [main] - Main content definition.
 * @property {Function} [side] - Side content definition.
 * @property {Function} [script] - JavaScript code to be executed after the contents are rendered. 
 */

/**
 * Application variables.
 *
 * @type {Object<string, *>}
 */
window.App = {
  /**
   * HTML virtual DOM renderer.
   */
  html: htm.bind(preact.h),

  /**
   * Reset the target inner HTML and render preact virtual DOM to the target.
   *
   * @param {preact.Context} context - Preact virtual DOM to be rendered.
   * @param {HTMLElement} target - The render target HTML element.
   */
  render: (context, target) => {
    target.innerHTML = '';
    preact.render(context, target);
  },

  /**
   * Components definition codes.
   *
   * @type {Object<string, *>}
   */
   components: {},

  /**
   * Contents definition codes.
   * System embedded contents should be named as `system_***`.
   * System embedded contents are unable to edit (save).
   *
   * @type {Object<string, ContentDefinition>}
   */
  contents: {},

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
   * Location related functions.
   */
  location: {
    /**
     * Located content history.
     *
     * @type {Array<string>}
     */
    history: [],

    /**
     * Locate the main + side content without recording history.
     *
     * @param {string} contentName - Content name. This is same as the App.contents.* property name.
     * @returns {boolean} It returns false if the cache content does not exist.
     */
    render: (contentName) => {
      const contentDef = App.contents[contentName];
      if (!contentDef) {
        return false;
      }

      ['main', 'side'].forEach((target) => {
        const content = contentDef[target];
        const Content = content || (() => App.html``);

        App.render(Content(), document.getElementById(`${target}-content`));
      });
      if (typeof contentDef.script === 'function') {
        contentDef.script();
      }
      return true;
    },

    /**
     * Locate the main + side content and record the location history.
     * If the current location is same as the target location, do not locate.
     *
     * @param {string} contentName - Content name. This is same as the App.contents.* property name.
     * @returns {boolean} It returns false if the content is not defined in the App.contents.
     */
    locate: (contentName) => {
      const currentContentName = App.location.history.slice(-1)[0];
      if (currentContentName === contentName) {
        return false;
      }

      if (!App.location.render(contentName)) {
        iziToast.warning({
          title: 'location error',
          message: `コンテンツが存在しません: ${contentName}`
        });
        return false;
      }
      App.location.history.push(contentName); // Record location history.
      return true;
    },

    /**
     * Back to the previous location.
     *
     * @returns {boolean} It returns false if the previous location does not exist.
     */
    back: () => {
      if (App.location.history.length === 0) {
        iziToast.warning({
          title: 'location error',
          message: '履歴が存在しません'
        });
        return false;
      }

      const contentName = App.location.history.pop();
      return App.location.render(contentName);
    }
  }
};
