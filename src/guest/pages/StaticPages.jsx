/**
 * StaticPages.jsx — Assembler / Router
 *
 * This file assembles the five static pages.
 * Each page lives in its own file under: sections/static/
 *
 *  sections/static/
 *    AboutUsPage.jsx        + AboutUsPage.css       → 12-about-us.css
 *    ContactUsPage.jsx      + ContactUsPage.css      → 13-contact-us.css
 *    TermsPage.jsx          + TermsPage.css          → 14-terms.css (also handles Privacy)
 *    RecommendPage.jsx      + RecommendPage.css      → 15-recommend.css
 *    ListYourPlacePage.jsx  + ListYourPlacePage.css  → 16-list-your-place.css
 */
import AboutUsPage       from '../sections/static/AboutUsPage';
import ContactUsPage     from '../sections/static/ContactUsPage';
import TermsPage         from '../sections/static/TermsPage';
import RecommendPage     from '../sections/static/RecommendPage';
import ListYourPlacePage from '../sections/static/ListYourPlacePage';

export default function StaticPages(props) {
  const { activeMenu } = props;
  return (
    <>
      {activeMenu === 'About Us'        && <AboutUsPage       {...props} />}
      {activeMenu === 'Contact'         && <ContactUsPage     {...props} />}
      {(activeMenu === 'Terms' || activeMenu === 'Privacy') && <TermsPage {...props} />}
      {activeMenu === 'Recommend By Us' && <RecommendPage     {...props} />}
      {activeMenu === 'List Your Place' && <ListYourPlacePage {...props} />}
    </>
  );
}
