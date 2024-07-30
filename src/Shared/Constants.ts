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
  ERROR_CREATING_COLLECTION: 'Error clearing collection: ',
  ERROR_UNKNOWN: 'An unknown error occurred',
  NOTIFICATION_SYSTEM: 'Notification System',
  READ: 'Read',
  UNREAD: 'Unread',
};
export { ROUTES, WILDCARD_ROUTES, ROUTES_CONFIG, FIREBASE_COLLECTION, STRINGS };
