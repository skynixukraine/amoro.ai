import useWindowSize from '@/hooks/useWindowSize';
import { Box } from '@mui/material';
import Link from 'next/link';
import React from 'react';

const ArrowBack = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.8572 6.81378H3.90239L6.52282 4.06273C6.63197 3.95206 6.71903 3.81967 6.77892 3.6733C6.83881 3.52692 6.87034 3.36949 6.87166 3.21019C6.87298 3.05088 6.84406 2.8929 6.7866 2.74545C6.72914 2.59801 6.64428 2.46405 6.53698 2.3514C6.42968 2.23875 6.30209 2.14967 6.16164 2.08934C6.0212 2.02902 5.87072 1.99866 5.71898 2.00005C5.56724 2.00143 5.41728 2.03453 5.27786 2.0974C5.13843 2.16028 5.01233 2.25168 4.90691 2.36627L0.335739 7.16531C0.229314 7.27676 0.144878 7.40916 0.0872666 7.55491C0.0296551 7.70067 0 7.85693 0 8.01474C0 8.17255 0.0296551 8.32881 0.0872666 8.47457C0.144878 8.62033 0.229314 8.75273 0.335739 8.86417L4.90691 13.6632C5.12244 13.8818 5.41111 14.0027 5.71075 14C6.01039 13.9972 6.29701 13.871 6.5089 13.6486C6.72078 13.4262 6.84097 13.1252 6.84357 12.8107C6.84617 12.4961 6.73099 12.193 6.52282 11.9668L3.90239 9.2133H14.8572C15.1603 9.2133 15.451 9.0869 15.6653 8.8619C15.8796 8.6369 16 8.33174 16 8.01354C16 7.69535 15.8796 7.39018 15.6653 7.16518C15.451 6.94019 15.1603 6.81378 14.8572 6.81378Z"
      fill="#111928"
    />
  </svg>
);

const PrivacyComponent: React.FC<{
  setOpenPrivacyModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenPrivacyModal, setOpenSignupModal }) => {
  const sizes = useWindowSize();
  const isDesktop = sizes.width && sizes.width >= 900;

  const textProps = {
    marginLeft: '12px',
    color: '#111928',
    fontFamily: 'Inter',
    fontSize: sizes.width && sizes.width < 768 ? '20px' : '32px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '90%',
        overflowY: 'auto',
        px: '32px',
        py: '24px',
        '@media screen and (max-width: 767px)': {
          px: '15px',
          height: '100%',
        },
      }}
    >
      <div style={{ width: '100%', textAlign: 'left' }}>
        <Link
          style={{
            textDecoration: 'none',
            color: 'black',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
          }}
          href={isDesktop ? '#' : '/signup'}
          onClick={
            isDesktop && setOpenPrivacyModal && setOpenSignupModal
              ? () => {
                  setOpenPrivacyModal(false);
                  setOpenSignupModal(true);
                }
              : () => {}
          }
        >
          <>
            <ArrowBack />
            <span style={textProps}>Privacy & Policy</span>
          </>
        </Link>
      </div>
      <div className="privacyContainer" style={{ marginLeft: '25px' }}>
        <div
          style={{
            color: '#6B7280',
            width: '100%',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '24px',
          }}
        >
          <p>
            <b>Privacy Policy</b>
            <br />
            Last updated: 16 March 2024
            <br />
            Metric Media Pte Ltd (&quot;us&quot;, &quot;we&quot;, or
            &quot;our&quot;) operates the Amoro.AI software (hereinafter
            referred to as the &quot;Service&quot;).
            <br />
            <b>1. Introduction</b>
            <br />
            This Privacy Policy informs you of our policies regarding the
            collection, use, and disclosure of personal data when you use our
            Service and the choices you have associated with that data.
            <br />
            <b>2. Types of Data Collected</b>
            <br />
            We collect several types of data to provide and improve our Service.
            This may include:
            <br />
            • Personal Data: Information that can be used to identify you, such
            as your name, email address, and contact information.
            <br />
            • Usage Data: Information about how you interact with our Service,
            such as your IP address, browser type, pages visited, and time spent
            on each page.
            <br />
            <b>3. How Data is Collected</b>
            <br />
            We collect personal data through various means, including:
            <br />
            • Information provided voluntarily: When you sign up for our
            Service, subscribe to our newsletter, or contact us directly.
            <br />• Automatically collected data: Through the use of cookies,
            tracking technologies, and analytics tools.
            <br />
            <b>4. Purposes of Data Collection</b>
            <br />
            We collect and use personal data for the following purposes:
            <br />
            • To provide and maintain the Service.
            <br />
            • To improve the user experience and optimize our Service.
            <br />
            • To communicate with you and respond to your inquiries.
            <br />
            • To send you newsletters, marketing materials, and updates about
            our Service.
            <br />
            • To conduct research and analysis on user behavior and preferences,
            which may include analyzing aggregated data to identify trends and
            patterns.
            <br />
            • To comply with legal obligations and enforce our policies.
            <br />
            <b>5. Data Usage and Sharing</b>
            <br />
            We may share your personal data with third-party service providers,
            affiliates, and partners for the purposes outlined in this Privacy
            Policy. We do not sell, trade, or rent your personal data to third
            parties for marketing purposes.
            <br />
            <b>6. User Rights</b>
            <br />
            You have the right to access, correct, or delete your personal data.
            You may also request that we restrict the processing of your data or
            object to its processing under certain circumstances. To exercise
            these rights, please contact us using the information provided
            below.
            <br />
            7. Data Security Measures
            <br />
            We implement security measures to protect your personal data from
            unauthorized access, disclosure, alteration, or destruction.
            However, no method of transmission over the internet or electronic
            storage is 100% secure, and we cannot guarantee absolute security.
            <br />
            <b>8. Data Retention</b>
            We will retain your personal data only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
            <br />
            <b>9. Cookies and Tracking Technologies</b>
            We use cookies and similar technologies to track user activity and
            preferences, improve our Service, and personalize your experience.
            You may choose to set your browser to refuse cookies or alert you
            when cookies are being sent. However, some parts of the Service may
            not function properly without cookies.
            <br />
            <b>10. Third-Party Links</b>
            <br />
            Our Service may contain links to third-party websites or services
            that are not operated by us. We have no control over and assume no
            responsibility for the content, privacy policies, or practices of
            any third-party sites or services.
            <br />
            <b>11. International Data Transfers</b>
            <br />
            Your personal data may be transferred to and processed in countries
            outside of your jurisdiction, where data protection laws may differ
            from those in your country. By using our Service, you consent to
            such transfers.
            <br />
            <b>12. Changes to the Privacy Policy</b>
            <br />
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date. You are advised to
            review this Privacy Policy periodically for any changes.
            <br />
            <b>13. Contact Information</b>
            <br />
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or the handling of your personal data, please contact
            us at:
            <br />
            hello@amoro.ai
            <br />
            <br />
          </p>
        </div>
      </div>
    </Box>
  );
};

export default PrivacyComponent;
