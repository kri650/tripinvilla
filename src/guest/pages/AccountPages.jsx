/**
 * AccountPages.jsx — Assembler / Router
 *
 * This file assembles the four account sub-tabs.
 * Each tab lives in its own file under: sections/account/
 *
 *  sections/account/
 *    ProfileTab.jsx    + ProfileTab.css
 *    WishlistTab.jsx   + WishlistTab.css
 *    EnquiriesTab.jsx  + EnquiriesTab.css
 *    ReviewsTab.jsx    + ReviewsTab.css
 */
import ProfileTab    from '../sections/account/ProfileTab';
import WishlistTab   from '../sections/account/WishlistTab';
import EnquiriesTab  from '../sections/account/EnquiriesTab';
import ReviewsTab    from '../sections/account/ReviewsTab';

export default function AccountPages(props) {
  const { activeMenu } = props;

  // A helper so all tabs can open the login modal
  const openLoginModal = () => {
    props.setAuthMode('login');
    props.setAuthModalOpen(true);
  };

  return (
    <>
      {activeMenu === 'Profile'    && <ProfileTab   {...props} openLoginModal={openLoginModal} />}
      {activeMenu === 'Wishlist'   && <WishlistTab  {...props} openLoginModal={openLoginModal} />}
      {activeMenu === 'Enquiries'  && <EnquiriesTab {...props} openLoginModal={openLoginModal} />}
      {activeMenu === 'Reviews'    && <ReviewsTab   {...props} openLoginModal={openLoginModal} />}
    </>
  );
}
