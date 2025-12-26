export const MOCK_PROPERTIES = [
    {
        _id: 'mock_1',
        title: 'Modern Beachfront Villa',
        location: { city: 'Malibu', state: 'CA', country: 'USA' },
        price: 4500000,
        propertyType: 'Villa',
        stats: { views: 1245, inquiries: 45, wishlistCount: 89 },
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'],
        coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        approvalStatus: 'approved'
    },
    {
        _id: 'mock_2',
        title: 'Luxury Downtown Penthouse',
        location: { city: 'New York', state: 'NY', country: 'USA' },
        price: 8500000,
        propertyType: 'Apartment',
        stats: { views: 3500, inquiries: 120, wishlistCount: 210 },
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        approvalStatus: 'approved'
    },
    {
        _id: 'mock_3',
        title: 'Secluded Mountain Retreat',
        location: { city: 'Aspen', state: 'CO', country: 'USA' },
        price: 3200000,
        propertyType: 'House',
        stats: { views: 890, inquiries: 24, wishlistCount: 56 },
        images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'],
        coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
        approvalStatus: 'approved'
    },
    {
        _id: 'mock_4',
        title: 'Contemporary Urban Loft',
        location: { city: 'San Francisco', state: 'CA', country: 'USA' },
        price: 2100000,
        propertyType: 'Condo',
        stats: { views: 1560, inquiries: 56, wishlistCount: 98 },
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        approvalStatus: 'approved'
    },
    {
        _id: 'mock_5',
        title: 'Mediterranean Estate',
        location: { city: 'Miami', state: 'FL', country: 'USA' },
        price: 12500000,
        propertyType: 'Mansion',
        stats: { views: 5600, inquiries: 230, wishlistCount: 450 },
        images: ['https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?auto=format&fit=crop&w=800&q=80'],
        coverImage: 'https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?auto=format&fit=crop&w=800&q=80',
        approvalStatus: 'pending'
    }
];

export const MOCK_INQUIRIES = [
    {
        _id: 'inq_1',
        status: 'pending',
        message: 'Is this property still available? I would like to schedule a viewing for this weekend.',
        createdAt: new Date().toISOString(),
        userId: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
        propertyId: { _id: 'mock_1', title: 'Modern Beachfront Villa' }
    },
    {
        _id: 'inq_2',
        status: 'pending',
        message: 'What are the HOA fees for this unit? Also, does it come fully furnished?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        userId: { name: 'Michael Chen', email: 'm.chen@example.com' },
        propertyId: { _id: 'mock_2', title: 'Luxury Downtown Penthouse' }
    },
    {
        _id: 'inq_3',
        status: 'reviewed',
        message: 'I am interested in making an offer. Please contact me at your earliest convenience.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        userId: { name: 'David Smith', email: 'dsmith@example.com' },
        propertyId: { _id: 'mock_1', title: 'Modern Beachfront Villa' }
    },
    {
        _id: 'inq_4',
        status: 'reviewed',
        message: 'Does this property have a private pool?',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        userId: { name: 'Emily Davis', email: 'emily.d@example.com' },
        propertyId: { _id: 'mock_3', title: 'Secluded Mountain Retreat' }
    },
    {
        _id: 'inq_5',
        status: 'pending',
        message: 'Hi, I saw this listing and I love the kitchen! when can I visit?',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        userId: { name: 'Jessica Brown', email: 'jess.b@gmail.com' },
        propertyId: { _id: 'mock_5', title: 'Mediterranean Estate' }
    }
];
