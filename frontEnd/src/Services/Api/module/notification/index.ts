import api from '../../api';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendNotification: build.mutation({
      query: ({ deviceToken, message, notificationId }) => ({
        url: '/notification',
        method: 'POST',
        body: { deviceToken, message, notificationId },
      }),
    }),
  }),
  overrideExisting: false,
});

// We can use the Lazy Query as well for GET requests depends on our Requirements.
// For POST request we will use mutations.
export const { useSendNotificationMutation } = userApi;
