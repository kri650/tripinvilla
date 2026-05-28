export function mapDbProperties(dbProps, defaultList, where) {
  const listToMap =
    dbProps && dbProps.length > 0 ? dbProps : where && where.trim() !== '' ? [] : defaultList;

  const categories = [
    'Apartment',
    'Villa',
    'Resort',
    'Motel',
    'Cottage',
    'Bungalow',
    'Homestay',
    'Villa',
  ];

  return listToMap.map((p, idx) => {
    const category = p.category || p.type || categories[idx % categories.length];
    return {
      _id: p._id || `mock-${idx}`,
      title: p.propertyName || p.name || p.title || 'Beautiful Stay',
      location: p.location || 'Kasol, HP, India',
      rating: p.rating || '4.8',
      reviews: p.reviews || '3,245 Genuine Reviews',
      price: p.price
        ? String(p.price).startsWith('₹')
          ? p.price
          : '₹' + p.price
        : '₹' + (p.bestRoomRate || '140'),
      priceRaw: Number(p.bestRoomRate || String(p.price || '140').replace(/[^\d]/g, '')),
      img:
        p.image ||
        p.images?.[0] ||
        p.img ||
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
      images: p.images || (p.image ? [p.image] : p.img ? [p.img] : []),
      ownerContact: p.ownerContact || '',
      roomType: p.roomType || '',
      amenities: p.amenities || ['WiFi', 'Parking', 'Swimming Pool'],
      area: p.area || '31 sq. ft.',
      beds:
        p.beds !== undefined ? `${p.beds} Bed${p.beds > 1 ? 's' : ''}` : '2 Beds',
      rooms:
        p.bedRooms !== undefined
          ? `${p.bedRooms} Room${p.bedRooms > 1 ? 's' : ''}`
          : p.roomType || '1 Room',
      guests:
        p.capacity !== undefined
          ? `${p.capacity} Person${p.capacity > 1 ? 's' : ''}`
          : '3 Person',
      description: p.description || '',
      checkIn: p.checkIn || '3:00 PM',
      checkOut: p.checkOut || '12:00 PM',
      rules:
        p.rules ||
        '• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).',
      category: category,
      type: category,
      experiences: p.experiences || [],
      highlights: (() => {
        if (Array.isArray(p.highlights)) return p.highlights;
        if (p.highlights && typeof p.highlights === 'object') {
          const hList = [];
          if (p.highlights.breakfastIncluded) hList.push('Breakfast Included');
          if (p.highlights.parkingAvailable) hList.push('Parking Available');
          if (p.highlights.freeCancellation) hList.push(`Free cancellation till ${p.highlights.freeCancellationHours || 24} hrs before check-in`);
          return hList;
        }
        return [];
      })(),
      taxAmount: p.taxAmount || 0,
      originalPrice: p.originalPrice || null,
      mapLocation: p.mapLocation || null,
      latitude: p.latitude || null,
      longitude: p.longitude || null,
      full_address: p.full_address || p.location || '',
      instantBook: p.instantBook !== undefined ? p.instantBook : true,
      cancellationPolicy: p.cancellationPolicy !== undefined ? p.cancellationPolicy : true,
      homestay: category.toLowerCase() === 'homestay',
    };
  });
}

