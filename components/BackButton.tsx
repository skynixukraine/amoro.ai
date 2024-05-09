import useWindowSize from '@/hooks/useWindowSize';
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

const BackButton: React.FC<{
    url: string;
    text: string;
  }> = ({ url, text }) => {
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
    return(
    <div style={{ width: '100%', textAlign: 'left', paddingLeft: 20, paddingTop: 20 }}>
                <Link
                    style={{
                        textDecoration: 'none',
                        color: 'black',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    href={url}
                >
                    <>
                        <ArrowBack />
                        <span style={textProps}>{text}</span>
                    </>
                </Link>
            </div>
)}

export default BackButton;