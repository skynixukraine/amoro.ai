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

const TermsofUseComponent: React.FC<{
  setTermsofUseModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setTermsofUseModal, setOpenSignupModal }) => {
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
            isDesktop && setTermsofUseModal && setOpenSignupModal
              ? () => {
                  setTermsofUseModal(false);
                  setOpenSignupModal(true);
                }
              : () => {}
          }
        >
          <>
            <ArrowBack />
            <span style={textProps}>Terms of Use</span>
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
            <b>Terms of Use</b>
            <br />
            Last updated: 16 March 2024
            <br />
            Metric Media Pte Ltd (&quot;us&quot;, &quot;we&quot;, or
            &quot;our&quot;) operates the Amoro.AI software (hereinafter
            referred to as the &quot;Service&quot;).
            <br />
            <b>1. Introduction</b>
            <br />
            This Terms of Use agreement (the &quot;Agreement&quot;) governs your
            use of the Service. By accessing or using the Service, you agree to
            be bound by this Agreement.
            <br />
            <b>2. Use of the Service</b>
            <br />
            2.1. You must be at least 18 years old to access and use the
            Service.
            <br />
            2.2. You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
            <br />
            2.3. You agree not to use the Service for any unlawful or
            unauthorized purpose, including but not limited to violating any
            applicable laws or regulations.
            <br />
            <b>3. User Responsibility for Content</b>
            <br />
            3.1. Users of the Service are solely responsible for the content
            they create or generate using the Amoro.AI software
            (&quot;Content&quot;). As Amoro.AI is a language model that writes
            content based on user input, users must ensure that all Content
            adheres to applicable compliance, legal, and regulatory obligations.
            <br />
            3.2. While using the Service, users acknowledge that Amoro.AI may,
            on occasion, generate content that does not fully comply with such
            obligations. Users are expected to conduct proper compliance,
            regulatory, and legal screening of all Content generated by Amoro.AI
            before use.
            <br />
            3.3. Metric Media Pte Ltd and the Amoro.AI software bear no
            responsibility for any breach of compliance, legal, or regulatory
            obligations resulting from the use of the Service or the Content
            generated by Amoro.AI. Users agree to hold Metric Media Pte Ltd
            harmless from any liability arising from such breaches.
            <br />
            <b>4. Intellectual Property Rights</b>
            <br />
            4.1. The Service and its original content, features, and
            functionality are owned by Metric Media Pte Ltd and are protected by
            international copyright, trademark, patent, trade secret, and other
            intellectual property or proprietary rights laws.
            <br />
            4.2. You may not modify, reproduce, distribute, create derivative
            works of, publicly display, publicly perform, republish, download,
            store, or transmit any of the material on the Service, except as
            permitted by these Terms or with the prior written consent of Metric
            Media Pte Ltd.
            <br />
            <b>5. User Content</b>
            <br />
            5.1. You retain ownership of any content you submit, post, or
            display on or through the Service (&quot;User Content&quot;). By
            submitting, posting, or displaying User Content, you grant us a
            non-exclusive, worldwide, royalty-free, sublicensable, and
            transferable license to use, reproduce, distribute, prepare
            derivative works of, display, and perform the User Content in
            connection with the Service.
            <br />
            5.2. You represent and warrant that you have all rights necessary to
            grant the licenses granted in this section 5 and that your User
            Content does not violate the rights of any third party.
            <br />
            <b>6. Account Usage Restrictions</b>
            <br />
            6.1. Each user account is restricted to one individual user and may
            not be shared with others. User accounts are for personal use only,
            and users may not resell or transfer their account credentials to
            any other individual or entity.
            <br />
            6.2. User accounts are limited to managing the brands specified
            during registration. Unless otherwise approved by Amoro.AI, each
            user account may manage up to two brands.
            <br />
            6.3. Users are permitted to access the Service on up to three
            devices only. Any additional device access may require prior
            approval from Amoro.AI.
            <br />
            <b>7. Disclaimer of Warranties</b>
            <br />
            7.1. The Service is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, either express or
            implied. We disclaim all warranties, including but not limited to
            implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement.
            <br />
            7.2. We do not warrant that the Service will be uninterrupted,
            secure, or error-free, that defects will be corrected, or that the
            Service or the server that makes it available are free of viruses or
            other harmful components.
            <br />
            7.3. In the event of software downtime, users agree to allow
            Amoro.AI up to 5 working days to rectify the issue. Amoro.AI shall
            have no obligation to provide a refund if the software downtime
            stays within 5 working days from the date of receiving notification
            that the software is down.
            <br />
            <b>8. Limitation of Liability</b>
            <br />
            8.1. In no event shall Metric Media Pte Ltd, its affiliates,
            directors, officers, employees, agents, or licensors be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, including but not limited to loss of profits, data, or
            goodwill, arising from or related to your use of the Service.
            <br />
            <b>9. Governing Law</b>
            <br />
            9.1. These Terms shall be governed by and construed in accordance
            with the laws of [Jurisdiction], without regard to its conflict of
            law principles.
            <br />
            <b>10. Changes to the Terms</b>
            <br />
            10.1. We reserve the right to modify or replace these Terms at any
            time. If a revision is material, we will provide at least 30
            days&apos; notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole
            discretion.
            <br />
            <b>11. Contact Information</b>
            <br />
            If you have any questions, concerns, or requests regarding these
            Terms, please contact us at:
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

export default TermsofUseComponent;
