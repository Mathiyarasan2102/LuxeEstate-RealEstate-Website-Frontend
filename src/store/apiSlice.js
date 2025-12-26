import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        const baseQuery = fetchBaseQuery({
            baseUrl: '/api',
            credentials: 'include',
            prepareHeaders: (headers, { getState }) => {
                const token = getState().auth.token;
                if (token) {
                    headers.set('authorization', `Bearer ${token}`);
                }
                return headers;
            }
        });

        let result = await baseQuery(args, api, extraOptions);

        if (result.error && result.error.status === 401) {
            // Import dynamically or dispatch a global reset
            // Since we can't import authSlice easily due to circular dependency risk IF authSlice imported apiSlice, 
            // but authSlice DOES NOT import apiSlice. 
            // However, to be safe, we can use the action type string directly if needed, or import.
            // Let's import logOut from authSlice. need to add import at top.
            api.dispatch({ type: 'auth/logOut' });
        }
        return result;
    },
    tagTypes: ['User', 'Property', 'Inquiry'],
    endpoints: (builder) => ({}) // Extended in slice files
});
