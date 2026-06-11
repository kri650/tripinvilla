import { useEffect, useState } from 'react';

const TYPE_MAP = {
  Apartments: 'Apartment',
  Apartment: 'Apartment',
  Homestays: 'Homestay',
  Homestay: 'Homestay',
  Resorts: 'Resort',
  Resort: 'Resort',
  Villas: 'Villa',
  Villa: 'Villa',
  Hotels: 'Hotel',
  Hotel: 'Hotel',
  Cottages: 'Cottage',
  Cottage: 'Cottage',
  Motels: 'Motel',
  Motel: 'Motel',
  Bungalows: 'Bungalow',
  Bungalow: 'Bungalow',
};

const normalizePropertyType = (value) => {
  if (!value || typeof value !== 'string') return '';
  return TYPE_MAP[value] || value.replace(/s$/i, '') || value;
};

const parseHeroPrice = (priceVal) => {
  if (!priceVal || priceVal === 'Any') return { min: '', max: '' };
  const cleanPrice = String(priceVal).replace(/[₹,\s]/g, '');
  if (cleanPrice.includes('-')) {
    const [minP, maxP] = cleanPrice.split('-').map((v) => parseInt(v, 10));
    return {
      min: Number.isNaN(minP) ? '' : minP,
      max: Number.isNaN(maxP) ? '' : maxP,
    };
  }
  if (cleanPrice.includes('+')) {
    const minP = parseInt(cleanPrice, 10);
    return { min: Number.isNaN(minP) ? '' : minP, max: '' };
  }
  return { min: '', max: '' };
};

export default function useGuestSearch({ API_BASE, setActiveMenu }) {
  const [activeSearchTab, setActiveSearchTab] = useState('Villas');
  const [activePropCategory, setActivePropCategory] = useState('Villas');

  const [where, setWhere] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('Any Guests');
  const [price, setPrice] = useState('Any');
  const [stayType, setStayType] = useState('Any');
  const [foodPref, setFoodPref] = useState('Any');

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [, setFilterPriceSlider] = useState(50000);
  const [sidebarSearchText, setSidebarSearchText] = useState('');
  const [filterSelectedTypes, setFilterSelectedTypes] = useState([]);
  const [filterSelectedAmenities, setFilterSelectedAmenities] = useState([]);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [searchSortBy, setSearchSortBy] = useState('popularity');
  const [filterInstantBook, setFilterInstantBook] = useState(false);
  const [filterCancellationPolicy, setFilterCancellationPolicy] = useState(false);
  const [filterHomestays, setFilterHomestays] = useState(false);

  const [searchCurrentPage, setSearchCurrentPage] = useState(1);

  useEffect(() => {
    setSearchCurrentPage(1);
  }, [
    sidebarSearchText,
    filterSelectedTypes,
    filterSelectedAmenities,
    filterMinPrice,
    filterMaxPrice,
    filterMinRating,
    filterInstantBook,
    filterCancellationPolicy,
    filterHomestays,
    searchSortBy,
    where,
  ]);

  const [liveProperties, setLiveProperties] = useState([]);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiTags, setAiTags] = useState([]);

  const buildSearchParams = (overrides = {}) => ({
    search: where,
    dates,
    guests,
    price,
    stayType,
    foodPref,
    verifiedOnly,
    featuredOnly,
    type: activeSearchTab && activeSearchTab !== 'More+'
      ? normalizePropertyType(activeSearchTab)
      : '',
    ...overrides,
  });

  const fetchProperties = async (searchParams = {}) => {
    try {
      const query = new URLSearchParams();
      const get = (key, fallback) =>
        Object.prototype.hasOwnProperty.call(searchParams, key) ? searchParams[key] : fallback;

      const searchVal = get('search', where);
      if (searchVal && String(searchVal).trim() !== '') {
        query.append('city', String(searchVal).trim());
      }

      // We do NOT send `type` to the backend because the frontend sidebar 
      // allows multiple types to be selected via checkboxes. 
      // If we restrict the backend query to a single type, the user can never 
      // reveal other types by clicking checkboxes. The frontend `getFilteredProperties` 
      // will handle the type filtering correctly.
      const typeVal = normalizePropertyType(get('type', ''));
      // Intentionally bypassed: if (typeVal) query.append('type', typeVal);

      const guestsVal = get('guests', guests);
      if (guestsVal && guestsVal !== 'Any Guests') {
        const match = String(guestsVal).match(/\d+/);
        if (match) query.append('guests', match[0]);
      }

      const priceVal = get('price', price);
      if (priceVal && priceVal !== 'Any') {
        const { min, max } = parseHeroPrice(priceVal);
        if (min !== '') query.append('minPrice', min);
        if (max !== '') query.append('maxPrice', max);
      }

      const datesVal = get('dates', dates);
      if (datesVal && datesVal !== 'Select dates' && String(datesVal).trim() !== '') {
        if (String(datesVal).includes(' to ')) {
          const [start, end] = String(datesVal).split(' to ');
          if (start) query.append('checkIn', start.trim());
          if (end) query.append('checkOut', end.trim());
        }
      }

      const stayTypeVal = get('stayType', stayType);
      if (stayTypeVal && stayTypeVal !== 'Any') {
        const roomMap = {
          '1 Deluxe Room': 'private-room',
          '2 Deluxe Rooms': 'private-room',
          'Entire Villa': 'entire-place',
        };
        query.append('roomType', roomMap[stayTypeVal] || stayTypeVal);
      }

      const foodPrefVal = get('foodPref', foodPref);
      if (foodPrefVal && foodPrefVal !== 'Any') {
        const foodMap = {
          'Pure Veg': 'veg',
          'Non-Veg': 'non-veg',
          'Buffet Available': 'both',
        };
        if (foodMap[foodPrefVal]) query.append('foodPreference', foodMap[foodPrefVal]);
      }

      const verifiedVal = get('verifiedOnly', verifiedOnly);
      const featuredVal = get('featuredOnly', featuredOnly);
      if (verifiedVal) query.append('verifiedOnly', 'true');
      if (featuredVal) query.append('featuredOnly', 'true');

      if (searchParams.limit) query.append('limit', searchParams.limit);
      if (searchParams.status) query.append('status', searchParams.status);

      const res = await fetch(`${API_BASE}/search?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.properties) {
          setLiveProperties(data.properties);
        }
      }
    } catch (e) {
      console.error('Error fetching properties:', e);
    }
  };

  const handleAISearch = async () => {
    if (!where || !where.trim()) {
      alert('Please type what you are looking for in the search box first, then click Search with AI.');
      return;
    }
    setAiSearchLoading(true);
    setAiSummary(null);
    setAiTags([]);
    try {
      const res = await fetch(`${API_BASE}/search/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: where }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.properties) {
          setLiveProperties(data.properties);
          if (setActiveMenu) setActiveMenu('Search');

          setAiSummary(data.aiSummary || null);

          const tags = [];
          const f = data.extractedFilters || {};
          if (f.city) tags.push(`📍 ${f.city}`);
          if (f.type) tags.push(`🏠 ${f.type}`);
          if (f.guests) tags.push(`👥 ${f.guests} guests`);
          if (f.checkIn) tags.push(`📅 ${f.checkIn} → ${f.checkOut || '?'}`);
          if (f.maxPrice) tags.push(`💰 Under ₹${f.maxPrice}/night`);
          if (f.foodPreference) tags.push(`🍽️ ${f.foodPreference}`);
          setAiTags(tags);

          if (f.city) setWhere(f.city);
          if (f.type) {
            const normalized = normalizePropertyType(f.type);
            setActivePropCategory(normalized);
            setFilterSelectedTypes([normalized]);
          }
        }
      } else {
        fetchProperties(buildSearchParams());
        if (setActiveMenu) setActiveMenu('Search');
      }
    } catch (e) {
      console.error('AI Search error:', e);
      fetchProperties(buildSearchParams());
      if (setActiveMenu) setActiveMenu('Search');
    } finally {
      setAiSearchLoading(false);
    }
  };

  const handleSearch = () => {
    if (setActiveMenu) setActiveMenu('Search');

    const tabType = activeSearchTab && activeSearchTab !== 'More+'
      ? normalizePropertyType(activeSearchTab)
      : '';

    if (tabType) {
      setActivePropCategory(activeSearchTab);
      setFilterSelectedTypes([tabType]);
    }

    const { min, max } = parseHeroPrice(price);
    setFilterMinPrice(min);
    setFilterMaxPrice(max);

    fetchProperties(buildSearchParams({ type: tabType }));

    setTimeout(() => {
      window.scrollTo({ top: 750, behavior: 'smooth' });
    }, 100);
  };

  const handleClearAll = () => {
    setWhere('');
    setDates('');
    setGuests('Any Guests');
    setPrice('Any');
    setStayType('Any');
    setFoodPref('Any');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterSelectedTypes([]);
    setFilterSelectedAmenities([]);
    setSidebarSearchText('');
    setFilterMinRating(0);
    setFilterInstantBook(false);
    setFilterCancellationPolicy(false);
    setFilterHomestays(false);
    setAiSummary(null);
    setAiTags([]);
    fetchProperties({ search: '', type: '', price: 'Any', guests: 'Any Guests', dates: '', stayType: 'Any', foodPref: 'Any', verifiedOnly: false, featuredOnly: false });
  };

  const handleCloseSearch = () => {
    if (setActiveMenu) setActiveMenu('Home');
  };

  return {
    activeSearchTab,
    setActiveSearchTab,
    activePropCategory,
    setActivePropCategory,

    where,
    setWhere,
    dates,
    setDates,
    guests,
    setGuests,
    price,
    setPrice,
    stayType,
    setStayType,
    foodPref,
    setFoodPref,
    verifiedOnly,
    setVerifiedOnly,
    featuredOnly,
    setFeaturedOnly,

    liveProperties,
    setLiveProperties,

    aiSearchLoading,
    aiSummary,
    aiTags,

    filterMinPrice,
    setFilterMinPrice,
    filterMaxPrice,
    setFilterMaxPrice,
    setFilterPriceSlider,
    sidebarSearchText,
    setSidebarSearchText,
    filterSelectedTypes,
    setFilterSelectedTypes,
    filterSelectedAmenities,
    setFilterSelectedAmenities,
    filterMinRating,
    setFilterMinRating,
    searchSortBy,
    setSearchSortBy,
    filterInstantBook,
    setFilterInstantBook,
    filterCancellationPolicy,
    setFilterCancellationPolicy,
    filterHomestays,
    setFilterHomestays,

    searchCurrentPage,
    setSearchCurrentPage,

    fetchProperties,
    buildSearchParams,
    handleAISearch,
    handleSearch,
    handleClearAll,
    handleCloseSearch,
  };
}
