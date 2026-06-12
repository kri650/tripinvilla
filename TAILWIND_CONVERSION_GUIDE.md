# Property Detail Page - Tailwind CSS Conversion Guide

## Main Container Classes

### `.detail-page-wrapper`
```jsx
className="w-[1440px] max-w-[calc(100%-158px)] mx-auto pt-[150px] overflow-x-hidden box-border
  max-[1100px]:max-w-[calc(100%-80px)]
  max-[900px]:max-w-[calc(100%-32px)] max-[900px]:pt-[100px]
  max-[640px]:!max-w-full max-[640px]:!px-3 max-[640px]:!pt-[60px]
  max-[480px]:!px-2 max-[480px]:!pt-[50px]
  max-[360px]:!pt-10"
```

### `.breadcrumb-row`
```jsx
className="flex items-center gap-2 font-['Lato'] text-sm font-medium text-[#6B7280] mb-6 flex-wrap
  max-[640px]:text-[11px] max-[640px]:mb-4 max-[640px]:gap-[6px]
  max-[480px]:text-[10px] max-[480px]:gap-1"
```

Breadcrumb spans:
- Normal span: `className="cursor-pointer transition-colors hover:text-[var(--primary-blue)]"`
- Separator: `className="text-[#CBD5E1] cursor-default"`
- Active: `className="text-[#111827] font-semibold cursor-default"`

## Image Gallery Classes

### `.detail-primary-grid`
```jsx
className="grid grid-cols-[1.55fr_1fr] gap-6 mb-10
  max-[1100px]:grid-cols-[1fr_380px]
  max-[900px]:grid-cols-1 max-[900px]:gap-4"
```

### `.detail-image-gallery`
```jsx
className="grid gap-2 h-[440px] min-h-[440px] max-h-[440px] overflow-hidden self-start
  max-[900px]:h-80 max-[900px]:max-h-80
  max-[640px]:!h-[200px] max-[640px]:!max-h-[200px] max-[640px]:!min-h-[200px] max-[640px]:!gap-[6px]
  max-[480px]:!h-[180px] max-[480px]:!max-h-[180px] max-[480px]:!min-h-[180px]
  max-[360px]:!h-40 max-[360px]:!max-h-40 max-[360px]:!min-h-40"
style={{ gridTemplateColumns: propImages.length <= 1 ? '1fr' : '1.6fr 1fr' }}
```

### `.gallery-master-img`
```jsx
className="h-full max-h-full min-h-0 rounded-[20px] overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer
  max-[640px]:!rounded-xl"
```

### `.gallery-master-img img`
```jsx
className="w-full h-full object-cover block transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
```

### `.gallery-sub-images`
```jsx
className="flex flex-col gap-3 h-full max-h-full min-h-0
  max-[640px]:!gap-2"
```

### `.sub-img-wrap`
```jsx
className="flex-1 rounded-2xl overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.02)]
  max-[640px]:!rounded-[10px]"
```

### `.sub-img-wrap img`
```jsx
className="w-full h-full object-cover block transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
```

### `.gallery-count-layer`
```jsx
className="absolute inset-0 bg-[rgba(0,0,0,0.55)] backdrop-blur-[8px] flex items-center justify-center text-white font-['Lato'] text-[15px] font-bold transition-colors duration-300 cursor-pointer hover:bg-[rgba(0,0,0,0.4)]
  max-[640px]:!text-xs"
```

## Reservation Card Classes

### `.detail-reservation-card`
```jsx
className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.07)]
  max-[640px]:!p-4 max-[640px]:!rounded-2xl max-[640px]:!mt-0
  max-[360px]:!p-3"
```

### `.reservation-title`
```jsx
className="font-['Lato'] text-2xl font-bold text-[#111827] m-0 mb-[6px] leading-[1.25] overflow-hidden text-ellipsis whitespace-nowrap max-w-full
  max-[640px]:!text-lg max-[640px]:!leading-[1.2] max-[640px]:!mb-2 max-[640px]:!whitespace-normal max-[640px]:!break-words
  max-[480px]:!text-base
  max-[360px]:!text-sm"
```

### `.reservation-location`
```jsx
className="flex items-center gap-[6px] font-['Lato'] text-sm font-medium text-[#4B5563] mb-[18px]
  max-[640px]:!text-xs max-[640px]:!mb-3"
```

### `.reservation-timing-row`
```jsx
className="flex gap-3 mb-[18px] overflow-hidden box-border w-full
  max-[640px]:!flex-col max-[640px]:!gap-2 max-[640px]:!mb-3"
```

### `.time-badge`
```jsx
className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-[14px] py-[10px] font-['Lato'] text-[13px] font-semibold text-[#475569] flex items-center gap-2 flex-1 transition-all duration-200 hover:bg-[#F1F5F9] hover:border-[#CBD5E1] overflow-hidden box-border text-ellipsis whitespace-nowrap
  max-[640px]:!px-3 max-[640px]:!py-2 max-[640px]:!text-[11px] max-[640px]:!rounded-lg max-[640px]:!text-center max-[640px]:!justify-center max-[640px]:!whitespace-normal max-[640px]:!break-words"
```

### `.reservation-checks-list`
```jsx
className="flex flex-col gap-[10px] mb-[22px] overflow-hidden box-border w-full
  max-[640px]:!gap-2 max-[640px]:!mb-4"
```

### `.check-bullet`
```jsx
className="flex items-center gap-[10px] font-['Lato'] text-sm font-medium text-[#374151] overflow-hidden box-border w-full items-start
  max-[640px]:!text-xs max-[640px]:!gap-2"
```

### `.reservation-pricing-block`
```jsx
className="border-t border-[#F3F4F6] pt-4 mb-5 flex items-end justify-between overflow-hidden box-border w-full
  max-[640px]:!pt-3 max-[640px]:!mb-4"
```

### `.highlight-green-detail`
```jsx
className="font-['Lato'] text-[32px] font-bold text-[#58A429] leading-none overflow-hidden text-ellipsis whitespace-nowrap
  max-[640px]:!text-xl max-[640px]:!leading-[1.1] max-[640px]:!whitespace-normal max-[640px]:!break-words
  max-[480px]:!text-lg
  max-[360px]:!text-base"
```

### `.old-strike-price`
```jsx
className="font-['Lato'] text-sm line-through text-[#9CA3AF] inline-block mr-3 overflow-hidden text-ellipsis whitespace-nowrap
  max-[640px]:!text-xs max-[640px]:!mr-2 max-[640px]:!whitespace-normal max-[640px]:!break-words"
```

### `.taxes-subtext`
```jsx
className="font-['Lato'] text-xs text-[#9CA3AF] block mb-1
  max-[640px]:!text-[10px] max-[640px]:!mb-[3px]"
```

### `.btn-view-contact-green`
```jsx
className="bg-[#58A429] border-none text-white font-['Lato'] text-[15px] font-bold py-[14px] px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_12px_rgba(72,187,120,0.2)] hover:bg-[#38A169] hover:-translate-y-px overflow-hidden box-border w-full text-ellipsis whitespace-nowrap min-h-[44px]
  max-[640px]:!py-3 max-[640px]:!px-4 max-[640px]:!text-[13px] max-[640px]:!rounded-[10px] max-[640px]:!gap-[6px] max-[640px]:!whitespace-normal max-[640px]:!break-words
  max-[480px]:!py-[10px] max-[480px]:!px-[14px] max-[480px]:!text-xs"
```

## Section Classes

### `.about-property-section` / `.border-box-style`
```jsx
className="bg-white border border-[#E5E7EB] rounded-3xl p-6 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden box-border w-full max-w-full
  max-[640px]:!p-4 max-[640px]:!rounded-2xl max-[640px]:!mb-4
  max-[480px]:!p-3
  max-[360px]:!p-3"
```

### `.section-subtitle-title`
```jsx
className="font-['Lato'] text-xl font-bold text-[#111827] m-0 mb-3
  max-[640px]:!text-base max-[640px]:!mb-2
  max-[480px]:!text-sm
  max-[360px]:!text-[13px]"
```

### `.about-property-text`
```jsx
className="font-['Lato'] text-[15px] font-medium text-[#4B5563] leading-[1.65] m-0 overflow-hidden break-words
  max-[640px]:!text-[13px] max-[640px]:!leading-[1.5]
  max-[480px]:!text-xs"
```

### `.read-more-link`
```jsx
className="text-[var(--primary-blue)] font-semibold underline cursor-pointer ml-1
  max-[640px]:!text-[13px]"
```

## Amenities Classes

### `.amenities-horizontal-layout`
```jsx
className="flex flex-wrap gap-[14px] w-full box-border overflow-hidden
  max-[480px]:!grid max-[480px]:!grid-cols-2 max-[480px]:!gap-2"
```

### `.amenity-vertical-item`
```jsx
className="flex flex-col items-center justify-center text-center gap-2 bg-white border border-[#E2E8F0] rounded-2xl p-4 min-w-[120px] flex-1 shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:border-[#58A429] hover:shadow-[0_12px_24px_rgba(88,164,41,0.08)] box-border overflow-hidden min-h-[40px]
  max-[480px]:!p-3 max-[480px]:!min-h-[110px]
  max-[360px]:!p-2"
```

### `.amenity-vertical-icon`
```jsx
className="w-12 h-12 bg-[rgba(88,164,41,0.08)] rounded-full flex items-center justify-center flex-shrink-0
  max-[480px]:!w-8 max-[480px]:!h-8"
```

### `.amenity-vertical-lbl`
```jsx
className="font-['Lato'] text-xs font-semibold text-[#6B7280] capitalize
  max-[480px]:!text-[10px]"
```

### `.amenity-vertical-val`
```jsx
className="font-['Lato'] text-sm font-bold text-[#111827]
  max-[480px]:!text-[11px]"
```

## Sub Navigation Classes

### `.detail-sub-navigation-tabs`
```jsx
className="flex gap-3 border-b border-[#E5E7EB] pb-px my-10 mb-6 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-[#D1D5DB] scrollbar-track-[#F3F4F6] [-webkit-overflow-scrolling:touch]
  max-[900px]:!overflow-x-auto max-[900px]:!whitespace-nowrap max-[900px]:!flex-nowrap
  max-[640px]:!gap-2 max-[640px]:!my-6 max-[640px]:!mb-4 max-[640px]:!pb-0.5"
```

### `.detail-sub-nav-btn`
```jsx
className="bg-transparent border-none py-3 px-6 font-['Lato'] text-[15px] font-semibold text-[#6B7280] cursor-pointer relative transition-colors duration-150 hover:text-[#374151] flex-shrink-0 whitespace-nowrap overflow-hidden text-ellipsis min-h-[36px]
  max-[900px]:!py-[10px] max-[900px]:!px-4 max-[900px]:!text-sm
  max-[640px]:!py-2 max-[640px]:!px-4 max-[640px]:!text-xs
  max-[480px]:!py-[6px] max-[480px]:!px-3 max-[480px]:!text-[11px]"
```

Active state:
```jsx
className="... text-[var(--primary-blue)] after:content-[''] after:absolute after:-bottom-px after:left-0 after:right-0 after:h-[2.5px] after:bg-[var(--primary-blue)] after:rounded-t-[10px]"
```

## Room Card Classes

### `.rooms-stack`
```jsx
className="flex flex-col gap-[18px]
  max-[640px]:!gap-3
  max-[480px]:!gap-[10px]"
```

### `.room-vertical-card`
```jsx
className="flex border border-[#E5E7EB] rounded-[18px] overflow-hidden bg-white box-border w-full
  max-[640px]:!flex-col max-[640px]:!rounded-xl"
```

### `.room-card-img-wrap`
```jsx
className="w-[clamp(150px,18vw,210px)] h-auto min-h-[132px] flex-shrink-0
  max-[980px]:!w-[170px] max-[980px]:!min-h-[140px]
  max-[640px]:!w-full max-[640px]:!h-[160px] max-[640px]:!min-h-[160px]"
```

### `.room-card-info-wrap`
```jsx
className="flex justify-between w-full p-5 gap-4 box-border overflow-hidden
  max-[980px]:!flex-wrap
  max-[640px]:!flex-col max-[640px]:!gap-3 max-[640px]:!p-4
  max-[480px]:!p-3"
```

### `.room-card-mid-col`
```jsx
className="flex flex-col gap-3 min-w-0 overflow-hidden
  max-[640px]:!gap-2"
```

### `.room-card-title`
```jsx
className="font-['Lato'] text-lg font-bold text-[#111827] m-0 leading-[1.25]
  max-[640px]:!text-base
  max-[480px]:!text-sm"
```

### `.room-card-pricing-col`
```jsx
className="flex flex-col items-end justify-between w-[clamp(170px,19vw,220px)] border-l border-[#F3F4F6] pl-5 flex-shrink-0 box-border overflow-hidden
  max-[980px]:!w-full max-[980px]:!border-l-0 max-[980px]:!border-t max-[980px]:!border-[#F3F4F6] max-[980px]:!pl-0 max-[980px]:!pt-[10px] max-[980px]:!flex-row max-[980px]:!items-center max-[980px]:!gap-3
  max-[640px]:!flex-col max-[640px]:!items-start max-[640px]:!w-full max-[640px]:!border-l-0 max-[640px]:!border-t max-[640px]:!pl-0 max-[640px]:!pt-3 max-[640px]:!flex-row max-[640px]:!justify-between"
```

### `.room-green-val`
```jsx
className="font-['Lato'] text-2xl font-bold text-[#58A429] mb-[6px]
  max-[640px]:!text-lg max-[640px]:!mb-0"
```

## Map and Landmarks Classes

### `.map-landmarks-split`
```jsx
className="grid grid-cols-[1.6fr_1fr] gap-6 w-full box-border overflow-hidden
  max-[900px]:!grid-cols-1 max-[900px]:!gap-4
  max-[640px]:!gap-4"
```

### `.mock-map-graphic`
```jsx
className="h-[350px] bg-[#EBF8FF] rounded-[20px] border border-[#BEE3F8] relative overflow-hidden box-border w-full [background-image:radial-gradient(#CBD5E0_1px,transparent_1px),radial-gradient(#CBD5E0_1px,transparent_1px)] [background-size:20px_20px] [background-position:0_0,10px_10px]
  max-[640px]:!h-[200px] max-[640px]:!rounded-xl
  max-[480px]:!h-40
  max-[360px]:!h-[140px]"
```

### `.landmarks-stack`
```jsx
className="flex flex-col gap-3
  max-[640px]:!gap-2"
```

### `.landmark-row-item`
```jsx
className="flex items-center gap-3 bg-[#F9FAFB] rounded-[14px] p-4 border border-[#F3F4F6] box-border overflow-hidden w-full
  max-[640px]:!p-3 max-[640px]:!gap-2 max-[640px]:!rounded-[10px]
  max-[480px]:!p-[10px]"
```

## Reviews Classes

### `.reviews-layout-split`
```jsx
className="grid grid-cols-[1fr_1.5fr] gap-10 w-full box-border overflow-hidden
  max-[900px]:!grid-cols-1 max-[900px]:!gap-6
  max-[640px]:!gap-5"
```

### `.score-pill-large`
```jsx
className="w-14 h-14 rounded-[14px] bg-[#58A429] text-white flex items-center justify-center font-['Lato'] text-[22px] font-bold
  max-[640px]:!w-12 max-[640px]:!h-12 max-[640px]:!text-lg max-[640px]:!rounded-[10px]
  max-[480px]:!w-10 max-[480px]:!h-10 max-[480px]:!text-base
  max-[360px]:!w-9 max-[360px]:!h-9 max-[360px]:!text-sm"
```

### `.btn-share-experience`
```jsx
className="w-full bg-[#58A429] border-none text-white font-['Lato'] text-sm font-bold py-3 px-5 rounded-[10px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(72,187,120,0.15)] hover:bg-[#38A169] hover:-translate-y-px min-h-[44px]
  max-[640px]:!text-xs max-[640px]:!py-[10px] max-[640px]:!px-4 max-[640px]:!rounded-lg max-[640px]:!gap-[6px]"
```

### `.review-stream-item`
```jsx
className="border-b border-[#F3F4F6] pb-5 overflow-hidden box-border w-full last:border-b-0 last:pb-0
  max-[640px]:!pb-4"
```

### `.review-quote-text`
```jsx
className="font-['Lato'] text-sm font-medium text-[#4B5563] leading-[1.6] my-0 mb-3 overflow-hidden break-words
  max-[640px]:!text-xs max-[640px]:!leading-[1.5] max-[640px]:!mb-2"
```

---

## Usage Instructions

1. Replace each CSS className with the corresponding Tailwind className from above
2. Remove any inline styles that are now covered by Tailwind classes
3. Keep the CSS file for any global styles or complex animations
4. Test responsive behavior at each breakpoint: 1100px, 900px, 640px, 480px, 360px

## Notes

- Use `!important` syntax (!) in Tailwind when needed to override existing styles
- The `max-[XXXpx]:` syntax is Tailwind's arbitrary breakpoint
- Keep transition animations in CSS if they're complex
- Font-family with spaces needs quotes: `font-['Lato']`
