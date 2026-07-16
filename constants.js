/**
 * MRIDU BOOK STUDIO – Core Constants
 * Only constants used TODAY by frozen core modules.
 * APP_VERSION is the single source of truth for the application version.
 */
window.MRIDU = window.MRIDU || {};
window.MRIDU.Core = window.MRIDU.Core || {};

(function () {
  'use strict';

  const APP_VERSION = '1.0.0';
  const DB_NAME = 'MRIDU_BOOK_STUDIO';
  const DB_VERSION = 1;
  const SCHEMA_VERSION = 1;
  const STORES = ['books', 'chapters', 'bookmarks', 'settings', 'preferences', 'meta'];
  const REQUIRED_RECORD_FIELDS = ['id', 'version', 'createdAt', 'updatedAt'];

  const EVENTS = {
    APP_BOOTING: 'app:booting',
    APP_INITIALIZING: 'app:initializing',
    APP_READY: 'app:ready',
    APP_FATAL: 'app:fatal',
    STATE_CHANGED: 'state:changed',
    STORAGE_QUOTA_EXCEEDED: 'storage:quota-exceeded'
  };

  const Constants = Object.freeze({
    APP_VERSION,
    DB_NAME,
    DB_VERSION,
    SCHEMA_VERSION,
    STORES,
    REQUIRED_RECORD_FIELDS,
    EVENTS
  });

  if (!Object.prototype.hasOwnProperty.call(MRIDU.Core, 'Constants')) {
    Object.defineProperty(MRIDU.Core, 'Constants', {
      value: Constants,
      writable: false,
      configurable: false,
      enumerable: true
    });
  }

  // Reserve the modules namespace for future feature modules
  window.MRIDU.Modules = window.MRIDU.Modules || {};
})();