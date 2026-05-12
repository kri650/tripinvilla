import React, { useState } from 'react';
import { 
  Home, MapPin, Heart, Inbox, Info, ThumbsUp, PlusCircle, 
  Search, Sparkles, Calendar, Users, DollarSign, Bed, Utensils, ChevronDown,
  ChevronLeft, ChevronRight, Star, CreditCard, Shield, Percent,
  Maximize, DoorClosed, Compass, Trees, Building, Hotel, CheckCircle, Phone,
  Edit2, User, Filter, MessageSquare, Play, Sliders, UserRound, UploadCloud
} from 'lucide-react';
import logoImg from './assets/Mask group.png';
import heroBgImg from './assets/image.png';
import './App.css';

// Import the exact custom Figma-exported icons uploaded by the user
import homeIcon from './assets/Group 1707482340 (2).png';
import propertiesIcon from './assets/Group 1707482340 (3).png';
import wishlistIcon from './assets/Group 1707482340 (4).png';
import enquiriesIcon from './assets/Group 1707482340 (5).png';
import aboutIcon from './assets/Group 1707482340.png';
import recommendIcon from './assets/Group 1707482340 (1).png';
import listYourPlaceIcon from './assets/Group 1707482340.svg';

const carouselDestinations = [
  { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80', count: 'Homestays - Villas & Appartments' },
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80', count: 'Homestays - Villas & Appartments' },
  { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80', count: 'Homestays - Villas & Appartments' },
  { name: 'Manali', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80', count: 'Homestays - Villas & Appartments' },
  { name: 'Kasol', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', count: 'Homestays - Villas & Appartments' },
  { name: 'Mukteswar', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80', count: 'Homestays - Villas & Appartments' },
];

const bestVillasList = [
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    hasToggle: true
  },
  {
    title: 'The Royal Canopy',
    location: 'Jaipur, Rajasthan, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Urban Nest Hotel',
    location: 'Sisu, Himachal Pradesh, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Serene Hills Homestay',
    location: 'Munnar, Kerala, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Anaya Homestay',
    location: 'Kalimpong, West Bengal, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Pinewood Cozy Cabin',
    location: 'Shimla, Himachal Pradesh, India',
    rating: '4.9',
    reviews: '1,850 Genuine Reviews',
    price: '₹150',
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Oak Ridge Luxury Villa',
    location: 'Nainital, Uttarakhand, India',
    rating: '4.7',
    reviews: '2,110 Genuine Reviews',
    price: '₹135',
    img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80'
  }
];

const curatedList = [
  {
    title: 'Sea Breeze Villa',
    location: 'Alibaug, Maharashtra',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Hilltop Escape Villa',
    location: 'Ooty, Tamil Nadu',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Serene Forest Lodge',
    location: 'Coorg, Karnataka',
    rating: '4.9',
    reviews: '2,890 Genuine Reviews',
    price: '₹160',
    img: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80'
  }
];

const popularOffersList = [
  {
    title: 'Luxury Villas & Premium Stays',
    subtitle: 'Handpicked villas and stays for your perfect getaway',
    discount: 'Up to 30% OFF',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Private Villas & Serene Stays',
    subtitle: 'Handpicked villas and stays for your perfect getaway',
    discount: 'Up to 30% OFF',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Verified Villas & Stays',
    subtitle: 'Handpicked villas and stays for your perfect getaway',
    discount: 'Up to 30% OFF',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Weekend Villa Deals',
    subtitle: 'Handpicked villas and stays for your perfect getaway',
    discount: 'Up to 30% OFF',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  }
];

// Additional lists specifically for Properties page
const propertyCategories = [
  { name: 'Apartments', icon: <Building size={15} /> },
  { name: 'Homestays', icon: <Compass size={15} /> },
  { name: 'Resorts', icon: <Hotel size={15} /> },
  { name: 'Motels', icon: <Bed size={15} /> },
  { name: 'Cottages', icon: <Trees size={15} /> },
  { name: 'Bungalows', icon: <Home size={15} /> },
  { name: 'Villas', icon: <Building size={15} /> }
];

const propertiesVillasList = [
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80'
  }
];

const propertiesHomestaysList = [
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    area: '31 sq. ft.',
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
  }
];

// Detail page specific mock datasets
const detailSubTabs = ['Rooms', 'Location', 'Property Rules', 'User Reviews'];

const roomOptions = [
  {
    title: 'Exclusive Deluxe Room',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    features: ['15% off in foods', 'Barbeque Included'],
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person'
  },
  {
    title: 'Deluxe AC Room',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    features: ['15% off in foods', 'Barbeque Included'],
    beds: '2 Beds',
    rooms: '1 Room',
    guests: '3 Person'
  }
];

const landmarks = [
  { name: 'Anjuna Flea Market', label: 'Tourist Popular' },
  { name: 'Candolim Beach', label: 'Tourist Popular' },
  { name: 'Fort Aguada', label: 'Tourist Popular' },
  { name: 'Basilica of Bom Jesu', label: 'Tourist Popular' }
];

const userReviewsList = [
  {
    name: 'Amit Verma',
    role: 'Director of Operations, Enterprise Client',
    text: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.'
  },
  {
    name: 'Ronit Sen',
    role: 'Director of Operations, Enterprise Client',
    text: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.'
  },
  {
    name: 'Divya Sharma',
    role: 'Director of Operations, Enterprise Client',
    text: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.'
  }
];

// Saved Wishlist Items dataset
const savedWishlistItems = [
  {
    title: 'Aparthotel Stare Miasto',
    location: 'Kasol, Himachal Pradesh, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'The Royal Canopy',
    location: 'Jaipur, Rajasthan, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Urban Nest Hotel',
    location: 'Sisu, Himachal Pradesh, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Serene Hills Homestay',
    location: 'Munnar, Kerala, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Anaya Homestay',
    location: 'Kalimpong, West Bengal, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    rating: '4.8',
    reviews: '3,245 Genuine Reviews',
    price: '₹140',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  }
];

// Enquiry dataset matching the shared Figma screenshot perfectly
const savedEnquiriesList = [
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    enquiryText: 'What is the special amenities of the hotel deluxe rooms and other details',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    enquiryText: 'What is the special amenities of the hotel deluxe rooms and other details',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    enquiryText: 'What is the special amenities of the hotel deluxe rooms and other details',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    enquiryText: 'What is the special amenities of the hotel deluxe rooms and other details',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80'
  }
];

// Custom User Reviews written by the user matching the shared Figma screenshot perfectly
const savedUserReviewsFeed = [
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    reviewText: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    reviewText: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    reviewText: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80'
  },
  {
    title: 'Bodhi Roots Homestay',
    location: 'Bodh Gaya, Bihar, India',
    reviewText: 'Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=300&q=80'
  }
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [activeSearchTab, setActiveSearchTab] = useState('Villas');
  const [activeDestTab, setActiveDestTab] = useState('Destinations');
  const [activePropCategory, setActivePropCategory] = useState('Apartments');
  const [activeDetailTab, setActiveDetailTab] = useState('Rooms');

  // Input states
  const [where, setWhere] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('Any Guests');
  const [price, setPrice] = useState('Any');
  const [stayType, setStayType] = useState('Any');
  const [foodPref, setFoodPref] = useState('Any');
  
  // Checkbox states
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Contact Us Form States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactAgreed, setContactAgreed] = useState(false);

  // Recommended Page Wishlist toggled list
  const [recWishlist, setRecWishlist] = useState([0, 2]);

  // List Your Place Page Collapsible FAQ Active Index
  const [activeFaq, setActiveFaq] = useState(0);

  // Interactive Auth Modal States (Figma accurate design!)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'

  // Contact Detail Verification Modal States (Figma accurate design!)
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactStep, setContactStep] = useState(1); // 1 = View Contact, 2 = Request OTP
  const [contactOTP, setContactOTP] = useState(['', '', '', '', '', '']);
  const [hostContactRevealed, setHostContactRevealed] = useState(false);

  // Experience Review Modal States (Figma accurate design!)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Search trigger alert
  const handleSearch = () => {
    alert(`Searching for ${activeSearchTab} in "${where || 'All places'}" with criteria...`);
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
  };

  const navItems = [
    { 
      name: 'Home', 
      lucideIcon: <Home size={13} strokeWidth={2.5} />, 
      customIcon: homeIcon
    },
    { 
      name: 'Properties', 
      lucideIcon: <MapPin size={13} strokeWidth={2.5} />, 
      customIcon: propertiesIcon 
    },
    { 
      name: 'Wishlist', 
      lucideIcon: <Heart size={13} strokeWidth={2.5} />, 
      customIcon: wishlistIcon 
    },
    { 
      name: 'My Enquiries', 
      lucideIcon: <Inbox size={13} strokeWidth={2.5} />, 
      customIcon: enquiriesIcon 
    },
    { 
      name: 'About Us', 
      lucideIcon: <Info size={13} strokeWidth={2.5} />, 
      customIcon: aboutIcon 
    },
    { 
      name: 'Recommend By Us', 
      lucideIcon: <ThumbsUp size={13} strokeWidth={2.5} />, 
      customIcon: recommendIcon 
    },
    { 
      name: 'List Your Place', 
      lucideIcon: <PlusCircle size={13} strokeWidth={2.5} />, 
      customIcon: listYourPlaceIcon 
    }
  ];

  return (
    <>
      <div className="app-main-root-container">

        {/* ══ GLOBAL NAVBAR CONTAINER (Shared Everywhere!) ══ */}
        <div className="navbar-container">
          {/* Logo image rendered beautifully with custom specs */}
          <div className="nav-logo" onClick={() => setActiveMenu('Home')}>
            <img src={logoImg} alt="Tripinstays Logo" />
          </div>

          {/* Navigation central capsule pill menu */}
          <div className="nav-pill-wrapper">
            {navItems.map((item, index) => {
              const isActive = (activeMenu === item.name) || 
                               (activeMenu === 'Detail' && item.name === 'Properties') || 
                               (activeMenu === 'Profile' && item.name === 'Properties') || 
                               (activeMenu === 'Enquiries' && item.name === 'My Enquiries');
              return (
                <React.Fragment key={item.name}>
                  <button
                    onClick={() => {
                      if (item.name === 'My Enquiries') {
                        setActiveMenu('Enquiries');
                      } else if (item.name === 'Wishlist') {
                        setActiveMenu('Wishlist');
                      } else {
                        setActiveMenu(item.name);
                      }
                    }}
                    className="nav-pill-item"
                  >
                    {isActive ? (
                      /* Active state: Renders the EXACT same custom icon image, but inside a solid blue background container! */
                      <div 
                        style={{ 
                          width: '31px', 
                          height: '31px', 
                          borderRadius: '50%', 
                          background: 'var(--primary-blue)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)'
                        }}
                      >
                        <img 
                          src={item.customIcon} 
                          alt={item.name} 
                          style={{ 
                            width: '31px', 
                            height: '31px', 
                            objectFit: 'contain',
                            display: 'block'
                          }} 
                        />
                      </div>
                    ) : (
                      /* Inactive state: Renders the exact same custom icon image naturally */
                      <img 
                        src={item.customIcon} 
                        alt={item.name} 
                        style={{ 
                          width: '31px', 
                          height: '31px', 
                          objectFit: 'contain',
                          display: 'block'
                        }} 
                      />
                    )}
                    <span>{item.name}</span>
                  </button>
                  {/* Vertical separator divider if not the last item */}
                  {index < navItems.length - 1 && <div className="nav-divider" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Action Log In button / Profile Route */}
          <button className="btn-login" onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}>
            Log In / Sign Up
          </button>
        </div>
      {/* ══ HERO SECTION (Height: 712px, Width: 100%) ══ */}
      {(activeMenu !== 'Detail' && activeMenu !== 'Profile' && activeMenu !== 'Wishlist' && activeMenu !== 'Enquiries' && activeMenu !== 'Reviews' && activeMenu !== 'About Us' && activeMenu !== 'Contact' && activeMenu !== 'Terms' && activeMenu !== 'Recommend By Us' && activeMenu !== 'List Your Place') && (
        <div className="hero-wrapper">
          
          {/* Background Image: Loads your exact high-resolution custom hero image */}
          <img 
            src={heroBgImg} 
            className="hero-background" 
            alt="Luxury Villa Background" 
          />

          {/* Overlay holding the header, titles and layout layers */}
          <div className="hero-overlay">
            
            {/* ══ MAIN HERO HEADLINE (Conditional based on properties tab) ══ */}
            <div className="hero-headline-container">
              {activeMenu === 'Properties' ? (
                <h1 className="hero-headline">
                  Best <span className="highlight-sharp-blue-box" style={{ borderRadius: 0 }}>Properties</span> For You
                </h1>
              ) : (
                <h1 className="hero-headline">
                  Find Your 
                  <span className="hero-headline-span">
                    Perfect Stay
                  </span>
                </h1>
              )}
            </div>

          </div>

          {/* ══ FLOATING SEARCH CARD ══ */}
          <div className="search-card-wrapper">
            {/* Top category bar */}
            <div className="tabs-row">
              {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSearchTab(tab)}
                  className={`tab-btn ${activeSearchTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Grid inputs layout */}
            <div className="search-fields-grid">
              
              {/* Field 1: Where */}
              <div className="field-group">
                <span className="field-label">Where</span>
                <div className="field-control-wrap">
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Where are you going?" 
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 2: When */}
              <div className="field-group">
                <span className="field-label">When</span>
                <div className="field-control-wrap">
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Select dates" 
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 3: Who */}
              <div className="field-group">
                <span className="field-label">Who</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={guests} 
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    <option value="Any Guests">Any Guests</option>
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4+ Guests">4+ Guests</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

              {/* Field 4: Price per Night */}
              <div className="field-group">
                <span className="field-label">Price per Night</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
                    <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                    <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                    <option value="₹20,000+">₹20,000+</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

              {/* Field 5: Room/Stay Type */}
              <div className="field-group">
                <span className="field-label">Room/Stay Type</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={stayType} 
                    onChange={(e) => setStayType(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="1 Deluxe Room">1 Deluxe Room</option>
                    <option value="2 Deluxe Rooms">2 Deluxe Rooms</option>
                    <option value="Entire Villa">Entire Villa</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

              {/* Field 6: Food Preference */}
              <div className="field-group">
                <span className="field-label">Food Preference</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={foodPref} 
                    onChange={(e) => setFoodPref(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Buffet Available">Buffet Available</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

            </div>

            {/* Action and Checkbox controls row */}
            <div className="action-buttons-row">
              
              {/* Filter checkboxes */}
              <div className="checkbox-row">
                <label className="custom-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <span>Verified only</span>
                </label>
                <label className="custom-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox" 
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                  />
                  <span>Featured only</span>
                </label>
              </div>

              {/* Execution Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="text-btn" onClick={handleClearAll}>Clear all</button>
                <button className="text-btn">Close</button>
                
                <button className="btn-search-ai">
                  <Sparkles size={16} color="var(--primary-blue)" />
                  <span>Search with AI</span>
                </button>
                
                <button className="btn-search" onClick={handleSearch}>
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ══ CONDITIONAL ROUTING ══ */}

      {/* VIEW A: MY PROFILE (MY ACCOUNT) PAGE VIEW */}
      {activeMenu === 'Profile' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution profile banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Profile</h1>
          </div>

          <div className="dashboard-content-box">
            <h2 className="dashboard-section-main">My Account</h2>
            <p className="dashboard-section-sub">Manage your bookings, wishlist, and personal details here.</p>

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn active" onClick={() => setActiveMenu('Profile')}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Wishlist')}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Enquiries')}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Profile Grid Card details */}
            <div className="profile-detail-card">
              
              {/* Header Avatar and Name row */}
              <div className="profile-card-avatar-row">
                <div className="profile-avatar-large">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Rohan Sharma" />
                </div>
                <div className="profile-avatar-info">
                  <h3 className="profile-user-fullname">Rohan Joshi</h3>
                </div>
              </div>

              {/* Personal Info Grid Block */}
              <div className="profile-grid-block">
                <div className="block-header">
                  <h4>Personal Information</h4>
                  <button className="btn-edit-details">
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="block-fields-grid">
                  <div className="field-cell">
                    <span className="field-cell-lbl">First Name</span>
                    <span className="field-cell-val">Rohan</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Last Name</span>
                    <span className="field-cell-val">Sharma</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Country of Citizenship</span>
                    <span className="field-cell-val">India</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Email Address</span>
                    <span className="field-cell-val">rohanjoshi@gmail.com</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Phone Number</span>
                    <span className="field-cell-val">+91 98765 43210</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Country of Residence</span>
                    <span className="field-cell-val">India</span>
                  </div>
                </div>
              </div>

              {/* Address Grid Block */}
              <div className="profile-grid-block">
                <div className="block-header">
                  <h4>Address</h4>
                  <button className="btn-edit-details">
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="block-fields-grid">
                  <div className="field-cell full-width">
                    <span className="field-cell-lbl">Home Address</span>
                    <span className="field-cell-val">Flat No. 302, Green Apartments HSR Layout, Bangalore</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Pin Code</span>
                    <span className="field-cell-val">560102</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">State</span>
                    <span className="field-cell-val">Karnataka</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">City</span>
                    <span className="field-cell-val">Bangalore</span>
                  </div>
                </div>
              </div>

              {/* Other Details Grid Block */}
              <div className="profile-grid-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div className="block-header">
                  <h4>Other Details</h4>
                  <button className="btn-edit-details">
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="block-fields-grid">
                  <div className="field-cell">
                    <span className="field-cell-lbl">Emergency Contact Person</span>
                    <span className="field-cell-val">Vikrant Rao</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Phone Number</span>
                    <span className="field-cell-val">+91 98765 43210</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Email Address</span>
                    <span className="field-cell-val">vikrantrao@gmail.com</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* VIEW B: MY WISHLIST PAGE VIEW */}
      {activeMenu === 'Wishlist' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution wishlist banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Wishlist</h1>
          </div>

          <div className="dashboard-content-box">
            <div className="wishlist-title-header-row">
              <h2 className="dashboard-section-main">Wishlist</h2>
              <button className="btn-wishlist-filter">
                <Filter size={14} />
                <span>Filters</span>
              </button>
            </div>
            <p className="dashboard-section-sub">Keep track of destinations and villas you love. Access them anytime and make your travel planning simple.</p>

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn" onClick={() => setActiveMenu('Profile')}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn active" onClick={() => setActiveMenu('Wishlist')}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Enquiries')}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Saved villas wishlist grid layout */}
            <div className="villas-grid" style={{ marginTop: '40px' }}>
              {savedWishlistItems.map((villa, idx) => (
                <div key={idx} className="villa-card">
                  <div className="villa-card-img-wrap">
                    <img src={villa.img} alt={villa.title} />
                    <button className="wishlist-btn-circle active">
                      <Heart size={16} fill="#EF4444" color="#EF4444" />
                    </button>
                  </div>
                  
                  <div className="villa-card-content">
                    <h3 className="villa-card-title">{villa.title}</h3>
                    
                    <div className="villa-card-location">
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{villa.location}</span>
                    </div>

                    <div className="villa-card-rating-row">
                      <div className="rating-pill">
                        <Star size={11} fill="#FFFFFF" color="#FFFFFF" />
                        <span>{villa.rating}</span>
                      </div>
                      <span className="rating-desc-excellent">Excellent</span>
                      <span className="rating-reviews-count">{villa.reviews}</span>
                    </div>

                    <div className="villa-card-price-row">
                      <span className="price-label">Starting from</span>
                      <span className="price-value-highlight">{villa.price}/night</span>
                    </div>

                    <div className="villa-card-actions">
                      <button className="btn-villa-action outline-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      <button className="btn-villa-action outline-green">Contact Owner</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-2: MY ENQUIRIES PAGE VIEW */}
      {activeMenu === 'Enquiries' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution enquiries banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Enquiries</h1>
          </div>

          <div className="dashboard-content-box">
            <div className="wishlist-title-header-row">
              <h2 className="dashboard-section-main">My Enquiries</h2>
              <button className="btn-wishlist-filter">
                <Filter size={14} />
                <span>Filters</span>
              </button>
            </div>
            <p className="dashboard-section-sub">Manage your enquiries details from here</p>

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn" onClick={() => setActiveMenu('Profile')}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Wishlist')}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn active" onClick={() => setActiveMenu('Enquiries')}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Enquiries horizontal list container */}
            <div className="dashboard-list-items-stack">
              {savedEnquiriesList.map((enq, index) => (
                <div key={index} className="dashboard-list-card">
                  <div className="list-card-img-wrap">
                    <img src={enq.img} alt={enq.title} />
                  </div>
                  <div className="list-card-details">
                    <h3 className="list-card-title">{enq.title}</h3>
                    <div className="list-card-location">
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{enq.location}</span>
                    </div>
                    <p className="list-card-question">
                      "{enq.enquiryText}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-3: MY REVIEWS PAGE VIEW */}
      {activeMenu === 'Reviews' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution reviews banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Reviews</h1>
          </div>

          <div className="dashboard-content-box">
            <div className="wishlist-title-header-row">
              <h2 className="dashboard-section-main">My Reviews</h2>
              <button className="btn-wishlist-filter">
                <Filter size={14} />
                <span>Filters</span>
              </button>
            </div>
            <p className="dashboard-section-sub">Manage your review details from here</p>

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn" onClick={() => setActiveMenu('Profile')}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Wishlist')}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Enquiries')}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn active" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Reviews horizontal list container */}
            <div className="dashboard-list-items-stack">
              {savedUserReviewsFeed.map((rev, index) => (
                <div key={index} className="dashboard-list-card">
                  <div className="list-card-img-wrap">
                    <img src={rev.img} alt={rev.title} />
                  </div>
                  <div className="list-card-details">
                    <h3 className="list-card-title">{rev.title}</h3>
                    <div className="list-card-location">
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{rev.location}</span>
                    </div>
                    <p className="list-card-question" style={{ color: '#4B5563', fontStyle: 'italic' }}>
                      "{rev.reviewText}"
                    </p>
                    
                    <div className="review-star-rating-row" style={{ marginTop: '8px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={15} fill="var(--primary-blue)" color="var(--primary-blue)" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-4: ABOUT US FULL PAGE VIEW */}
      {activeMenu === 'About Us' && (
        <div className="about-page-layout fade-in">
          
          {/* Custom scenic high-resolution About Us banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>About Us</h1>
          </div>

          <div className="about-main-wrapper">
            
            {/* Split layout: brand statements vs alpine photo card */}
            <div className="about-split-grid">
              
              {/* Left Column texts */}
              <div className="about-left-col">
                <h2 className="about-main-hdr">
                  Redefining the Way You <span className="highlight-sharp-blue-box" style={{ borderRadius: 0, padding: '4px 10px' }}>Experience Stays</span>
                </h2>
                
                <p className="about-desc-p">
                  We bring together handpicked hotels and private villas that combine comfort, quality, and reliability. Every property on our platform is carefully verified to ensure high standards of hospitality, transparent pricing, and a seamless booking experience—so you can focus on enjoying your journey, not planning it.
                </p>

                <div className="about-bullets-row">
                  <div className="about-bullet-item">
                    <CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                    <span>Curated & Verified Stays</span>
                  </div>
                  <div className="about-bullet-item">
                    <CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                    <span>Seamless Booking Experience</span>
                  </div>
                </div>

                {/* Our Mission */}
                <div className="about-mission-block">
                  <div className="green-circle-icon-wrap">
                    <ThumbsUp size={18} color="#48BB78" />
                  </div>
                  <div className="mission-texts">
                    <h5>Our Mission</h5>
                    <p>Our mission is to connect travelers with high-quality stays through a user-friendly platform.</p>
                  </div>
                </div>

                {/* Our Vision */}
                <div className="about-mission-block">
                  <div className="green-circle-icon-wrap">
                    <Sparkles size={18} color="#48BB78" />
                  </div>
                  <div className="mission-texts">
                    <h5>Our Vision</h5>
                    <p>To become a trusted travel platform that redefines how people discover and experience hotels and villas—making every stay comfortable, reliable, and memorable.</p>
                  </div>
                </div>

              </div>

              {/* Center Decorative Column */}
              <div className="about-vertical-line"></div>

              {/* Right Column photo */}
              <div className="about-right-col">
                <div className="about-master-image-box">
                  <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80" alt="Sunny alpine mountain chalet" />
                </div>
                
                {/* 40+ blue overlapping card */}
                <div className="about-blue-badge-card">
                  <span className="about-badge-title">40+</span>
                  <span className="about-badge-sub">Years of Experience That Drive Results</span>
                </div>
              </div>
            </div>

            {/* Why Choose Our Services (Reused Component directly!) */}
            <div className="services-section" style={{ background: '#EBFDF2', padding: '60px 0', borderRadius: '24px', margin: '80px 0 60px 0' }}>
              <div className="services-inner-container" style={{ width: '100%', maxWidth: '1120px' }}>
                
                <div className="section-title-wrap">
                  <h2 className="section-main-headline">
                    Why Choose Our <span className="highlight-sharp-blue-box">Services</span>
                  </h2>
                  <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                    Choose the next destination for you
                  </p>
                </div>

                <div className="services-grid-asym">
                  <div className="services-col">
                    <div className="service-text-card white-bg">
                      <p className="service-card-desc">
                        Every property is carefully verified to ensure quality, safety, and comfort you can rely on.
                      </p>
                      <h3 className="service-card-accent-title">Verified & Trusted Stays</h3>
                      <p className="service-card-subtext">Get genuine and good stays</p>
                    </div>
                    <div className="service-image-card">
                      <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" alt="Secure Payments" />
                      <div className="service-overlay-badge-bottom">
                        <div className="service-icon-circle-overlay"><CreditCard size={18} color="#FFFFFF" /></div>
                        <span>Secure Payments</span>
                      </div>
                    </div>
                  </div>

                  <div className="services-col-center">
                    <div className="service-tall-card">
                      <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" alt="Traveler center image" />
                    </div>
                  </div>

                  <div className="services-col">
                    <div className="service-image-card">
                      <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" alt="Best Price" />
                      <div className="service-overlay-badge-bottom">
                        <div className="service-icon-circle-overlay"><Percent size={18} color="#FFFFFF" /></div>
                        <span>Best Price Guarantee</span>
                      </div>
                    </div>
                    <div className="service-text-card transparent-bg">
                      <h3 className="service-card-accent-title">24/7 Support, Always There</h3>
                      <p className="service-card-bold-sub">All type of support</p>
                      <p className="service-card-desc-light">
                        From booking to checkout, our support team is available anytime to help you.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Our Testimonials Section */}
            <div className="our-testimonials-section" style={{ margin: '80px 0 40px 0' }}>
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  Our <span className="highlight-sharp-blue-box">Testimonials</span>
                </h2>
                <p className="section-sub-headline">
                  Check what our customers says about us
                </p>
              </div>

              {/* Renders the horizontal reviewers stack */}
              <div className="testimonials-horizontal-cards-row">
                
                {/* Review Card 1 */}
                <div className="testimonial-card-item">
                  <div className="testimonial-author-avatar-top">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Jessy Roy" />
                  </div>
                  <p className="testimonial-card-quote">
                    "Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth. They didn't just deliver a solution—they delivered confidence and long-term value."
                  </p>
                  <div className="testimonial-footer-info">
                    <h5 className="author-name-signature">Jessy Roy</h5>
                    <span className="author-role-text">Director of Operations, Enterprise Client</span>
                  </div>
                </div>

                {/* Review Card 2: Full video cover style with overlay */}
                <div className="testimonial-card-item image-cover-mode">
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" alt="David Campbell" />
                  
                  <div className="image-cover-tint-overlay">
                    {/* Circle avatar badge */}
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF' }}>
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="David thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div className="play-btn-circle-large">
                      <Play size={20} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '3px' }} />
                    </div>

                    <div>
                      <h5 className="cover-mode-signature-title">David Campbell</h5>
                      <span className="cover-mode-signature-role">Head of Digital Transformation</span>
                    </div>
                  </div>
                </div>

                {/* Review Card 3 */}
                <div className="testimonial-card-item">
                  <div className="testimonial-author-avatar-top">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Jeremy Renner" />
                  </div>
                  <p className="testimonial-card-quote">
                    "From initial consultation to final delivery, the team demonstrated exceptional professionalism. Their attention to detail, responsiveness, and quality of work significantly improved our operational efficiency."
                  </p>
                  <div className="testimonial-footer-info">
                    <h5 className="author-name-signature">Jeremy Renner</h5>
                    <span className="author-role-text">Project Manager, Corporate Solutions Firm</span>
                  </div>
                </div>

                {/* Review Card 4 */}
                <div className="testimonial-card-item">
                  <div className="testimonial-author-avatar-top">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Winona Ryder" />
                  </div>
                  <p className="testimonial-card-quote">
                    "Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth. They didn't just deliver a solution—they delivered confidence and long-term value."
                  </p>
                  <div className="testimonial-footer-info">
                    <h5 className="author-name-signature">Winona Ryder</h5>
                    <span className="author-role-text">CEO, Growing Tech Company</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-5: CONTACT US FULL PAGE VIEW */}
      {activeMenu === 'Contact' && (
        <div className="contact-page-wrapper fade-in">
          
          {/* Custom scenic high-resolution Contact Us banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Contact Us</h1>
          </div>

          {/* Main Card Grid container holding left photo and right interactive form */}
          <div className="contact-main-row">
            
            {/* Left Column Image of front desk receptionists */}
            <div className="contact-image-panel">
              <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80" alt="Professional hotel frontdesk receptionists" />
            </div>

            {/* Right Column Form */}
            <div className="contact-form-panel">
              <h2 className="contact-form-title">Contact Us</h2>
              <p className="contact-form-sub">Fill out the form below & our team of expert will reach out to you as soon as possible.</p>

              <div className="contact-form-grid">
                
                {/* Row 1: Name and Phone */}
                <div className="contact-input-row">
                  <div className="contact-field-group">
                    <label className="contact-field-label">Name</label>
                    <input 
                      type="text" 
                      className="contact-text-input" 
                      placeholder="Enter your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="contact-field-group">
                    <label className="contact-field-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="contact-text-input" 
                      placeholder="Enter your phone number"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="contact-field-group">
                  <label className="contact-field-label">Email Address</label>
                  <input 
                    type="email" 
                    className="contact-text-input" 
                    placeholder="Enter your email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                {/* Row 3: Message */}
                <div className="contact-field-group">
                  <label className="contact-field-label">Message</label>
                  <textarea 
                    className="contact-textarea" 
                    placeholder="Enter your message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>

                {/* Row 4: Custom Circular Radio Agreement check */}
                <div className="contact-agreement-row" onClick={() => setContactAgreed(!contactAgreed)}>
                  <div className={`contact-radio-indicator ${contactAgreed ? 'checked' : ''}`}>
                    {contactAgreed && <div className="contact-radio-dot" />}
                  </div>
                  <span className="contact-agreement-text">Agreed to the terms & conditions</span>
                </div>

                {/* Row 5: Action submit button */}
                <button 
                  className="btn-send-message-green"
                  onClick={() => {
                    if (!contactAgreed) {
                      alert('Please agree to the terms & conditions first!');
                      return;
                    }
                    alert(`Thank you ${contactName || 'Valued Guest'}! Your message has been sent to our corporate desks successfully!`);
                    setContactName('');
                    setContactPhone('');
                    setContactEmail('');
                    setContactMessage('');
                    setContactAgreed(false);
                  }}
                >
                  <span>Send us a message</span>
                  <ChevronRight size={18} />
                </button>

              </div>
            </div>

          </div>

          {/* Contact Details Grid Box underneath */}
          <div className="contact-details-wrapper">
            
            {/* Left description column */}
            <div className="details-left-side">
              <h2 className="details-main-title">Contact Details</h2>
              <p className="details-sub-title">You can call us or contact us directly</p>
            </div>

            {/* Right details stack column */}
            <div className="details-cards-stack">
              
              {/* Card 1: Address */}
              <div className="details-pill-card">
                <div className="details-icon-avatar">
                  <MapPin size={20} color="#48BB78" />
                </div>
                <div className="details-texts-col">
                  <span className="details-card-lbl">Address</span>
                  <span className="details-card-val">Esc. 135 Cuesta Adan Grijalva, Elda Nav 11777</span>
                </div>
              </div>

              {/* Card 2: Email Us */}
              <div className="details-pill-card">
                <div className="details-icon-avatar">
                  <Inbox size={20} color="#48BB78" />
                </div>
                <div className="details-texts-col">
                  <span className="details-card-lbl">Email Us</span>
                  <span className="details-card-val">contact@econwise.com</span>
                </div>
              </div>

              {/* Card 3: Call Us */}
              <div className="details-pill-card">
                <div className="details-icon-avatar">
                  <Phone size={20} color="#48BB78" fill="#48BB78" />
                </div>
                <div className="details-texts-col">
                  <span className="details-card-lbl">Call Us</span>
                  <span className="details-card-val">+91 98765 43210</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW B-6: TERMS & CONDITIONS FULL PAGE VIEW */}
      {activeMenu === 'Terms' && (
        <div className="terms-page-wrapper fade-in">
          
          {/* Custom scenic high-resolution Terms & Conditions banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Terms & Conditions</h1>
          </div>

          {/* Centered Document container holding terms detail rows */}
          <div className="terms-document-box">
            
            <h2 className="terms-document-title">Terms and Condition</h2>

            <div className="terms-document-content">
              
              <h3 className="terms-section-header">OVERVIEW</h3>
              <p className="terms-text-p">
                The website is operated by TripinVilla. Throughout the site, the terms "we", "us" and "our" refer to TripinVilla. TripinVilla offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
              </p>
              <p className="terms-text-p">
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including additional terms and conditions and policies referenced here and/or available via hyperlink. These Terms of Service apply to all users of the site, including without limitation browsers, vendors, customers, merchants, and/or contributors of content.
              </p>
              <p className="terms-text-p">
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms are considered an offer, acceptance is expressly limited to these Terms.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                Any new features or tools added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms at any time on this page. We reserve the right to update, change, modify, or replace any part of these Terms by posting updates and/or changes on our website. It is your responsibility to check this page periodically for changes. Continued use of or access to the website following any changes constitutes acceptance of those changes.
              </p>

              <h3 className="terms-section-header">1 – ONLINE STORE TERMS</h3>
              <p className="terms-text-p">
                By agreeing to these Terms of Service, you represent that you are at least the age of majority and in good health in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
              </p>
              <p className="terms-text-p">
                You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
              </p>
              <p className="terms-text-p">
                You must not transmit any worms or viruses or any code of a destructive nature in the site.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                A breach or violation of any of the Terms will result in an immediate termination of your Services and you may be liable for legal consequences.
              </p>

              <h3 className="terms-section-header">2 – GENERAL CONDITIONS</h3>
              <p className="terms-text-p">
                We reserve the right to refuse service to anyone for any reason at any time.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                You understand that your content (not including credit card information), may be transferred encrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
              </p>

              <h3 className="terms-section-header">3 – ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h3>
              <p className="terms-text-p">
                TripinVilla is not responsible if information made available on this website is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete, or more timely sources of information. Any reliance on the material on this site is at your own risk.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                This website may contain certain historical information. Historical information is not necessarily current and is provided for your reference only. TripinVilla reserves the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site and review updated content regularly to stay informed of any modifications.
              </p>

              <h3 className="terms-section-header">4 – MODIFICATIONS TO SERVICE AND PRICES</h3>
              <p className="terms-text-p">
                Prices for our services and products are subject to change without notice. TripinVilla reserves the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                TripinVilla shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service. We continuously strive to improve our services and may introduce, remove, or modify features based on operational, technical, or business requirements.
              </p>

              <h3 className="terms-section-header">6 – BILLING AND ACCOUNT INFORMATION</h3>
              <p className="terms-text-p">
                TripinVilla reserves the right to refuse any order you place with us. We may limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed under the same customer account, credit card, and/or orders that use the same billing and/or shipping address.
              </p>
              <p className="terms-text-p">
                You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and payment details, so that we can complete your transactions and contact you as needed.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* VIEW B-7: RECOMMENDED BY US FULL PAGE VIEW */}
      {activeMenu === 'Recommend By Us' && (
        <div className="recommend-page-wrapper fade-in">
          
          {/* Custom scenic high-resolution swimming pool resort twilight banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Recommended By Us</h1>
          </div>

          {/* Centered Recommendations page content wrapper */}
          <div className="recommend-main-container">
            
            {/* Header row with description and filter buttons */}
            <div className="recommend-header-row">
              <div className="recommend-header-left">
                <h2 className="recommend-header-title">Our Recommendations</h2>
                <p className="recommend-header-sub">Keep track of destinations and villas you love. Access them anytime and make your travel planning simple.</p>
              </div>
              <button className="recommend-filter-btn" onClick={() => alert('Filtering options are coming soon!')}>
                <div className="filter-icon-circle-green">
                  <Sliders size={16} color="#FFFFFF" />
                </div>
                <span>Filters</span>
              </button>
            </div>

            {/* Recommendations Grid layout */}
            <div className="recommend-cards-grid">
              {[
                {
                  id: 0,
                  name: "Aparahotel Stare Miasto",
                  location: "Kasol, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 1,
                  name: "Elysian Alpine Retreat",
                  location: "Manali, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 2,
                  name: "Stellar Ridge Villa",
                  location: "Shimla, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 3,
                  name: "Grand Castle Heritage Homestay",
                  location: "Kasol, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 4,
                  name: "Infinity Blue Ocean Villa",
                  location: "Goa Beachsides, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 5,
                  name: "Cloud-Nine Horizon Cottage",
                  location: "Munnar Hills, Kerala, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80"
                }
              ].map((item) => {
                const isLiked = recWishlist.includes(item.id);
                return (
                  <div key={item.id} className="recommend-property-card">
                    
                    {/* Top frame with custom image overlay */}
                    <div className="recommend-card-img-wrap">
                      <img src={item.img} alt={item.name} />
                      
                      {/* Heart wishlist circular toggle */}
                      <button 
                        className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLiked) {
                            setRecWishlist(recWishlist.filter(id => id !== item.id));
                          } else {
                            setRecWishlist([...recWishlist, item.id]);
                          }
                        }}
                      >
                        <Heart size={16} fill={isLiked ? "#EF4444" : "none"} color={isLiked ? "#EF4444" : "#FFFFFF"} />
                      </button>
                    </div>

                    {/* Specifications detail text */}
                    <div className="recommend-card-info-col">
                      <h4 className="recommend-card-name-text">{item.name}</h4>
                      
                      <div className="recommend-card-location-row">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{item.location}</span>
                      </div>

                      {/* Asymmetric 2x2 Specifications Grid */}
                      <div className="recommend-specs-2x2-grid">
                        <div className="recommend-spec-pill">
                          <Maximize size={12} color="#6B7280" />
                          <span>Area Size: {item.area}</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <Bed size={12} color="#6B7280" />
                          <span>Beds: {item.beds}</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <Home size={12} color="#6B7280" />
                          <span>Rooms: {item.rooms}</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <Users size={12} color="#6B7280" />
                          <span>Guests: {item.guests}</span>
                        </div>
                      </div>

                      {/* Starting Price in corporate green */}
                      <div className="recommend-price-tag-row">
                        <span>Starting from </span>
                        <span className="price-green-bold">₹{item.price}/night</span>
                      </div>

                      {/* Dynamic Button Action Groups */}
                      <div className="recommend-actions-row">
                        <button className="recommend-details-btn-blue" onClick={() => {
                          // Setup detail page simulation
                          setSelectedVilla({
                            title: item.name,
                            location: item.location,
                            rating: 4.8,
                            reviewsCount: 36,
                            pricePerNight: parseInt(item.price),
                            verified: true,
                            image: item.img,
                            images: [
                              item.img,
                              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
                              "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80"
                            ],
                            specs: {
                              area: item.area,
                              beds: item.beds,
                              rooms: item.rooms,
                              guests: item.guests
                            }
                          });
                          setActiveMenu('Detail');
                        }}>
                          View Details
                        </button>
                        
                        <button className="recommend-owner-btn-green" onClick={() => alert(`Connecting with the owner of "${item.name}"... Our corporate desk is transferring your request.`)}>
                          Contact Owner
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* VIEW B-8: LIST YOUR PLACE FULL PAGE VIEW */}
      {activeMenu === 'List Your Place' && (
        <div className="list-property-page-wrapper fade-in">
          
          {/* High-resolution hotel bedroom banner with centered button */}
          <div className="dashboard-hero-banner list-hero-custom" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80')` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>List Your Property</h1>
            
            <button className="btn-hero-green" onClick={() => alert('Launching partner sign-up wizard... Our agent will get in touch with you!')}>
              List Property
            </button>
          </div>

          {/* Centered Steps Container: "All You Have To Do" */}
          <div className="list-steps-container">
            
            <div className="list-section-title-wrap">
              <h2 className="list-section-headline">
                All You Have <span className="highlight-sharp-blue-box">To Do</span>
              </h2>
              <p className="list-section-subline">Do The Following Steps To List Your Property With Us</p>
            </div>

            <div className="list-four-steps-grid">
              
              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <UserRound size={20} color="#48BB78" />
                </div>
                <p className="list-step-card-text">
                  Sign In Or Sign Up As A Property Owner
                </p>
              </div>

              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <UploadCloud size={20} color="#48BB78" />
                </div>
                <p className="list-step-card-text">
                  Upload Your Property Details And Photos
                </p>
              </div>

              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <DollarSign size={20} color="#48BB78" />
                </div>
                <p className="list-step-card-text">
                  Set Your Prices And Available Dates
                </p>
              </div>

              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <CheckCircle size={20} color="#48BB78" />
                </div>
                <p className="list-step-card-text">
                  See Your Property Go Live In Front Of Millions Of Travelers
                </p>
              </div>

            </div>

          </div>

          {/* Reused "Why Choose Our Services" Section Container */}
          <div className="services-section">
            <div className="services-inner-container">
              
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  Why Choose Our <span className="highlight-sharp-blue-box">Services</span>
                </h2>
                <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                  Choose the next destination for you
                </p>
              </div>

              {/* Asymmetric custom grid row */}
              <div className="services-grid-asym">
                
                {/* Column 1 */}
                <div className="services-col">
                  
                  {/* White card top */}
                  <div className="service-text-card white-bg">
                    <p className="service-card-desc">
                      Every property is carefully verified to ensure quality, safety, and comfort you can rely on.
                    </p>
                    <h3 className="service-card-accent-title">Verified & Trusted Stays</h3>
                    <p className="service-card-subtext">Get genuine and good stays</p>
                  </div>

                  {/* Secure Payments bottom image */}
                  <div className="service-image-card">
                    <img 
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" 
                      alt="Secure Payments" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <CreditCard size={18} color="#FFFFFF" />
                      </div>
                      <span>Secure Payments</span>
                    </div>
                  </div>

                </div>

                {/* Column 2 (Full Height Traveler center image) */}
                <div className="services-col-center">
                  <div className="service-tall-card">
                    <img 
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" 
                      alt="Traveler with suitcase" 
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="services-col">
                  
                  {/* Pool Resort top image */}
                  <div className="service-image-card">
                    <img 
                      src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" 
                      alt="Best Price Guarantee Pool" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <Percent size={18} color="#FFFFFF" />
                      </div>
                      <span>Best Price Guarantee</span>
                    </div>
                  </div>

                  {/* 24/7 Support text card bottom */}
                  <div className="service-text-card transparent-bg">
                    <h3 className="service-card-accent-title">24/7 Support, Always There</h3>
                    <p className="service-card-bold-sub">All type of support</p>
                    <p className="service-card-desc-light">
                      From booking to checkout, our support team is available anytime to help you.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Collapsible FAQ Accordion Section */}
          <div className="list-faq-container">
            
            <div className="list-section-title-wrap">
              <h2 className="list-section-headline">
                Frequently Asked <span className="highlight-sharp-blue-box">Questions</span>
              </h2>
              <p className="list-section-subline">You Can Ask Anything You Want</p>
            </div>

            <div className="faq-accordion-stack">
              {[
                {
                  q: "How can I enquire about a villa?",
                  a: "You can submit your enquiry through our online enquiry form available on each villa detail page. Simply provide your name, contact details, preferred dates, and requirements – our team will get back to you shortly."
                },
                {
                  q: "Is there any fee to submit an enquiry?",
                  a: "No, submitting an enquiry is completely free. You will only pay when you finalize and book a property."
                },
                {
                  q: "How soon will I receive a response?",
                  a: "Our travel experts typically respond within 2 to 4 hours during business days."
                },
                {
                  q: "Can I schedule a site visit before booking?",
                  a: "Yes, we can organize virtual or physical site visits for long-term villa rentals upon request."
                },
                {
                  q: "Are the villas available for short-term stays?",
                  a: "Absolutely! We support both short-term weekend getaways and long-term stays."
                },
                {
                  q: "What amenities are included in the villa?",
                  a: "Most of our villas include high-speed Wi-Fi, fully equipped kitchens, private pools, housekeepers, and gated security."
                }
              ].map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className={`faq-accordion-item ${isOpen ? 'expanded' : ''}`} onClick={() => setActiveFaq(isOpen ? null : idx)}>
                    
                    {/* Header Row */}
                    <div className="faq-header-trigger">
                      <div className="faq-question-col">
                        <div className="faq-badge-num">{idx + 1}</div>
                        <span className="faq-question-text">{faq.q}</span>
                      </div>
                      <ChevronDown size={18} className={`faq-arrow-indicator ${isOpen ? 'rotated' : ''}`} />
                    </div>

                    {/* Collapsible Content */}
                    <div className="faq-content-slider">
                      <p className="faq-answer-text">{faq.a}</p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* VIEW C: PROPERTY DETAILS PAGE VIEW */}
      {activeMenu === 'Detail' && (
        <div className="detail-page-wrapper fade-in">
          

          {/* Breadcrumb row */}
          <div className="breadcrumb-row">
            <span onClick={() => setActiveMenu('Home')}>Home</span>
            <span className="bread-sep">/</span>
            <span onClick={() => setActiveMenu('Properties')}>Properties</span>
            <span className="bread-sep">/</span>
            <span className="bread-active">Property Details</span>
          </div>

          {/* Triple Image and Info Box Main row */}
          <div className="detail-primary-grid">
            
            {/* Left Image grid */}
            <div className="detail-image-gallery">
              <div className="gallery-master-img">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" alt="Master mountain villa" />
              </div>
              <div className="gallery-sub-images">
                <div className="sub-img-wrap">
                  <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80" alt="Villa bedroom" />
                </div>
                <div className="sub-img-wrap overlay">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" alt="Villa bathtub" />
                  <div className="gallery-count-layer">
                    <span>View 122 more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Information Reservation Box */}
            <div className="detail-reservation-card">
              <h2 className="reservation-title">Aparthotel Stare Miasto, Deluxe</h2>
              
              <div className="reservation-location">
                <MapPin size={14} color="#48BB78" />
                <span>Kasol, Himachal Pradesh, India</span>
              </div>

              <div className="reservation-timing-row">
                <div className="time-badge">
                  <span>Check In : 3:00 PM</span>
                </div>
                <div className="time-badge">
                  <span>Check Out : 12:00 PM</span>
                </div>
              </div>

              <div className="reservation-checks-list">
                <div className="check-bullet">
                  <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                  <span>Breakfast Included</span>
                </div>
                <div className="check-bullet">
                  <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                  <span>Free cancellation till 24 hrs before check</span>
                </div>
                <div className="check-bullet">
                  <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                  <span>Parking Available</span>
                </div>
              </div>

              <div className="reservation-pricing-block">
                <span className="old-strike-price">₹2140/night</span>
                <span className="taxes-subtext">+212 taxes & fees per room per night</span>
                <div style={{ marginTop: '4px' }}>
                  <span className="highlight-green-detail">₹1,400/night</span>
                  <span className="room-per-night-label"> room per night</span>
                </div>
              </div>

              {hostContactRevealed ? (
                <button className="btn-view-contact-green revealed-active" style={{ background: '#38A169', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}>
                  <Phone size={16} fill="#FFFFFF" />
                  <span style={{ fontWeight: '700' }}>+91 98765 43210</span>
                </button>
              ) : (
                <button className="btn-view-contact-green" onClick={() => { setContactStep(1); setContactModalOpen(true); }}>
                  <Phone size={16} fill="#FFFFFF" />
                  <span>View Contact Number</span>
                </button>
              )}

            </div>

          </div>

          {/* About Property statement */}
          <div className="about-property-section">
            <h3 className="section-subtitle-title">About Property</h3>
            <p className="about-property-text">
              Experience a comfortable and refined stay at Azure Bay Hotel, located in the heart of the city and designed for both leisure and business travelers. The hotel offers thoughtfully designed rooms, modern amenities, and warm hospitality to ensure a relaxing and memorable stay. With easy access to popular attractions, dining spots, and transport hubs, Azure Bay Hotel is an ideal choice for a seamless travel. <span className="read-more-link">Read More</span>
            </p>
          </div>

          {/* Amenities Row */}
          <div className="about-property-section">
            <h3 className="section-subtitle-title">Amenities</h3>
            <div className="amenities-horizontal-pills">
              <div className="amenity-pill-item">
                <Maximize size={15} color="#48BB78" />
                <div className="pill-texts">
                  <span className="pill-lbl">Area Size</span>
                  <span className="pill-val green-text">31 sq. ft.</span>
                </div>
              </div>
              <div className="amenity-pill-item">
                <DoorClosed size={15} color="#48BB78" />
                <div className="pill-texts">
                  <span className="pill-lbl">Rooms</span>
                  <span className="pill-val green-text">1 Room</span>
                </div>
              </div>
              <div className="amenity-pill-item">
                <Bed size={15} color="#48BB78" />
                <div className="pill-texts">
                  <span className="pill-lbl">Beds</span>
                  <span className="pill-val green-text">2 Beds</span>
                </div>
              </div>
              <div className="amenity-pill-item">
                <Users size={15} color="#48BB78" />
                <div className="pill-texts">
                  <span className="pill-lbl">Guests</span>
                  <span className="pill-val green-text">3 Person</span>
                </div>
              </div>
              <div className="amenity-pill-item">
                <Utensils size={15} color="#48BB78" />
                <div className="pill-texts">
                  <span className="pill-lbl">Barbeque</span>
                  <span className="pill-val green-text">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Anchor Tabs Row */}
          <div className="detail-sub-navigation-tabs">
            {detailSubTabs.map((tab) => (
              <button
                key={tab}
                className={`detail-sub-nav-btn ${activeDetailTab === tab ? 'active' : ''}`}
                onClick={() => setActiveDetailTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ROOMS LIST SECTION */}
          <div className="detail-tab-target-section border-box-style">
            <h3 className="section-subtitle-title" style={{ marginBottom: '24px' }}>Rooms</h3>
            <div className="rooms-stack">
              {roomOptions.map((room, idx) => (
                <div key={idx} className="room-vertical-card">
                  <div className="room-card-img-wrap">
                    <img src={room.img} alt={room.title} />
                  </div>
                  <div className="room-card-info-wrap">
                    <div className="room-card-mid-col">
                      <h4 className="room-card-title">{room.title}</h4>
                      
                      <div className="room-card-bullets-list">
                        {room.features.map((feat, fIdx) => (
                          <div key={fIdx} className="bullet-check">
                            <CheckCircle size={14} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="room-card-traits-grid">
                        <div className="trait-lbl-item">
                          <Bed size={12} color="#8A99AD" />
                          <span>Beds: {room.beds}</span>
                        </div>
                        <div className="trait-lbl-item">
                          <DoorClosed size={12} color="#8A99AD" />
                          <span>Rooms: {room.rooms}</span>
                        </div>
                        <div className="trait-lbl-item">
                          <Users size={12} color="#8A99AD" />
                          <span>Guests: {room.guests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="room-card-pricing-col">
                      <span className="room-taxes-label">+212 taxes & fees per room per night</span>
                      <span className="room-old-strike">₹2140/night</span>
                      <span className="room-green-val">₹1,400/night</span>
                      
                      {hostContactRevealed ? (
                        <button className="btn-view-contact-green revealed-active" style={{ width: '100%', marginTop: '10px', background: '#38A169', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}>
                          <Phone size={14} fill="#FFFFFF" />
                          <span style={{ fontWeight: '700' }}>+91 98765 43210</span>
                        </button>
                      ) : (
                        <button className="btn-view-contact-green" style={{ width: '100%', marginTop: '10px' }} onClick={() => { setContactStep(1); setContactModalOpen(true); }}>
                          <Phone size={14} fill="#FFFFFF" />
                          <span>View Contact Number</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOCATION AND LANDMARKS SECTION */}
          <div className="detail-tab-target-section border-box-style">
            <div className="map-landmarks-split">
              {/* Left Mock Map Graphic */}
              <div className="mock-map-graphic">
                <div className="map-badge-point">
                  <span>Gor</span>
                </div>
                <div className="map-badge-point active" style={{ left: '60%', top: '30%' }}>
                  <span>Hee-Gyathang</span>
                </div>
                <div className="map-badge-point" style={{ left: '30%', top: '70%' }}>
                  <span>Dikchu View Point</span>
                </div>
              </div>

              {/* Right Landmarks List */}
              <div className="landmarks-sidebar">
                <h3 className="section-subtitle-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Key Landmarks</h3>
                <div className="landmarks-stack">
                  {landmarks.map((mark, idx) => (
                    <div key={idx} className="landmark-row-item">
                      <div className="landmark-avatar-circle">
                        <MapPin size={14} color="var(--primary-blue)" />
                      </div>
                      <div className="landmark-texts">
                        <span className="landmark-title-name">{mark.name}</span>
                        <span className="landmark-badge-desc">{mark.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PROPERTY RULES SECTION */}
          <div className="detail-tab-target-section border-box-style">
            <h3 className="section-subtitle-title" style={{ marginBottom: '20px' }}>Property Rules</h3>
            <div className="rules-timings-grid">
              <div className="time-badge">
                <span>Check In : 3:00 PM</span>
              </div>
              <div className="time-badge">
                <span>Check Out : 12:00 PM</span>
              </div>
            </div>

            <div className="must-read-rules-block">
              <h4 className="rules-sub-hdr">Must Read Rules</h4>
              <ul className="rules-ul-list">
                <li>Primary Guest should be atleast 18 years of age.</li>
                <li>Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).</li>
              </ul>
            </div>

            <div className="must-read-rules-block" style={{ marginTop: '24px' }}>
              <h4 className="rules-sub-hdr">Smoking/Alcohol consumption Rules</h4>
              <ul className="rules-ul-list">
                <li>There are no restrictions on alcohol consumption.</li>
                <li>Smoking is allowed only in outdoor areas, such as balconies, lawns, or designated smoking zones. It is strictly prohibited inside the room.</li>
              </ul>
            </div>
          </div>

          {/* USER REVIEWS SECTION */}
          <div className="detail-tab-target-section border-box-style" style={{ marginBottom: '80px' }}>
            <h3 className="section-subtitle-title" style={{ marginBottom: '24px' }}>User Reviews</h3>
            <div className="reviews-layout-split">
              
              {/* Left Score Card */}
              <div className="reviews-score-card">
                <div className="score-top-row">
                  <div className="score-pill-large">
                    <span>4.8</span>
                  </div>
                  <div className="score-lbl-wrap">
                    <span className="score-main-lbl">Excellent</span>
                    <span className="score-sub-lbl">3,245 Genuine Reviews</span>
                  </div>
                </div>

                <div className="rating-progress-stack" style={{ margin: '24px 0' }}>
                  <div className="progress-row">
                    <span>Excellent</span>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '70%' }} /></div>
                    <span>70%</span>
                  </div>
                  <div className="progress-row">
                    <span>Very Good</span>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '50%' }} /></div>
                    <span>50%</span>
                  </div>
                  <div className="progress-row">
                    <span>Average</span>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '24%' }} /></div>
                    <span>24%</span>
                  </div>
                  <div className="progress-row">
                    <span>Poor</span>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '1%' }} /></div>
                    <span>1%</span>
                  </div>
                </div>

                <button className="btn-share-experience" onClick={() => { setReviewRating(5); setReviewText(''); setReviewModalOpen(true); }}>
                  <Star size={15} fill="#FFFFFF" />
                  <span>Share Your Experience</span>
                </button>
              </div>

              {/* Right reviews stream */}
              <div className="reviews-stream-col">
                {userReviewsList.map((rev, idx) => (
                  <div key={idx} className="review-stream-item">
                    <div className="review-header-avatar">
                      <div className="user-avatar-thumb">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt={rev.name} />
                      </div>
                      <div className="review-user-info">
                        <span className="review-user-name">{rev.name}</span>
                        <span className="review-user-role">{rev.role}</span>
                      </div>
                    </div>

                    <p className="review-quote-text">
                      "{rev.text}"
                    </p>

                    <div className="review-star-rating-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill="var(--primary-blue)" color="var(--primary-blue)" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* VIEW D: PROPERTIES LIST PAGE VIEW */}
      {activeMenu === 'Properties' && (
        <div className="properties-page-layout fade-in">
          
          {/* Sub Categories Scroll selector */}
          <div className="properties-categories-scroller">
            <div className="properties-categories-inner">
              {propertyCategories.map((cat) => {
                const isSelected = activePropCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    className={`prop-cat-outline-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setActivePropCategory(cat.name)}
                  >
                    <span className="prop-cat-icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION A: Best Villas Around You */}
          <div className="villas-around-section" style={{ marginTop: '40px' }}>
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                Best <span className="highlight-sharp-blue-box">Villas</span> Around You
              </h2>
              <p className="section-sub-headline">
                Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.
              </p>
            </div>

            <div className="villas-grid">
              {propertiesVillasList.map((villa, idx) => (
                <div key={idx} className="villa-card">
                  <div className="villa-card-img-wrap">
                    <img src={villa.img} alt={villa.title} />
                    <button className="wishlist-btn-circle">
                      <Heart size={16} fill="none" color="#111827" />
                    </button>
                  </div>
                  
                  <div className="villa-card-content">
                    <h3 className="villa-card-title">{villa.title}</h3>
                    
                    <div className="villa-card-location">
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{villa.location}</span>
                    </div>

                    {/* 2x2 Custom Structural Grid */}
                    <div className="property-specs-grid-2x2">
                      <div className="prop-spec-item">
                        <Maximize size={12} color="#8A99AD" />
                        <span>Area Size: {villa.area}</span>
                      </div>
                      <div className="prop-spec-item">
                        <Bed size={12} color="#8A99AD" />
                        <span>Beds: {villa.beds}</span>
                      </div>
                      <div className="prop-spec-item">
                        <DoorClosed size={12} color="#8A99AD" />
                        <span>Rooms: {villa.rooms}</span>
                      </div>
                      <div className="prop-spec-item">
                        <Users size={12} color="#8A99AD" />
                        <span>Guests: {villa.guests}</span>
                      </div>
                    </div>

                    <div className="villa-card-price-row" style={{ marginTop: '4px' }}>
                      <span className="price-label">Starting from</span>
                      <span className="price-value-highlight">{villa.price}/night</span>
                    </div>

                    <div className="villa-card-actions">
                      <button className="btn-villa-action outline-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      <button className="btn-villa-action outline-green">Contact Owner</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-more-btn-container">
              <button className="btn-view-more">View More</button>
            </div>

          </div>

          {/* SECTION B: Best Homestays Around You */}
          <div className="villas-around-section" style={{ margin: '80px auto' }}>
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                Best <span className="highlight-sharp-blue-box">Homestays</span> Around You
              </h2>
              <p className="section-sub-headline">
                Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.
              </p>
            </div>

            <div className="villas-grid">
              {propertiesHomestaysList.map((homestay, idx) => (
                <div key={idx} className="villa-card">
                  <div className="villa-card-img-wrap">
                    <img src={homestay.img} alt={homestay.title} />
                    <button className="wishlist-btn-circle">
                      <Heart size={16} fill="none" color="#111827" />
                    </button>
                  </div>
                  
                  <div className="villa-card-content">
                    <h3 className="villa-card-title">{homestay.title}</h3>
                    
                    <div className="villa-card-location">
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{homestay.location}</span>
                    </div>

                    {/* 2x2 Custom Structural Grid */}
                    <div className="property-specs-grid-2x2">
                      <div className="prop-spec-item">
                        <Maximize size={12} color="#8A99AD" />
                        <span>Area Size: {homestay.area}</span>
                      </div>
                      <div className="prop-spec-item">
                        <Bed size={12} color="#8A99AD" />
                        <span>Beds: {homestay.beds}</span>
                      </div>
                      <div className="prop-spec-item">
                        <DoorClosed size={12} color="#8A99AD" />
                        <span>Rooms: {homestay.rooms}</span>
                      </div>
                      <div className="prop-spec-item">
                        <Users size={12} color="#8A99AD" />
                        <span>Guests: {homestay.guests}</span>
                      </div>
                    </div>

                    <div className="villa-card-price-row" style={{ marginTop: '4px' }}>
                      <span className="price-label">Starting from</span>
                      <span className="price-value-highlight">{homestay.price}/night</span>
                    </div>

                    <div className="villa-card-actions">
                      <button className="btn-villa-action outline-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      <button className="btn-villa-action outline-green">Contact Owner</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-more-btn-container">
              <button className="btn-view-more">View More</button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW E: HOME VIEW */}
      {activeMenu === 'Home' && (
        <>
          {/* ══ SECTION 1: DESTINATIONS CAROUSEL (Width 1281px, Height 465px) ══ */}
          <div className="destinations-carousel-section">
            
            {/* Toggle selectors inside Section 1 */}
            <div className="carousel-nav-pill">
              <button 
                className={`carousel-nav-btn ${activeDestTab === 'Destinations' ? 'active' : ''}`}
                onClick={() => setActiveDestTab('Destinations')}
              >
                Destinations
              </button>
              <button 
                className={`carousel-nav-btn ${activeDestTab === 'Unique' ? 'active' : ''}`}
                onClick={() => setActiveDestTab('Unique')}
              >
                Unique Experiences
              </button>
            </div>

            {/* Carousel Grid with Arrow buttons */}
            <div className="carousel-viewport">
              <button 
                className="carousel-arrow left"
                onClick={() => {
                  const track = document.querySelector('.carousel-track');
                  if (track) {
                    track.scrollBy({ left: -240, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="carousel-track">
                {carouselDestinations.map((dest, i) => (
                  <div key={i} className="carousel-card-item">
                    <div className="carousel-img-wrap">
                      <img src={dest.img} alt={dest.name} />
                    </div>
                    <h3 className="carousel-city-title">{dest.name}</h3>
                    <p className="carousel-city-sub">{dest.count}</p>
                  </div>
                ))}
              </div>

              <button 
                className="carousel-arrow right"
                onClick={() => {
                  const track = document.querySelector('.carousel-track');
                  if (track) {
                    track.scrollBy({ left: 240, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 2: BEST VILLAS AROUND YOU (Figma Specifications) ══ */}
          <div className="villas-around-section">
            
            {/* Keyword-highlighted headline block */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                Best <span className="highlight-sharp-blue-box">Villas</span> Around You
              </h2>
              <p className="section-sub-headline">
                Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.
              </p>
            </div>

            {/* 3-column Grid layout */}
            <div className="villas-grid">
              {bestVillasList.map((villa, idx) => (
                <div key={idx} className="villa-card">
                  <div className="villa-card-img-wrap">
                    <img src={villa.img} alt={villa.title} />
                    <button className="wishlist-btn-circle">
                      <Heart size={16} fill="none" color="#111827" />
                    </button>
                  </div>
                  
                  <div className="villa-card-content">
                    <h3 className="villa-card-title">{villa.title}</h3>
                    
                    <div className="villa-card-location">
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{villa.location}</span>
                    </div>

                    <div className="villa-card-rating-row">
                      <div className="rating-pill">
                        <span>{villa.rating}</span>
                      </div>
                      <div className="rating-text-stack">
                        <span className="rating-desc-excellent">Excellent</span>
                        <span className="rating-reviews-count">{villa.reviews}</span>
                      </div>
                    </div>

                    <div className="villa-card-price-row">
                      <span className="price-label">Starting from</span>
                      <span className="price-value-highlight">{villa.price}/night</span>
                    </div>

                    <div className="villa-card-actions">
                      <button className="btn-villa-action outline-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      <button className="btn-villa-action outline-green">Contact Owner</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ══ SECTION 3: CURATED PROPERTIES ══ */}
          <div className="curated-properties-section">
            
            {/* Title layout block */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                <span className="highlight-sharp-blue-box">Curated</span> Properties
              </h2>
              <p className="section-sub-headline">
                Carefully selected stays that meet our standards for comfort, quality, and location.
              </p>
            </div>

            {/* Horizontal Card pairs inside a scroll viewport */}
            <div className="curated-viewport">
              <button 
                className="curated-arrow left"
                onClick={() => {
                  const track = document.querySelector('.curated-horizontal-grid');
                  if (track) {
                    track.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="curated-horizontal-grid">
                {curatedList.map((item, idx) => (
                  <div key={idx} className="curated-horizontal-card">
                    <div className="curated-card-img-wrap">
                      <img src={item.img} alt={item.title} />
                      <button className="wishlist-btn-circle">
                        <Heart size={16} fill="none" color="#111827" />
                      </button>
                    </div>

                    <div className="curated-card-content">
                      <h3 className="curated-card-title">{item.title}</h3>
                      
                      <div className="curated-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{item.location}</span>
                      </div>

                      <div className="curated-card-rating-row">
                        <div className="rating-pill">
                          <span>{item.rating}</span>
                        </div>
                        <div className="rating-text-stack">
                          <span className="rating-desc-excellent">Excellent</span>
                          <span className="rating-reviews-count">{item.reviews}</span>
                        </div>
                      </div>

                      <div className="curated-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-value-highlight">{item.price}/night</span>
                      </div>

                      <div className="curated-card-actions">
                        <button className="btn-villa-action outline-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="curated-arrow right"
                onClick={() => {
                  const track = document.querySelector('.curated-horizontal-grid');
                  if (track) {
                    track.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 4: POPULAR OFFERS OF PROPERTY ══ */}
          <div className="popular-offers-section">
            
            {/* Title Layout */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                <span className="highlight-sharp-blue-box">Popular</span> Offers Of Property
              </h2>
              <p className="section-sub-headline">
                Carefully selected stays that meet our standards for comfort, quality, and location.
              </p>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="popular-offers-grid">
              {popularOffersList.map((offer, idx) => (
                <div key={idx} className="offer-horizontal-card">
                  <div className="offer-card-img-wrap">
                    <img src={offer.img} alt={offer.title} />
                    {(idx === 0 || idx === 3) && (
                      <span className="exclusive-offer-badge">Exclusive Offer</span>
                    )}
                  </div>

                  <div className="offer-card-content">
                    <h3 className="offer-card-title">{offer.title}</h3>
                    <p className="offer-card-subtitle">{offer.subtitle}</p>
                    
                    <div className="offer-card-discount-row">
                      <span className="discount-label">Up to</span>
                      <span className="discount-value-highlight">30% OFF</span>
                    </div>

                    <div className="offer-card-actions">
                      <button className="btn-villa-action outline-blue" style={{ width: '136px' }} onClick={() => setActiveMenu('Detail')}>View Stays</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ══ SECTION 5: WHY CHOOSE OUR SERVICES ══ */}
          <div className="services-section">
            <div className="services-inner-container">
              
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  Why Choose Our <span className="highlight-sharp-blue-box">Services</span>
                </h2>
                <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                  Choose the next destination for you
                </p>
              </div>

              {/* Asymmetric custom grid row */}
              <div className="services-grid-asym">
                
                {/* Column 1 */}
                <div className="services-col">
                  
                  {/* White card top */}
                  <div className="service-text-card white-bg">
                    <p className="service-card-desc">
                      Every property is carefully verified to ensure quality, safety, and comfort you can rely on.
                    </p>
                    <div className="service-card-bottom-group">
                      <h3 className="service-card-accent-title">Verified & Trusted Stays</h3>
                      <p className="service-card-subtext">Get genuine and good stays</p>
                    </div>
                  </div>

                  {/* Secure Payments bottom image */}
                  <div className="service-image-card">
                    <img 
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" 
                      alt="Secure Payments" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <CreditCard size={18} color="#FFFFFF" />
                      </div>
                      <span>Secure Payments</span>
                    </div>
                  </div>

                </div>

                {/* Column 2 (Full Height Traveler center image) */}
                <div className="services-col-center">
                  <div className="service-tall-card">
                    <img 
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" 
                      alt="Traveler with suitcase" 
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="services-col">
                  
                  {/* Pool Resort top image */}
                  <div className="service-image-card">
                    <img 
                      src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" 
                      alt="Best Price Guarantee Pool" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <Percent size={18} color="#FFFFFF" />
                      </div>
                      <span>Best Price Guarantee</span>
                    </div>
                  </div>

                  {/* 24/7 Support text card bottom */}
                  <div className="service-text-card transparent-bg">
                    <h3 className="service-card-accent-title">24/7 Support, Always There</h3>
                    <p className="service-card-bold-sub">All type of support</p>
                    <p className="service-card-desc-light">
                      From booking to checkout, our support team is available anytime to help you.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </>
      )}

      {/* ══ SECTION 6: PREMIUM SITE FOOTER ══ */}
      <footer className="site-footer">
        
        {/* Semi-transparent dark background cover */}
        <div className="site-footer-overlay">
          
          {/* Logo with house outline icon */}
          <div className="footer-logo-row">
            <span className="footer-logo-text">Tripin villa</span>
            <div className="footer-logo-house-outline">
              <div className="house-roof"></div>
              <div className="house-body"></div>
            </div>
          </div>

          {/* Description statement */}
          <p className="footer-intro-desc">
            We help travelers discover comfortable, trusted, and affordable stays across India. From cozy homestays and private villas to modern apartments and resorts, our platform brings together verified properties to suit every travel style
          </p>

          {/* Nav Divider 1 */}
          <div className="footer-line-divider" />

          {/* Footer centered navigation row */}
          <div className="footer-nav-row">
            <a href="#home" onClick={() => setActiveMenu('Home')}>Home</a>
            <div className="footer-vertical-divider" />
            <a href="#properties" onClick={() => setActiveMenu('Properties')}>Properties</a>
            <div className="footer-vertical-divider" />
            <a href="#wishlist" onClick={() => setActiveMenu('Wishlist')}>Wishlist</a>
            <div className="footer-vertical-divider" />
            <a href="#bookings" onClick={() => setActiveMenu('Profile')}>My Bookings</a>
            <div className="footer-vertical-divider" />
            <a href="#about" onClick={() => setActiveMenu('About Us')}>About Us</a>
            <div className="footer-vertical-divider" />
            <a href="#contact" onClick={() => setActiveMenu('Contact')}>Contact Us</a>
          </div>

          {/* Nav Divider 2 */}
          <div className="footer-line-divider" />

          {/* Copyright line */}
          <p className="footer-copyright-text">
            © Tripinvilla.com all rights reserved
          </p>

        </div>

      </footer>
    </div>

      {/* ══ INTERACTIVE AUTHENTICATION MODAL (Figma-Accurate Sign Up / Log In Views) ══ */}
      {authModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setAuthModalOpen(false)}>
          <div className={`auth-modal-card ${authMode === 'login' ? 'login-split-card' : ''}`} onClick={(e) => e.stopPropagation()}>
            
            {authMode === 'signup' ? (
              <div className="auth-signup-content fade-in">
                {/* Close Button */}
                <button className="auth-close-btn" onClick={() => setAuthModalOpen(false)}>&times;</button>
                
                <h2 className="auth-modal-title">
                  Sign Up To Find Your <span className="highlight-sharp-blue-box">Perfect Stay</span>
                </h2>
                
                <form onSubmit={(e) => { e.preventDefault(); alert('Sign up successful! Account Rohan created.'); setAuthModalOpen(false); }} className="auth-signup-form">
                  <div className="auth-form-grid-3x3">
                    <div className="auth-form-group">
                      <label className="auth-input-label">First Name*</label>
                      <input type="text" className="auth-input-field" placeholder="Rohan" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Last Name*</label>
                      <input type="text" className="auth-input-field" placeholder="Sharma" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Country of Citizenship*</label>
                      <input type="text" className="auth-input-field" placeholder="India" defaultValue="India" required />
                    </div>
                    
                    <div className="auth-form-group">
                      <label className="auth-input-label">Email Address*</label>
                      <input type="email" className="auth-input-field" placeholder="jhondoe@gmail.com" defaultValue="jhondoe@gmail.com" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Phone Number*</label>
                      <input type="tel" className="auth-input-field" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Country of Residence*</label>
                      <input type="text" className="auth-input-field" placeholder="India" defaultValue="India" required />
                    </div>
                    
                    <div className="auth-form-group">
                      <label className="auth-input-label">Address*</label>
                      <input type="text" className="auth-input-field" placeholder="Flat No. 302, Green Apartments" defaultValue="Flat No. 302, Green Apartments" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Pin Code*</label>
                      <input type="text" className="auth-input-field" placeholder="560102" defaultValue="560102" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">State*</label>
                      <input type="text" className="auth-input-field" placeholder="Karnataka" defaultValue="Karnataka" required />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn-green">Continue</button>
                </form>

                {/* Dashed divider */}
                <div className="auth-divider-wrap">
                  <span className="auth-divider-text">Or Log In with</span>
                </div>

                {/* Green circle social items */}
                <div className="auth-social-row">
                  <button className="auth-social-circle-green" onClick={() => { alert('Authenticating with Google...'); setAuthModalOpen(false); }}>G</button>
                  <button className="auth-social-circle-green" onClick={() => { alert('Authenticating with Facebook...'); setAuthModalOpen(false); }}>f</button>
                </div>

                <div className="auth-footer-links">
                  <p className="auth-switch-text">
                    Already have an account? <span className="auth-link-green" onClick={() => setAuthMode('login')}>Log In</span>
                  </p>
                  <p className="auth-switch-text">
                    <span className="auth-link-owner" onClick={() => { alert('Redirecting to Owner Portal...'); setAuthModalOpen(false); }}>Log In as a Property Owner</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="auth-login-split-container fade-in">
                {/* Close Button */}
                <button className="auth-close-btn" onClick={() => setAuthModalOpen(false)}>&times;</button>
                
                {/* Left side scenic Sunset pool image */}
                <div className="auth-login-left-image" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80')` }}>
                  <div className="auth-left-inner-box">
                    <div className="auth-left-logo-row">
                      <span className="auth-left-logo-main">Tripinstays</span>
                      <span className="auth-left-logo-sub">STAY, EXPLORE, RELAX</span>
                    </div>
                    <p className="auth-left-tagline">Sign Up to get</p>
                    <h3 className="auth-left-headline">Best Hotels<br />and Villas</h3>
                  </div>
                </div>

                {/* Right side Log In form fields */}
                <div className="auth-login-right-content">
                  <h2 className="auth-modal-title login-title-align">
                    Log In Your Account To Find Your <span className="highlight-sharp-blue-box">Perfect Stay</span>
                  </h2>
                  
                  <form onSubmit={(e) => { e.preventDefault(); alert('Login successful! Welcome Rohan Sharma.'); setAuthModalOpen(false); }} className="auth-login-form">
                    <div className="auth-form-group full-width">
                      <label className="auth-input-label">Email Id or Mobile Number*</label>
                      <input type="text" className="auth-input-field" placeholder="jhondoe@gmail.com" defaultValue="jhondoe@gmail.com" required />
                    </div>

                    <button type="submit" className="auth-submit-btn-green mt-24">Continue</button>
                  </form>

                  {/* Divider */}
                  <div className="auth-divider-wrap">
                    <span className="auth-divider-text">Or Sign In with</span>
                  </div>

                  {/* Green circle social items */}
                  <div className="auth-social-row">
                    <button className="auth-social-circle-green" onClick={() => { alert('Authenticating with Google...'); setAuthModalOpen(false); }}>G</button>
                    <button className="auth-social-circle-green" onClick={() => { alert('Authenticating with Facebook...'); setAuthModalOpen(false); }}>f</button>
                  </div>

                  <div className="auth-footer-links">
                    <p className="auth-switch-text">
                      Don't have an account? <span className="auth-link-green" onClick={() => setAuthMode('signup')}>Sign Up</span>
                    </p>
                    <p className="auth-switch-text">
                      <span className="auth-link-owner" onClick={() => { alert('Redirecting to Owner Portal...'); setAuthModalOpen(false); }}>Log in as a Property Owner</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ══ INTERACTIVE CONTACT DETAIL VERIFICATION MODAL (Figma-Accurate View Contact & Request OTP) ══ */}
      {contactModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setContactModalOpen(false)}>
          <div className="auth-modal-card contact-modal-card-size" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close-btn" onClick={() => setContactModalOpen(false)}>&times;</button>
            
            {contactStep === 1 ? (
              <div className="contact-form-content fade-in">
                <h2 className="auth-modal-title">
                  View Contact <span className="highlight-sharp-blue-box">Number</span>
                </h2>
                
                <form onSubmit={(e) => { e.preventDefault(); setContactStep(2); }} className="contact-info-form">
                  <div className="contact-form-grid-2x2">
                    <div className="auth-form-group">
                      <label className="auth-input-label">First Name*</label>
                      <input type="text" className="auth-input-field" placeholder="Rohan" defaultValue="Rohan" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Last Name*</label>
                      <input type="text" className="auth-input-field" placeholder="Sharma" defaultValue="Sharma" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Email Address*</label>
                      <input type="email" className="auth-input-field" placeholder="jhondoe@gmail.com" defaultValue="jhondoe@gmail.com" required />
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-input-label">Phone Number*</label>
                      <input type="tel" className="auth-input-field" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" required />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn-green mt-36">Verify & View Contact Number</button>
                </form>
              </div>
            ) : (
              <div className="contact-otp-content fade-in">
                <h2 className="auth-modal-title">
                  Request Contact <span className="highlight-sharp-blue-box">Number</span>
                </h2>
                
                <p className="otp-sub-banner-text">
                  We've sent a 6-digit code to <strong>+91 98765 43210</strong>
                </p>
                
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  setHostContactRevealed(true); 
                  setContactModalOpen(false); 
                  alert('Verification successful! Host contact number is now displayed on the page.'); 
                }} className="contact-otp-form">
                  
                  <div className="otp-digit-inputs-row">
                    {contactOTP.map((val, idx) => (
                      <input 
                        key={idx}
                        type="text"
                        maxLength="1"
                        className="otp-digit-box"
                        placeholder="-"
                        value={val}
                        id={`otp-box-${idx}`}
                        onChange={(e) => {
                          const value = e.target.value;
                          const newOTP = [...contactOTP];
                          newOTP[idx] = value;
                          setContactOTP(newOTP);
                          
                          // Auto focus next box
                          if (value && idx < 5) {
                            const nextBox = document.getElementById(`otp-box-${idx + 1}`);
                            if (nextBox) nextBox.focus();
                          }
                        }}
                      />
                    ))}
                  </div>

                  <p className="otp-resend-prompt">
                    Didn't receive OTP? <span className="otp-resend-link" onClick={() => alert('OTP code resent!')}>Resend OTP</span>
                  </p>
                  
                  <p className="otp-timer-subtext">
                    Resend available in 20s
                  </p>

                  <button type="submit" className="auth-submit-btn-green mt-36">Verify & Proceed</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ INTERACTIVE EXPERIENCE REVIEW SUBMISSION MODAL (Figma-Accurate Share Your Experience) ══ */}
      {reviewModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="auth-modal-card review-modal-card-size" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close-btn" onClick={() => setReviewModalOpen(false)}>&times;</button>
            
            <div className="review-modal-content fade-in">
              <h2 className="auth-modal-title">
                Share Your <span className="highlight-sharp-blue-box">Experience</span>
              </h2>
              
              {/* Interactive Star Row */}
              <div className="review-star-selector-row">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button 
                    key={num}
                    type="button"
                    className="review-star-select-btn"
                    onClick={() => setReviewRating(num)}
                  >
                    <Star 
                      size={32} 
                      fill={num <= reviewRating ? "var(--accent-orange)" : "none"} 
                      color={num <= reviewRating ? "var(--accent-orange)" : "#D1D5DB"} 
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { 
                e.preventDefault(); 
                setReviewModalOpen(false); 
                alert('Thank you for sharing your experience! Your review was submitted successfully.'); 
              }} className="review-submit-form">
                
                <div className="auth-form-group full-width">
                  <label className="auth-input-label">Your Review*</label>
                  <textarea 
                    className="auth-input-field auth-textarea-field" 
                    placeholder="The travel route was smooth and the journey was comfortable."
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn-green mt-36">Submit</button>
              </form>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
