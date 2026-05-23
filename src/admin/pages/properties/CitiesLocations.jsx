import { useState, useEffect } from 'react';
import { ChevronDown, Search, MoreVertical } from 'lucide-react';

export default function CitiesLocations() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/cities');
      const data = await res.json();
      if (Array.isArray(data)) setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCities(); }, []);

  const filteredCities = cities.filter(c => {
    const matchQuery = (c.cityName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (c.stateName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchState = selectedState ? c.stateName === selectedState : true;
    return matchQuery && matchState;
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
              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <select 
                  value={selectedState} 
                  onChange={e => setSelectedState(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer' }}
                >
                  <option value="">All States</option>
                  {uniqueStates.map((st, i) => (
                    <option key={i} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="props-search-wrap">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search city or state..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="10" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>Loading cities...</td></tr>
                ) : filteredCities.length === 0 ? (
                  <tr><td colSpan="10" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No cities found</td></tr>
                ) : (
                  filteredCities.map((c, i) => (
                    <tr key={c._id || i}>
                      <td style={{ color: '#58A429', fontWeight: 600 }}>{c.cityName}</td>
                      <td style={{ color: '#6B7280' }}>{c.stateName}</td>
                      <td style={{ color: '#6B7280', fontWeight: 600 }}>{c.totalProperties} Properties</td>
                      <td style={{ color: '#6B7280' }}>{c.homestays}</td>
                      <td style={{ color: '#6B7280' }}>{c.resorts}</td>
                      <td style={{ color: '#6B7280' }}>{c.villas}</td>
                      <td style={{ color: '#6B7280' }}>{c.apartments}</td>
                      <td style={{ color: '#6B7280' }}>{c.cottages}</td>
                      <td style={{ color: '#6B7280' }}>{c.others}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                          <button className="action-dots"><MoreVertical size={14} /></button>
                        </div>
                      </td>
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
