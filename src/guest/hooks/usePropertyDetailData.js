import { useEffect, useState } from 'react';

export default function usePropertyDetailData({ API_BASE, selectedProperty }) {
  const [propertyRooms, setPropertyRooms] = useState([]);
  const [dynamicLandmarks, setDynamicLandmarks] = useState([]);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [dynamicReviewStats, setDynamicReviewStats] = useState({ avg: 0, count: 0, label: 'No Reviews' });
  const [fullPropertyDetail, setFullPropertyDetail] = useState(null);

  useEffect(() => {
    if (selectedProperty && selectedProperty._id && /^[0-9a-fA-F]{24}$/.test(selectedProperty._id)) {
      // Fetch property rooms
      fetch(`${API_BASE}/property-requests/property/${selectedProperty._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setPropertyRooms(data);
          } else {
            setPropertyRooms([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching property rooms:', err);
          setPropertyRooms([]);
        });

      // Fetch dynamic landmarks
      fetch(`${API_BASE}/properties/${selectedProperty._id}/landmarks`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDynamicLandmarks(data);
          } else {
            setDynamicLandmarks([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching landmarks:', err);
          setDynamicLandmarks([]);
        });

      // Fetch reviews
      fetch(`${API_BASE}/reviews/${selectedProperty._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setDynamicReviews(data);
          else setDynamicReviews([]);
        })
        .catch(() => setDynamicReviews([]));

      // Fetch review stats
      fetch(`${API_BASE}/reviews/rating/${selectedProperty._id}`)
        .then((res) => res.json())
        .then((data) => setDynamicReviewStats(data))
        .catch(() => setDynamicReviewStats({ avg: 0, count: 0, label: 'No Reviews' }));

      // Fetch full property details
      fetch(`${API_BASE}/properties/${selectedProperty._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data._id) {
            setFullPropertyDetail(data);
          }
        })
        .catch((err) => console.error('Error fetching full details:', err));
    } else {
      setPropertyRooms([]);
      setDynamicLandmarks([]);
      setDynamicReviews([]);
      setDynamicReviewStats({ avg: 0, count: 0, label: 'No Reviews' });
      setFullPropertyDetail(null);
    }
  }, [API_BASE, selectedProperty]);

  return {
    propertyRooms,
    dynamicLandmarks,
    dynamicReviews,
    setDynamicReviews,
    dynamicReviewStats,
    fullPropertyDetail,
  };
}

