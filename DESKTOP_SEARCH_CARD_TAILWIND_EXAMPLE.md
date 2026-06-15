# Desktop Search Card - Tailwind Conversion Example

This document shows how to convert the desktop search card section from CSS classes to Tailwind utilities.

## Original JSX with CSS Classes

```jsx
<form
  className="search-card-wrapper"
  onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
>
  <div className="tabs-row">
    {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
      <button
        key={tab}
        type="button"
        className={`tab-btn ${activeSearchTab === tab ? 'active' : ''}`}
        onClick={() => setActiveSearchTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
  
  <div className="search-fields-grid">
    {/* Fields here */}
  </div>
  
  <div className="action-buttons-row">
    {/* Buttons here */}
  </div>
</form>
```

## Converted to Tailwind CSS

```jsx
<form
  className="absolute top-[290px] left-1/2 -translate-x-1/2 w-[1281px] max-w-[calc(100%-158px)] min-h-[310px] h-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] pt-7 px-8 pb-8 z-[60] box-border overflow-visible max-[900px]:hidden"
  onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
>
  {/* Tabs Row */}
  <div className="absolute top-[29px] left-1/2 -translate-x-1/2 w-[445px] h-8 flex justify-center items-center gap-5 m-0 p-0 box-border">
    {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
      <button
        key={tab}
        type="button"
        className={`h-8 px-4 rounded-full font-['Lato'] text-[15px] font-normal border-none bg-transparent leading-[100%] cursor-pointer flex items-center justify-center transition-all duration-200 whitespace-nowrap hover:opacity-80 ${
          activeSearchTab === tab 
            ? 'bg-[var(--primary-blue)] text-white font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.25)]' 
            : 'text-black'
        }`}
        onClick={() => setActiveSearchTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
  
  {/* Search Fields Grid */}
  <div className="mt-[60px] grid grid-cols-6 gap-4 mb-5">
    
    {/* Field 1: Where */}
    <div className="flex flex-col gap-1.5">
      <span className="font-['Lato'] text-xs font-medium text-[#111827]">Where</span>
      <div className="relative flex items-center">
        <input 
          type="text" 
          className="w-full h-12 bg-white border border-[#E5E7EB] rounded-xl px-4 font-['Lato'] text-[13.5px] text-[#111827] outline-none cursor-pointer placeholder:text-[#9CA3AF]" 
          placeholder="Where are you going?" 
          value={where}
          onChange={(e) => setWhere(e.target.value)}
        />
      </div>
    </div>
    
    {/* Field 2: When - with custom date picker */}
    <div className="flex flex-col gap-1.5 relative" ref={datePickerRef}>
      <span className="font-['Lato'] text-xs font-medium text-[#111827]">When</span>
      <div 
        className="flex gap-2 cursor-pointer py-2.5 px-3.5 bg-white border border-[#E5E7EB] rounded-lg items-center h-11 box-border"
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <span className="flex-1 text-sm" style={{ color: dates ? '#111827' : '#9CA3AF' }}>
          {dates ? `${dates.split(' to ')[0] || ''} - ${dates.split(' to ')[1] || ''}` : 'mm/dd/yyyy - mm/dd/yyyy'}
        </span>
        <CalendarIcon size={16} color="#6B7280" />
      </div>
      {/* Date picker portal code remains the same with inline styles */}
    </div>
    
    {/* Field 3: Who - react-select keeps its custom styles */}
    <div className="flex flex-col gap-1.5">
      <span className="font-['Lato'] text-xs font-medium text-[#111827]">Who</span>
      <Select
        value={{ value: guests, label: guests }}
        onChange={(option) => setGuests(option.value)}
        options={[
          { value: 'Any Guests', label: 'Any Guests' },
          { value: '1 Guest', label: '1 Guest' },
          { value: '2 Guests', label: '2 Guests' },
          { value: '3 Guests', label: '3 Guests' },
          { value: '4+ Guests', label: '4+ Guests' },
        ]}
        styles={desktopSelectStyles}
        isSearchable={false}
        placeholder="Select guests"
      />
    </div>
    
    {/* Field 4: Price per Night */}
    <div className="flex flex-col gap-1.5">
      <span className="font-['Lato'] text-xs font-medium text-[#111827]">Price per Night</span>
      <Select
        value={{ value: price, label: price }}
        onChange={(option) => setPrice(option.value)}
        options={[
          { value: 'Any', label: 'Any' },
          { value: '₹2,000 - ₹5,000', label: '₹2,000 - ₹5,000' },
          { value: '₹5,000 - ₹10,000', label: '₹5,000 - ₹10,000' },
          { value: '₹10,000 - ₹20,000', label: '₹10,000 - ₹20,000' },
          { value: '₹20,000+', label: '₹20,000+' },
        ]}
        styles={desktopSelectStyles}
        isSearchable={false}
        placeholder="Select price"
      />
    </div>
    
    {/* Field 5: Room/Stay Type */}
    <div className="flex flex-col gap-1.5">
      <span className="font-['Lato'] text-xs font-medium text-[#111827]">Room/Stay Type</span>
      <Select
        value={{ value: stayType, label: stayType }}
        onChange={(option) => setStayType(option.value)}
        options={[
          { value: 'Any', label: 'Any' },
          ...(roomTypes.length > 0 
            ? roomTypes.map(rt => ({ value: rt.name, label: rt.name }))
            : [
                { value: '1 Deluxe Room', label: '1 Deluxe Room' },
                { value: '2 Deluxe Rooms', label: '2 Deluxe Rooms' },
                { value: 'Entire Villa', label: 'Entire Villa' }
              ]
          )
        ]}
        styles={desktopSelectStyles}
        isSearchable={false}
        placeholder="Select stay type"
      />
    </div>
    
    {/* Field 6: Food Preference */}
    <div className="flex flex-col gap-1.5">
      <span className="font-['Lato'] text-xs font-medium text-[#111827]">Food Preference</span>
      <Select
        value={{ value: foodPref, label: foodPref }}
        onChange={(option) => setFoodPref(option.value)}
        options={[
          { value: 'Any', label: 'Any' },
          { value: 'Pure Veg', label: 'Pure Veg' },
          { value: 'Non-Veg', label: 'Non-Veg' },
          { value: 'Buffet Available', label: 'Buffet Available' },
        ]}
        styles={desktopSelectStyles}
        isSearchable={false}
        placeholder="Select food preference"
      />
    </div>
    
  </div>
  
  {/* Action and Checkbox controls row */}
  <div className="flex justify-between items-center mt-2.5">
    
    {/* Filter checkboxes */}
    <div className="flex items-center gap-6">
      <label className="flex items-center gap-2 text-[13px] font-medium text-[#4B5563] cursor-pointer">
        <input 
          type="checkbox" 
          className="w-[18px] h-[18px] rounded border border-[#D1D5DB] accent-[var(--brand-green)]" 
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
        />
        <span>Verified only</span>
      </label>
      <label className="flex items-center gap-2 text-[13px] font-medium text-[#4B5563] cursor-pointer">
        <input 
          type="checkbox" 
          className="w-[18px] h-[18px] rounded border border-[#D1D5DB] accent-[var(--brand-green)]" 
          checked={featuredOnly}
          onChange={(e) => setFeaturedOnly(e.target.checked)}
        />
        <span>Featured only</span>
      </label>
    </div>
    
    {/* Execution Buttons */}
    <div className="flex items-center gap-3">
      <button 
        type="button" 
        className="bg-white text-[#1F2937] border border-[#D1D5DB] font-semibold text-sm rounded-xl py-3 px-6 cursor-pointer flex items-center justify-center h-12 transition-all duration-200 hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
        onClick={handleCloseSearch || handleClearAll}
      >
        Close
      </button>
      
      <button 
        type="button" 
        className="bg-white text-[#1F2937] border border-[#D1D5DB] font-semibold text-sm rounded-xl py-3 px-6 cursor-pointer flex items-center justify-center h-12 transition-all duration-200 hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
        onClick={handleClearAll}
      >
        Clear all
      </button>
      
      <button 
        type="submit" 
        className="bg-[var(--brand-green)] text-white font-semibold text-sm border-none rounded-xl py-3 px-7 cursor-pointer flex items-center gap-2 transition-all duration-200 h-12 hover:bg-[var(--brand-green-hover)] hover:-translate-y-px"
      >
        <Search size={16} />
        <span>Search</span>
      </button>
      
      <button 
        type="button" 
        className="bg-white text-[#1F2937] border border-[#D1D5DB] font-semibold text-sm rounded-xl py-3 px-6 cursor-pointer flex items-center gap-2 transition-all duration-200 h-12 hover:bg-[#F9FAFB] hover:border-[#9CA3AF]"
        onClick={handleAISearch} 
        disabled={aiSearchLoading} 
        style={{ opacity: aiSearchLoading ? 0.7 : 1 }}
      >
        <Sparkles size={16} color="var(--primary-blue)" />
        <span>{aiSearchLoading ? 'Searching...' : 'Search with AI'}</span>
      </button>
    </div>
    
  </div>
</form>
```

## CSS to Tailwind Mapping

### Container (search-card-wrapper)
- `position: absolute` → `absolute`
- `top: 290px` → `top-[290px]`
- `left: 50%; transform: translateX(-50%)` → `left-1/2 -translate-x-1/2`
- `width: 1281px` → `w-[1281px]`
- `max-width: calc(100% - 158px)` → `max-w-[calc(100%-158px)]`
- `min-height: 310px` → `min-h-[310px]`
- `height: auto` → `h-auto`
- `background: #FFFFFF` → `bg-white`
- `border-radius: 24px` → `rounded-3xl`
- `box-shadow: 0 20px 50px rgba(0,0,0,0.1)` → `shadow-[0_20px_50px_rgba(0,0,0,0.1)]`
- `padding: 28px 32px 32px 32px` → `pt-7 px-8 pb-8`
- `z-index: 60` → `z-[60]`
- `box-sizing: border-box` → `box-border`
- `overflow: visible` → `overflow-visible`
- Hide on mobile: → `max-[900px]:hidden`

### Tabs Row (tabs-row)
- `position: absolute` → `absolute`
- `top: 29px` → `top-[29px]`
- `left: 50%; transform: translateX(-50%)` → `left-1/2 -translate-x-1/2`
- `width: 445px` → `w-[445px]`
- `height: 32px` → `h-8`
- `display: flex` → `flex`
- `justify-content: center` → `justify-center`
- `align-items: center` → `items-center`
- `gap: 20px` → `gap-5`
- `margin: 0; padding: 0` → `m-0 p-0`
- `box-sizing: border-box` → `box-border`

### Tab Button (tab-btn)
- `height: 32px` → `h-8`
- `padding: 0 16px` → `px-4`
- `border-radius: 100px` → `rounded-full`
- `font-family: 'Lato'` → `font-['Lato']`
- `font-size: 15px` → `text-[15px]`
- `font-weight: 400` → `font-normal`
- `border: none` → `border-none`
- `background: transparent` → `bg-transparent`
- `color: #000000` → `text-black`
- `line-height: 100%` → `leading-[100%]`
- `cursor: pointer` → `cursor-pointer`
- `display: flex` → `flex`
- `align-items: center` → `items-center`
- `justify-content: center` → `justify-center`
- `transition: all 0.2s ease` → `transition-all duration-200`
- `white-space: nowrap` → `whitespace-nowrap`
- `:hover { opacity: 0.8 }` → `hover:opacity-80`

### Tab Button Active State
- `background: var(--primary-blue)` → `bg-[var(--primary-blue)]`
- `color: #FFFFFF` → `text-white`
- `font-weight: 600` → `font-semibold`
- `box-shadow: 0 4px 12px rgba(37,99,235,0.25)` → `shadow-[0_4px_12px_rgba(37,99,235,0.25)]`

### Search Fields Grid (search-fields-grid)
- `margin-top: 60px` → `mt-[60px]`
- `display: grid` → `grid`
- `grid-template-columns: repeat(6, 1fr)` → `grid-cols-6`
- `gap: 16px` → `gap-4`
- `margin-bottom: 20px` → `mb-5`

### Field Group (field-group)
- `display: flex` → `flex`
- `flex-direction: column` → `flex-col`
- `gap: 6px` → `gap-1.5`

### Field Label (field-label)
- `font-family: 'Lato'` → `font-['Lato']`
- `font-size: 12px` → `text-xs`
- `font-weight: 500` → `font-medium`
- `color: #111827` → `text-[#111827]`

### Field Input
- `width: 100%` → `w-full`
- `height: 48px` → `h-12`
- `background: #FFFFFF` → `bg-white`
- `border: 1px solid #E5E7EB` → `border border-[#E5E7EB]`
- `border-radius: 12px` → `rounded-xl`
- `padding: 0 16px` → `px-4`
- `font-family: 'Lato'` → `font-['Lato']`
- `font-size: 13.5px` → `text-[13.5px]`
- `color: #111827` → `text-[#111827]`
- `outline: none` → `outline-none`
- `cursor: pointer` → `cursor-pointer`
- `::placeholder { color: #9CA3AF }` → `placeholder:text-[#9CA3AF]`

### Checkbox Row
- `display: flex` → `flex`
- `align-items: center` → `items-center`
- `gap: 24px` → `gap-6`

### Checkbox Label
- `display: flex` → `flex`
- `align-items: center` → `items-center`
- `gap: 8px` → `gap-2`
- `font-size: 13px` → `text-[13px]`
- `font-weight: 500` → `font-medium`
- `color: #4B5563` → `text-[#4B5563]`
- `cursor: pointer` → `cursor-pointer`

### Checkbox Input
- `width: 18px` → `w-[18px]`
- `height: 18px` → `h-[18px]`
- `border-radius: 4px` → `rounded`
- `border: 1px solid #D1D5DB` → `border border-[#D1D5DB]`
- `accent-color: var(--brand-green)` → `accent-[var(--brand-green)]`

### Action Buttons Row
- `display: flex` → `flex`
- `justify-content: space-between` → `justify-between`
- `align-items: center` → `items-center`
- `margin-top: 10px` → `mt-2.5`

### Button Styles
**Search Button (btn-search):**
- `background: var(--brand-green)` → `bg-[var(--brand-green)]`
- `color: #FFFFFF` → `text-white`
- `font-weight: 600` → `font-semibold`
- `font-size: 14px` → `text-sm`
- `border: none` → `border-none`
- `border-radius: 12px` → `rounded-xl`
- `padding: 12px 28px` → `py-3 px-7`
- `cursor: pointer` → `cursor-pointer`
- `display: flex` → `flex`
- `align-items: center` → `items-center`
- `gap: 8px` → `gap-2`
- `transition: all 0.2s ease` → `transition-all duration-200`
- `height: 48px` → `h-12`
- `:hover { background: var(--brand-green-hover); transform: translateY(-1px) }` → `hover:bg-[var(--brand-green-hover)] hover:-translate-y-px`

**Outline Buttons (btn-outline, btn-search-ai):**
- `background: #FFFFFF` → `bg-white`
- `color: #1F2937` → `text-[#1F2937]`
- `border: 1px solid #D1D5DB` → `border border-[#D1D5DB]`
- `font-weight: 600` → `font-semibold`
- `font-size: 14px` → `text-sm`
- `border-radius: 12px` → `rounded-xl`
- `padding: 12px 24px` → `py-3 px-6`
- `cursor: pointer` → `cursor-pointer`
- `display: flex` → `flex`
- `align-items: center` → `items-center`
- `justify-content: center` → `justify-center`
- `height: 48px` → `h-12`
- `transition: all 0.2s ease` → `transition-all duration-200`
- `:hover { background: #F9FAFB; border-color: #9CA3AF }` → `hover:bg-[#F9FAFB] hover:border-[#9CA3AF]`

## Notes

1. **React-Select**: Keep the custom `desktopSelectStyles` object as-is since react-select needs JavaScript objects for styling
2. **Date Picker Portal**: Keep inline styles for the portal since it's dynamically positioned
3. **CSS Variables**: Use `var(--variable-name)` in square brackets: `bg-[var(--brand-green)]`
4. **Custom Values**: Use square brackets for arbitrary values: `top-[290px]`, `text-[13.5px]`
5. **Arbitrary calc()**: Use square brackets: `max-w-[calc(100%-158px)]`
6. **Font Family**: Use square brackets with quotes: `font-['Lato']`
7. **Responsive**: Hide on mobile with `max-[900px]:hidden`

## Benefits of This Approach

1. **No separate CSS file needed** for the search card
2. **Easier to see styles** directly in the component
3. **Better tree-shaking** - only used utilities are included
4. **Consistent spacing** using Tailwind's spacing scale where possible
5. **Responsive utilities** built-in

## Trade-offs

1. **Longer className strings** - but can be organized with template literals
2. **Custom values** require square bracket notation
3. **Some complex styles** (like react-select) still need JavaScript objects
