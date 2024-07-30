const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        return registration;
      })
      .catch((err) => {
        return err;
      });
  }
};

export default registerServiceWorker;
