import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cricApi = createApi({
  reducerPath: 'cricApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  endpoints: (builder) => ({
    calculatePerformance: builder.mutation({
      query: (input) => ({
        url: 'calculate',
        method: 'POST',
        body: input,
      }),
    }),
    getPointsTable: builder.query({
      query: () => 'points-table',
    }),
    getTeams: builder.query({
      query: () => 'teams',
    }),
  }),
});

export const { useCalculatePerformanceMutation, useGetPointsTableQuery, useGetTeamsQuery } = cricApi;
