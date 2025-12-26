import { apiSlice } from './apiSlice';

export const notificationsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => '/notifications',
            providesTags: ['Notifications'],
            keepUnusedDataFor: 5
        }),
        markNotificationRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT'
            }),
            invalidatesTags: ['Notifications']
        }),
        markAllNotificationsRead: builder.mutation({
            query: () => ({
                url: '/notifications/read/all',
                method: 'PUT'
            }),
            invalidatesTags: ['Notifications']
        })
    })
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation
} = notificationsApiSlice;
