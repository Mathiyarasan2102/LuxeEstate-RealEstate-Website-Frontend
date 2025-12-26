import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        googleLogin: builder.mutation({
            query: (data) => ({
                url: '/auth/google',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: '/auth/profile',
                method: 'PUT',
                body: data,
            }),
        }),
        getWishlist: builder.query({
            query: () => '/users/wishlist',
            keepUnusedDataFor: 5,
        }),
        toggleWishlist: builder.mutation({
            query: (propertyId) => ({
                url: `/users/wishlist/${propertyId}`,
                method: 'PUT',
            }),
        }),
        applyForSeller: builder.mutation({
            query: () => ({
                url: '/users/apply-seller',
                method: 'POST',
            }),
        }),
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['Users'],
            keepUnusedDataFor: 5,
        }),
        getUserProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['Users'],
        }),
        rejectSellerApplication: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/users/${id}/reject-seller`,
                method: 'PUT',
                body: { reason },
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGoogleLoginMutation,
    useLogoutMutation,
    useUpdateUserMutation,
    useGetWishlistQuery,
    useToggleWishlistMutation,
    useApplyForSellerMutation,
    useGetUsersQuery,
    useGetUserProfileQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useRejectSellerApplicationMutation
} = usersApiSlice;
