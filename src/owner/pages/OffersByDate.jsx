import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { offerService, propertyRequestService } from '../services/api';
import ReadMore from '../../admin/components/ReadMore';
import DateRangeDropdown from '../../components/DateRangeDropdown';

export default function OffersByDate() {
  // Form State
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [category, setCategory] = useState('');
  const [roomType, setRoomType] = useState('');
  const [foods, setFoods] = useState('Pure Veg');
  const [amenities, setAmenities] = useState('');
  const [price, setPrice] = useState('');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeFrom, setTimeFrom] = useState('12:00');
  const [timeTo, setTimeTo] = useState('11:00');
  const [offerPercent, setOfferPercent] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  // State lists
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [offersList, setOffersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mapOffer = (o) => {
    const from = o.dateFrom || o.offer_date;
    const to = o.dateTo || o.offer_date;
    let dateFormatted = 'N/A';
    if (from) {
      const fromFormatted = new Date(from).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      dateFormatted = fromFormatted;
      if (to && new Date(to).getTime() !== new Date(from).getTime()) {
        const toFormatted = new Date(to).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (fromFormatted !== toFormatted) {
          dateFormatted = `${fromFormatted} to ${toFormatted}`;
        }
      }
    }
    const timeFormatted = o.offer_time || 'N/A';

    return {
      _id: o._id || o.id,
      id: o.offerId || 'N/A',
      raw: o, // Keep original object for editing
      dates: (
        <div style={{ whiteSpace: 'nowrap', lineHeight: '1.4' }}>
          <div>{dateFormatted}</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{timeFormatted}</div>
        </div>
      ),
      name: o.propertyName || o.property_id?.name || o.property_id?.propertyName || 'Property',
      location: o.location || o.property_id?.location || 'N/A',
      category: o.category || o.property_id?.type || o.property_id?.category || 'N/A',
      room: o.room_type || o.room || o.property_id?.roomType || 'N/A',
      price: o.price || o.price_per_room || o.property_id?.price || o.property_id?.bestRoomRate || '',
      foods: o.food_type || o.foods || o.property_id?.foodPreference || 'N/A',
      amenities: (Array.isArray(o.amenities) && o.amenities.length > 0) ? o.amenities.join(', ') : (o.amenities?.length ? o.amenities : ((Array.isArray(o.property_id?.amenities) && o.property_id.amenities.length > 0) ? o.property_id.amenities.join(', ') : (o.property_id?.amenities || 'N/A'))),
      offer: (() => {
        const val = o.offer_percent || o.offerPercent || o.offer || '';
        const str = String(val).trim();
        if (!str) return 'No Offer';
        if (/off/i.test(str)) return str;
        if (str.endsWith('%')) return `${str} Off`;
        return `${str}% Off`;
      })(),
      desc: o.description || o.desc || '',
      status: o.status || 'active'
    };
  };

  const refreshOffers = async () => {
    try {
      const res = await offerService.getMine();
      setOffersList((res.data || []).map(mapOffer));
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  const init = async () => {
    try {
      setLoading(true);
      const reqsRes = await propertyRequestService.getMine();
      const approved = (reqsRes.data || []).filter(r => r.admin_status === 'approved');
      
      // Sort alphabetically by property name
      approved.sort((a, b) => {
        const nameA = a.propertyName || a.property?.name || '';
        const nameB = b.propertyName || b.property?.name || '';
        return nameA.localeCompare(nameB);
      });
      
      setApprovedRequests(approved);

      // Only auto-select first if NOT editing
      if (!editId && approved.length > 0) {
        const first = approved[0];
        setSelectedRequestId(first._id || first.id);
        setPropertyId(first.property_id || first.property?._id || '');
        setCategory(first.category || first.property?.type || 'Homestay');
        setRoomType(first.room_type || 'Deluxe Room');
        const ams = first.amenities_types || first.property?.amenities || first.property?.amenityTypes || [];
        setAmenities(Array.isArray(ams) ? ams.join(', ') : ams);
        setPrice(first.price_per_room || first.property?.price || first.property?.bestRoomRate || 0);
      }

      await refreshOffers();
    } catch (err) {
      console.error('Error loading page data:', err);
      setOffersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleRequestChange = (requestId) => {
    setSelectedRequestId(requestId);
    const req = approvedRequests.find(r => r._id === requestId || r.id === requestId);
    if (req) {
      setPropertyId(req.property_id || req.property?._id || '');
      setCategory(req.category || req.property?.type || 'Homestay');
      setRoomType(req.room_type || 'Deluxe Room');
      const ams = req.amenities_types || req.property?.amenities || req.property?.amenityTypes || [];
      setAmenities(Array.isArray(ams) ? ams.join(', ') : ams);
      setPrice(req.price_per_room || req.property?.price || req.property?.bestRoomRate || 0);
      
      const fp = req.foodPreference || req.property?.foodPreference || 'none';
      let formattedFood = 'None';
      if (fp === 'veg') formattedFood = 'Pure Veg';
      if (fp === 'non-veg') formattedFood = 'Non-Veg';
      if (fp === 'both') formattedFood = 'Both';
      if (fp === 'none') formattedFood = 'None';
      setFoods(formattedFood);
    } else {
      setPropertyId('');
      setCategory('');
      setRoomType('');
      setAmenities('');
      setPrice('');
      setFoods('');
    }
  };

  const handleEditOffer = (offer) => {
    setEditId(offer._id);
    const raw = offer.raw;
    
    // Find the matching request to populate fields
    const reqId = raw.property_id?._id || raw.property_id;
    const req = approvedRequests.find(r => (r.property_id?._id || r.property_id || r.property?._id) === reqId);
    
    if (req) {
      setSelectedRequestId(req._id || req.id);
    }
    
    setPropertyId(reqId);
    setCategory(raw.category || '');
    setRoomType(raw.room_type || '');
    setAmenities(Array.isArray(raw.amenities) ? raw.amenities.join(', ') : (raw.amenities || ''));
    setFoods(raw.food_type || '');
    setPrice(raw.price || '');
    
    if (raw.dateFrom) setDateFrom(new Date(raw.dateFrom).toISOString().split('T')[0]);
    if (raw.dateTo) setDateTo(new Date(raw.dateTo).toISOString().split('T')[0]);
    
    if (raw.offer_time && raw.offer_time.includes(' to ')) {
      const [f, t] = raw.offer_time.split(' to ');
      setTimeFrom(f);
      setTimeTo(t);
    }
    
    setOfferPercent(raw.offer_percent || raw.offerPercent || '');
    setDescription(raw.description || '');
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setOfferPercent('');
    setDescription('');
    // Re-select first request
    if (approvedRequests.length > 0) {
      handleRequestChange(approvedRequests[0]._id || approvedRequests[0].id);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!propertyId) {
      alert('Please select a property configuration.');
      return;
    }

    try {
      setSubmitting(true);
      const req = approvedRequests.find(r => r._id === selectedRequestId || r.id === selectedRequestId);
      const payload = {
        property_id: propertyId,
        propertyName: req?.propertyName || req?.property?.name || '',
        location: req?.location || req?.property?.location || '',
        category: category,
        room_type: roomType,
        amenities: amenities,
        food_type: foods,
        offer_date: dateTo,
        dateFrom: dateFrom,
        dateTo: dateTo,
        offer_time: `${timeFrom} to ${timeTo}`,
        offer_percent: offerPercent,
        description: description
      };

      if (editId) {
        await offerService.update(editId, payload);
        alert('Promotional offer updated successfully!');
      } else {
        await offerService.create(payload);
        alert('Promotional offer created successfully and is live instantly!');
      }
      
      resetForm();
      await refreshOffers();
    } catch (err) {
      console.error('Error saving offer:', err);
      alert(err.response?.data?.message || 'Failed to save offer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (!offerId) return;
    const ok = confirm('Are you sure you want to delete this offer?');
    if (!ok) return;
    try {
      await offerService.remove(offerId);
      setOffersList((prev) => prev.filter((o) => o._id !== offerId));
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert('Failed to delete offer.');
    }
  };

  const filteredOffers = useMemo(() => {
    return offersList.filter((o) => {
      let matchQuery = true;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        matchQuery = (o.name || '').toLowerCase().includes(q) ||
          (o.location || '').toLowerCase().includes(q) ||
          (o.category || '').toLowerCase().includes(q) ||
          String(o.id || '').toLowerCase().includes(q);
      }

      let matchDate = true;
      if (filterDateFrom || filterDateTo) {
        // Find raw date data from original object
        // Re-construct the raw date from the original offersList mapping
        const oDateStr = o.dates?.props?.children?.[0]?.props?.children; // React node extraction
        let od = null;
        if (oDateStr && typeof oDateStr === 'string' && oDateStr !== 'N/A') {
           // It's in 'en-GB' format DD MMM YYYY, so parse it
           const d = new Date(oDateStr);
           if (!isNaN(d)) od = d;
        }

        if (!od) {
          // Fallback parsing or assume no match if dates are filtered
          matchDate = false;
        } else {
          od.setHours(0,0,0,0);
          if (filterDateFrom) {
            const fd = new Date(filterDateFrom);
            fd.setHours(0,0,0,0);
            if (od < fd) matchDate = false;
          }
          if (filterDateTo) {
            const td = new Date(filterDateTo);
            td.setHours(0,0,0,0);
            if (od > td) matchDate = false;
          }
        }
      }
      return matchQuery && matchDate;
    });
  }, [offersList, searchTerm, filterDateFrom, filterDateTo]);

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 24px 12px' }}>
        Property Management &gt; <span>Offers by Date</span>
      </div>

      {/* ══ Section 1: Form Card ══ */}
      <div className="dash-section" style={{ marginBottom: 16, padding: '24px' }}>
        <form onSubmit={handleCreateOffer} className="master-form-card" style={{ margin: 0, padding: 0, boxShadow: 'none', background: 'transparent' }}>
          
          {/* Form Header */}
          <div className="master-form-header" style={{ marginBottom: '24px' }}>
            <h3 className="master-form-title" style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>
              {editId ? 'Edit Promotional Offer' : 'Create Promotional Offer'}
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {editId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="btn-outline" 
                  style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', borderRadius: '8px', fontWeight: 600 }}
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="btn-solid-green" 
                disabled={submitting}
                style={{ cursor: 'pointer', padding: '8px 24px', fontSize: '12.5px', background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Saving...' : (editId ? 'Update Offer' : 'Add Offer')}
              </button>
            </div>
          </div>

          {/* Form Fields Grid - Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Name (Only Approved Properties)*</label>
              <select 
                className="form-select" 
                value={selectedRequestId} 
                onChange={(e) => handleRequestChange(e.target.value)}
                required
              >
                <option value="">Select approved configuration...</option>
                {approvedRequests.map(r => (
                  <option key={r._id || r.id} value={r._id || r.id}>
                    {r.propertyName || r.property?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={category} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={price ? `₹${price} per night` : ''} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 2 */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Foods (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={foods} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amenities Types (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={amenities} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
          </div>

          {/* Form Fields Grid - Row 3 */}
          <div className="form-grid-3">
            <div className="form-group split-date-time-grid">
              <div style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Valid From*</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={dateFrom} 
                  onChange={(e) => setDateFrom(e.target.value)}
                  required
                />
              </div>
              <div style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Valid To*</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={dateTo} 
                  onChange={(e) => setDateTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group split-date-time-grid">
              <div style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Start Time*</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={timeFrom} 
                  onChange={(e) => setTimeFrom(e.target.value)}
                  required
                />
              </div>
              <div style={{ width: '100%' }}>
                <label className="form-label" style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>End Time*</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={timeTo} 
                  onChange={(e) => setTimeTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Offer % (Discount)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={offerPercent} 
                onChange={(e) => setOfferPercent(e.target.value)}
                placeholder="e.g. 20% Off"
                required
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="form-grid-1" style={{ margin: 0 }}>
            <div className="form-group">
              <label className="form-label">Description*</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Offer applicable on first book"
                required
              />
            </div>
          </div>

        </form>
      </div>

      {/* Search Filter Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 24px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
          <DateRangeDropdown 
            startDate={filterDateFrom}
            endDate={filterDateTo}
            onChange={(start, end) => {
              setFilterDateFrom(start);
              setFilterDateTo(end);
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', maxWidth: '300px', minWidth: '200px' }}>
            <Search size={16} style={{ color: '#9CA3AF', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search offers..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      {/* ══ Section 2: Table Card ══ */}
      <div style={{ margin: '0 24px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: '100%' }}>
          <div style={{ overflowX: 'auto', width: '100%', display: 'block' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap', minWidth: 1000 }}>
              <thead>
                <tr>
                  {['Offer ID', 'Dates & Time', 'Property Name', 'Location', 'Category', 'Price', 'Foods', 'Amenities', 'Offer %', 'Description', 'Status', ''].map((h, i) => (
                    <th key={i} style={{ minWidth: { 'Offer ID': 90, 'Dates & Time': 140, 'Property Name': 160, 'Location': 150, 'Category': 100, 'Price': 100, 'Foods': 90, 'Amenities': 150, 'Offer %': 90, 'Description': 150, 'Status': 90 }[h], color: '#9CA3AF', fontWeight: 500, padding: '14px 16px' }}>
                      <span className="th-inner">
                        {h}
                        {h && <ChevronDown size={10} style={{ color: '#CBD5E1', marginLeft: 4 }} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="12" style={{ padding: '14px 16px', color: '#6B7280' }}>Loading offers...</td></tr>
                ) : filteredOffers.length === 0 ? (
                  <tr><td colSpan="12" style={{ padding: '14px 16px', color: '#6B7280' }}>No promotional offers found.</td></tr>
                ) : filteredOffers.map((o, i) => (
                  <tr key={o._id}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px 16px' }}>{o.id}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px' }}>{o.dates}</td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px', whiteSpace: 'normal', maxWidth: '160px' }}>
                      <ReadMore lines={2}>{o.name}</ReadMore>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ maxWidth: 200, whiteSpace: 'normal', lineHeight: 1.4, color: '#6B7280' }}>
                        <ReadMore lines={2}>{o.location}</ReadMore>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="category-pill" style={{ background: '#F0FAF6', color: '#1d9e75', fontWeight: 500, padding: '3px 10px', borderRadius: '4px', fontSize: '11px' }}>
                        {o.category}
                      </span>
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}>
                      {o.price ? `₹${o.price}` : 'N/A'}
                    </td>
                    <td style={{ color: '#4B5563', padding: '14px 16px' }}>{o.foods}</td>
                    <td style={{ color: '#4B5563', padding: '14px 16px', whiteSpace: 'normal', maxWidth: '160px' }}><ReadMore lines={2}>{o.amenities}</ReadMore></td>
                    <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{o.offer}</td>
                    <td style={{ color: '#6B7280', padding: '14px 16px', whiteSpace: 'normal', maxWidth: '160px' }}><ReadMore lines={2}>{o.desc}</ReadMore></td>
                    <td style={{ padding: '14px 16px' }}>
                      {o.status.toLowerCase() === 'active'
                        ? <span className="status-pill active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#DCFCE7', color: '#58A429' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#58A429' }}></span> Active
                          </span>
                        : <span className="status-pill inactive" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#FEE2E2', color: '#EF4444' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }}></span> Expired
                          </span>
                      }
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => handleEditOffer(o)} style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteOffer(o._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
