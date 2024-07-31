const STRING: string = 'Test';
export { STRING };

const ROUTES = {
  HOMEPAGE: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about-us',
};

const WILDCARD_ROUTES = {
  PUBLIC: ROUTES.HOMEPAGE,
  PRIVATE: ROUTES.LOGIN,
};

const ROUTES_CONFIG = {
  HOMEPAGE: {
    path: ROUTES.HOMEPAGE,
    title: 'Notifications System',
  },
};

const FIREBASE_COLLECTION = {
  NOTIFICATIONS: 'notifications',
};

const STRINGS = {
  NOTIFICATION_SENT: {
    SUCCESS: 'Notification sent successfully',
    FAILURE: 'Failed to send notification',
  },
  APP_NEED_PERMISSION: 'The app needs permission to',
  WAITING_TOKEN: 'Waiting For Token...',
  ENABLE_PUSH_NOTIFICATION: 'enable push notifications',
  ERROR_CREATING_COLLECTION: 'Error clearing collection: ',
  ERROR_UNKNOWN: 'An unknown error occurred',
  NOTIFICATION_SYSTEM: 'Notification System',
  SERVICEWORKER_FAILED: 'Service Worker registration failed.',
  ERROR_GETTING_TOKEN: 'Error getting token:',
  TOKEN_RECEIVED: 'Token received:',
  NO_TOKEN_AVAILABLE:
    'No registration token available. Request permission to generate one.',
  UNEXPECTED_ERROR: 'Unexpected error:',
  READ: 'Read',
  MARK_AS_READ: 'Mark As Read',
  ALLOW_NOTIFICATION_PERMISSION: 'Please allow notification permission first',
};

export const NOTIFICATION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  DEFAULT: 'default',
};
export { ROUTES, WILDCARD_ROUTES, ROUTES_CONFIG, FIREBASE_COLLECTION, STRINGS };
