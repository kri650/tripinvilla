import TestimonialsSection from './TestimonialsSection';

// Example usage of the TestimonialsSection component
export default function TestimonialsUsageExample() {
  // Example custom testimonials data
  const customTestimonials = [
    {
      name: 'Sarah Johnson',
      designation: 'Marketing Director, TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      text: '"Outstanding service and incredible results. The team exceeded all our expectations."'
    },
    {
      name: 'Michael Chen',
      designation: 'CEO, InnovateLabs',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      text: '"Professional, efficient, and delivered exactly what we needed on time."'
    },
    {
      name: 'Emily Rodriguez',
      designation: 'Product Manager, StartupXYZ',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
      text: '"Incredible attention to detail and fantastic communication throughout."'
    },
    {
      name: 'David Wilson',
      designation: 'CTO, TechStartup',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      video: 'path/to/video.mp4', // Optional video testimonial
      text: '"Game-changing solution that transformed our business operations."'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20">
        
        {/* Example 1: Default Usage with Custom Data */}
        <TestimonialsSection 
          title="What Our Clients Say"
          subtitle="Real feedback from satisfied customers"
          testimonials={customTestimonials}
        />

        {/* Example 2: Minimal Usage (uses default testimonials) */}
        <TestimonialsSection />

        {/* Example 3: Custom Title Only */}
        <TestimonialsSection 
          title="Customer Success Stories"
        />

        {/* Example 4: With Custom CSS Classes */}
        <TestimonialsSection 
          title="Reviews & Testimonials"
          subtitle="See what our customers have to say about our services"
          testimonials={customTestimonials}
          className="bg-white"
        />
        
      </div>
    </div>
  );
}

// Props Documentation for TestimonialsSection:
/*
Props:
- title: string (default: 'Our Testimonials') - Main section title
- subtitle: string (default: 'Check what our customers say about us') - Section subtitle
- testimonials: array (default: []) - Array of testimonial objects
- className: string (default: '') - Additional CSS classes for the container

Testimonial Object Structure:
{
  name: string - Customer name
  designation: string - Customer job title/company
  image: string - Customer profile image URL
  text: string - Testimonial text/quote
  video?: string - Optional video testimonial URL (for featured card)
}

Features:
✅ Fully responsive design
✅ Smooth animations and hover effects
✅ Horizontal scrolling with navigation
✅ Support for video testimonials
✅ Touch-friendly mobile experience
✅ Pure Tailwind CSS (no external dependencies)
✅ Customizable content and styling
✅ Accessible navigation controls
*/