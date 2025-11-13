import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import Homepage from '../Homepage';

// Mock the api hooks used in Homepage so the component renders without a backend
vi.mock('../../api/cricApi', () => {
    return {
        useGetTeamsQuery: () => ({ data: ['Chennai Super Kings', 'Royal Challengers Bangalore'], isLoading: false }),
        useCalculatePerformanceMutation: () => [() => Promise.resolve({}), { isLoading: false }]
    };
});

test('Homepage renders title and basic form', () => {
    render(
        <BrowserRouter>
            <Homepage />
        </BrowserRouter>
    );
    expect(screen.getByText(/IPL Points Table Calculator/i)).toBeInTheDocument();
    // there should be at least one select control (team selection)
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
});
