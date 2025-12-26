import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyCard from '../components/properties/PropertyCard';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

const mockProperty = {
    _id: '1',
    title: 'Luxury Villa',
    slug: 'luxury-villa',
    price: 5000000,
    location: { city: 'Beverly Hills', country: 'USA' },
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 4000,
    images: ['img1.jpg'],
    coverImage: 'cover.jpg',
    propertyType: 'Villa'
};

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('PropertyCard', () => {
    it('renders property title and price', () => {
        renderWithRouter(<PropertyCard property={mockProperty} />);

        expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
        expect(screen.getByText('₹5,000,000')).toBeInTheDocument();
    });

    it('renders location and stats', () => {
        renderWithRouter(<PropertyCard property={mockProperty} />);
        expect(screen.getByText('Beverly Hills, USA')).toBeInTheDocument();
        expect(screen.getByText('5 Beds')).toBeInTheDocument();
    });
});
