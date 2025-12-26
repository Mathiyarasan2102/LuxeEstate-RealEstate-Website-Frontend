import { apiSlice } from './apiSlice';

export const propertiesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProperties: builder.query({
            query: (params) => ({
                url: '/properties',
                params,
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Property'],
        }),
        getProperty: builder.query({
            query: (slug) => ({
                url: `/properties/${slug}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getAgentProperties: builder.query({
            query: () => ({
                url: '/properties/agent/my-listings',
            }),
            providesTags: ['Property'],
            keepUnusedDataFor: 5,
        }),
        getPropertyStats: builder.query({
            query: (id) => ({
                url: `/properties/${id}/stats`,
            }),
            keepUnusedDataFor: 5,
        }),
        getAdminProperties: builder.query({
            query: () => ({
                url: '/properties/admin/all',
            }),
            providesTags: ['Property'],
            keepUnusedDataFor: 5,
        }),
        createProperty: builder.mutation({
            query: (data) => ({
                url: '/properties',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Property'],
        }),
        updateProperty: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/properties/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Property'],
        }),
        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/properties/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Property'],
        }),
        publishProperty: builder.mutation({
            query: (id) => ({
                url: `/properties/${id}/publish`,
                method: 'POST',
            }),
            invalidatesTags: ['Property'],
        }),
        uploadImages: builder.mutation({
            query: (formData) => ({
                url: '/properties/upload',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useGetPropertiesQuery,
    useGetPropertyQuery,
    useGetAgentPropertiesQuery,
    useGetPropertyStatsQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
    usePublishPropertyMutation,
    useUploadImagesMutation,
    useGetAdminPropertiesQuery
} = propertiesApiSlice;
