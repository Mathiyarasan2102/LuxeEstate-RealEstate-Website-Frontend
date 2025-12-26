import { apiSlice } from './apiSlice';

export const aboutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAboutData: builder.query({
            query: () => '/about',
            providesTags: ['About']
        }),
        updateAboutData: builder.mutation({
            query: (data) => ({
                url: '/about',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['About']
        })
    })
});

export const {
    useGetAboutDataQuery,
    useUpdateAboutDataMutation
} = aboutApi;
