import { useState, useEffect } from 'react';
import { ChevronDown, Search, MoreVertical, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CitiesLocations() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const navigate = useNavigate();

  const fetchCities = async () => {
    setLoading(true);
    let loadedData = null;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/cities/analytics`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        loadedData = data;
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
    
    if (loadedData) {
      setCities(loadedData);
    } else {
      // Fallback mock data
      setCities([
        { _id: 'c1', cityName: 'Kasol', stateName: 'Himachal Pradesh', totalProperties: 42, homestays: 12, resorts: 5, villas: 10, apartments: 8, cottages: 5, others: 2 },
        { _id: 'c2', cityName: 'Manali', stateName: 'Himachal Pradesh', totalProperties: 85, homestays: 20, resorts: 15, villas: 25, apartments: 15, cottages: 10, others: 0 },
        { _id: 'c3', cityName: 'Goa', stateName: 'Goa', totalProperties: 120, homestays: 15, resorts: 40, villas: 50, apartments: 10, cottages: 5, others: 0 },
        { _id: 'c4', cityName: 'Udaipur', stateName: 'Rajasthan', totalProperties: 60, homestays: 10, resorts: 20, villas: 15, apartments: 5, cottages: 8, others: 2 },
        { _id: 'c5', cityName: 'Munnar', stateName: 'Kerala', totalProperties: 35, homestays: 15, resorts: 8, villas: 5, apartments: 2, cottages: 5, others: 0 },
        { _id: 'c6', cityName: 'Lonavala', stateName: 'Maharashtra', totalProperties: 95, homestays: 10, resorts: 20, villas: 45, apartments: 15, cottages: 5, others: 0 },
        { _id: 'c7', cityName: 'Ooty', stateName: 'Tamil Nadu', totalProperties: 50, homestays: 20, resorts: 10, villas: 10, apartments: 5, cottages: 5, others: 0 },
        { _id: 'c8', cityName: 'Coorg', stateName: 'Karnataka', totalProperties: 45, homestays: 25, resorts: 5, villas: 8, apartments: 2, cottages: 5, others: 0 }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCities(); }, []);

  const filteredCities = cities.filter(c => {
    const matchQuery = (c.cityName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (c.stateName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchQuery;
  });

  const uniqueStates = Array.from(new Set(cities.map(c => c.stateName).filter(Boolean)));

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Cities &amp; Locations</span>
      </div>

      {/* Table Section */}
      <div className="dash-section" style={{ marginBottom: 24, gap: 16 }}>
        
        {/* Toolbar */}
        <div className="chart-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none' }}>
            <div className="props-table-title">Cities &amp; Locations</div>
            
            <div className="props-table-actions">
              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
                <Calendar size={14} style={{ color: '#6B7280' }} />
                <input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer' }}
                />
              </div>
              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer' }}
                >
                  <option value="">All Types</option>
                  {["Villa", "Homestay", "Resort", "Apartment", "Cottage", "Others"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button className="props-btn-filter" onClick={fetchCities} style={{ cursor: 'pointer' }}>
                <Filter size={14} /> Filter
              </button>
              <div className="props-search-wrap">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search city or state..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchCities()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Cities <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>States <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Property Numbers <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Homestays <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Resorts <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Villas <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Apartments <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Cottages <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Others <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>Loading cities...</td></tr>
                ) : filteredCities.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No cities found</td></tr>
                ) : (
                  filteredCities.map((c, i) => (
                    <tr key={`${c._id || 'city'}-${i}`}>
                      <td 
                        style={{ color: '#58A429', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate(`/admin/properties/all?city=${encodeURIComponent(c.cityName)}`)}
                      >
                        {c.cityName}
                      </td>
                      <td style={{ color: '#6B7280' }}>{c.stateName}</td>
                      <td style={{ color: '#6B7280', fontWeight: 600 }}>{c.totalProperties} Properties</td>
                      <td style={{ color: '#6B7280' }}>{c.homestays}</td>
                      <td style={{ color: '#6B7280' }}>{c.resorts}</td>
                      <td style={{ color: '#6B7280' }}>{c.villas}</td>
                      <td style={{ color: '#6B7280' }}>{c.apartments}</td>
                      <td style={{ color: '#6B7280' }}>{c.cottages}</td>
                      <td style={{ color: '#6B7280' }}>{c.others}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
