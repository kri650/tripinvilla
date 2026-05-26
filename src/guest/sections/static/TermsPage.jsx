import { termsHeroImg, privacyHeroImg } from '../../../assets';
import './TermsPage.css';

export default function TermsPage({ activeMenu }) {
  const isPrivacy = activeMenu === 'Privacy';
  const heroImg = isPrivacy ? privacyHeroImg : termsHeroImg;
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

  return (
    <div className="terms-page-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${heroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>{title}</h1>
      </div>

      <div className="terms-document-box">
        <h2 className="terms-document-title">{title}</h2>
        <div className="terms-document-content">
          {isPrivacy ? (
            <>
              <h3 className="terms-section-header">OVERVIEW</h3>
              <p className="terms-text-p">This Privacy Policy describes how TripinVilla collects, uses, discloses, and protects your personal information. By using our website and services, you agree to the collection and use of information in accordance with this policy.</p>
              <h3 className="terms-section-header">1 – INFORMATION WE COLLECT</h3>
              <p className="terms-text-p">When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some cookies installed on your device.</p>
              <h3 className="terms-section-header">2 – HOW WE USE YOUR INFORMATION</h3>
              <p className="terms-text-p">TripinVilla uses the collected information for various purposes, including processing transactions, providing customer support, improving our website, and communicating with you about orders, updates, or promotional offers.</p>
              <h3 className="terms-section-header">3 – SHARING YOUR PERSONAL INFORMATION</h3>
              <p className="terms-text-p">TripinVilla does not sell, rent, or trade your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website.</p>
              <h3 className="terms-section-header">4 – DATA SECURITY</h3>
              <p className="terms-text-p">TripinVilla takes reasonable precautions and follows industry best practices to protect your personal information from loss, misuse, unauthorized access, disclosure, alteration, or destruction.</p>
              <h3 className="terms-section-header">5 – COOKIES AND TRACKING TECHNOLOGIES</h3>
              <p className="terms-text-p">TripinVilla uses cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and understand user behavior.</p>
              <h3 className="terms-section-header">6 – YOUR RIGHTS</h3>
              <p className="terms-text-p">You have the right to access, update, or delete your personal information. You may contact us if you wish to review or correct any personal information we hold about you.</p>
            </>
          ) : (
            <>
              <h3 className="terms-section-header">OVERVIEW</h3>
              <p className="terms-text-p">The website is operated by TripinVilla. Throughout the site, the terms "we", "us" and "our" refer to TripinVilla. TripinVilla offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.</p>
              <p className="terms-text-p">By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including additional terms and conditions and policies referenced here and/or available via hyperlink.</p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>Any new features or tools added to the current store shall also be subject to the Terms of Service. We reserve the right to update, change, modify, or replace any part of these Terms by posting updates and/or changes on our website.</p>
              <h3 className="terms-section-header">1 – ONLINE STORE TERMS</h3>
              <p className="terms-text-p">By agreeing to these Terms of Service, you represent that you are at least the age of majority and in good health in your state or province of residence.</p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.</p>
              <h3 className="terms-section-header">2 – GENERAL CONDITIONS</h3>
              <p className="terms-text-p">We reserve the right to refuse service to anyone for any reason at any time.</p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>You understand that your content may be transferred encrypted and involve transmissions over various networks; and changes to conform and adapt to technical requirements of connecting networks or devices.</p>
              <h3 className="terms-section-header">3 – ACCURACY OF INFORMATION</h3>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>TripinVilla is not responsible if information made available on this website is not accurate, complete, or current. This website may contain certain historical information which is provided for your reference only.</p>
              <h3 className="terms-section-header">4 – MODIFICATIONS TO SERVICE AND PRICES</h3>
              <p className="terms-text-p">Prices for our services and products are subject to change without notice. TripinVilla reserves the right at any time to modify or discontinue the Service without notice at any time.</p>
              <h3 className="terms-section-header">5 – BILLING AND ACCOUNT INFORMATION</h3>
              <p className="terms-text-p">TripinVilla reserves the right to refuse any order you place with us. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
