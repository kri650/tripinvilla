/**
 * CatalogPages.jsx — Assembler / Router
 *
 * This file assembles the three catalog views.
 * Each view lives in its own file under: sections/catalog/
 *
 *  sections/catalog/
 *    PropertyDetailPage.jsx  + PropertyDetailPage.css  → 09-property-detail-page.css
 *    SearchResultsPage.jsx   + SearchResultsPage.css   → 08-properties-page.css
 *    PropertiesGridPage.jsx  + PropertiesGridPage.css  → 08-properties-page.css
 */
import PropertyDetailPage  from '../sections/catalog/PropertyDetailPage';
import SearchResultsPage   from '../sections/catalog/SearchResultsPage';
import PropertiesGridPage  from '../sections/catalog/PropertiesGridPage';

export default function CatalogPages(props) {
  const { activeMenu } = props;
  return (
    <>
      {activeMenu === 'Detail'     && <PropertyDetailPage {...props} />}
      {activeMenu === 'Search'     && <SearchResultsPage  {...props} />}
      {activeMenu === 'Properties' && <PropertiesGridPage {...props} />}
    </>
  );
}
