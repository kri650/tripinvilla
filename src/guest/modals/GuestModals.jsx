import GalleryModal from './GalleryModal';
import AuthModal from './AuthModal';
import ContactHostModal from './ContactHostModal';
import ReviewModal from './ReviewModal';
import EditProfileModal from './EditProfileModal';

export default function GuestModals(props) {
  return (
    <>
      <GalleryModal {...props} />
      <AuthModal {...props} />
      <ContactHostModal {...props} />
      <ReviewModal {...props} />
      <EditProfileModal {...props} />
    </>
  );
}
