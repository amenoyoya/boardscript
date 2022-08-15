'use strict';

/**
 * @typedef {Object} ContentDefinition
 * @property {preact.Component} [main] - Main content definition.
 * @property {preact.Component} [side] - Side content definition.
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
  }
};
