import { apiSlice } from './apiSlice';

export const contactApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitContactForm: builder.mutation({
            query: (data) => ({
                url: '/contact/submit',
                method: 'POST',
                body: data
            })
        }),
        getContactInquiries: builder.query({
            query: () => '/contact/inquiries',
            providesTags: ['ContactInquiries']
        }),
        updateInquiryStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/contact/inquiries/${id}/status`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['ContactInquiries']
        })
    })
});

export const {
    useSubmitContactFormMutation,
    useGetContactInquiriesQuery,
    useUpdateInquiryStatusMutation
} = contactApi;
