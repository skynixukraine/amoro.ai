import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import classes from './DesktopAdminLayout.module.css';
import Link from 'next/link';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import StyledInput, { styledInputPropsSx } from '../StyledInput';
import useWindowSize from '@/hooks/useWindowSize';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const drawerWidth = 250;

const HomeIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_55_26515)">
      <path
        d="M19.7189 9.29289L17.7165 7.29286L10.7079 0.292789C10.5201 0.105316 10.2655 0 10 0C9.73451 0 9.47989 0.105316 9.29213 0.292789L2.28352 7.29286L0.281057 9.29289C0.098675 9.48149 -0.00224337 9.73409 3.78491e-05 9.99629C0.00231907 10.2585 0.107617 10.5093 0.293254 10.6947C0.47889 10.8801 0.730011 10.9853 0.99253 10.9876C1.25505 10.9899 1.50796 10.8891 1.6968 10.7069L1.99016 10.4139V18C1.99016 18.5304 2.20113 19.0391 2.57666 19.4142C2.9522 19.7893 3.46153 20 3.99262 20H6.99631C7.26185 20 7.51652 19.8946 7.70429 19.7071C7.89205 19.5196 7.99754 19.2652 7.99754 19V14.9999C7.99754 14.7347 8.10303 14.4804 8.29079 14.2928C8.47856 14.1053 8.73323 13.9999 8.99877 13.9999H11.0012C11.2668 13.9999 11.5214 14.1053 11.7092 14.2928C11.897 14.4804 12.0025 14.7347 12.0025 14.9999V19C12.0025 19.2652 12.1079 19.5196 12.2957 19.7071C12.4835 19.8946 12.7381 20 13.0037 20H16.0074C16.5385 20 17.0478 19.7893 17.4233 19.4142C17.7989 19.0391 18.0098 18.5304 18.0098 18V10.4139L18.3032 10.7069C18.492 10.8891 18.7449 10.9899 19.0075 10.9876C19.27 10.9853 19.5211 10.8801 19.7067 10.6947C19.8924 10.5093 19.9977 10.2585 20 9.99629C20.0022 9.73409 19.9013 9.48149 19.7189 9.29289Z"
        fill="#9CA3AF"
      />
    </g>
    <defs>
      <clipPath id="clip0_55_26515">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const PieChartIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_51_26036)">
      <path
        d="M15.7895 10.5263H9.47369V4.21053C9.47369 3.93135 9.36278 3.66361 9.16538 3.4662C8.96797 3.2688 8.70023 3.15789 8.42105 3.15789C6.75553 3.15789 5.1274 3.65178 3.74257 4.5771C2.35773 5.50241 1.27839 6.8176 0.641018 8.35635C0.00364868 9.89509 -0.163116 11.5883 0.161812 13.2218C0.48674 14.8553 1.28877 16.3558 2.46647 17.5335C3.64418 18.7112 5.14467 19.5133 6.77819 19.8382C8.41171 20.1631 10.1049 19.9964 11.6437 19.359C13.1824 18.7216 14.4976 17.6423 15.4229 16.2574C16.3482 14.8726 16.8421 13.2445 16.8421 11.5789C16.8421 11.2998 16.7312 11.032 16.5338 10.8346C16.3364 10.6372 16.0686 10.5263 15.7895 10.5263Z"
        fill="#9CA3AF"
      />
      <path
        d="M11.5789 0C11.2998 0 11.032 0.110902 10.8346 0.308309C10.6372 0.505715 10.5263 0.773456 10.5263 1.05263V8.42105C10.5263 8.70023 10.6372 8.96797 10.8346 9.16537C11.032 9.36278 11.2998 9.47368 11.5789 9.47368H18.9474C19.2265 9.47368 19.4943 9.36278 19.6917 9.16537C19.8891 8.96797 20 8.70023 20 8.42105C19.9975 6.18842 19.1095 4.04795 17.5308 2.46924C15.9521 0.890528 13.8116 0.00250748 11.5789 0Z"
        fill="#9CA3AF"
      />
    </g>
    <defs>
      <clipPath id="clip0_51_26036">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const UsersIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_51_26042)">
      <path
        d="M6.5 9.47368C8.98528 9.47368 11 7.35293 11 4.73684C11 2.12076 8.98528 0 6.5 0C4.01472 0 2 2.12076 2 4.73684C2 7.35293 4.01472 9.47368 6.5 9.47368Z"
        fill="#9CA3AF"
      />
      <path
        d="M8 10.5263H5C3.67441 10.528 2.40356 11.083 1.46622 12.0697C0.528882 13.0564 0.00158786 14.3941 0 15.7895V18.9474C0 19.2265 0.105357 19.4943 0.292893 19.6917C0.48043 19.8891 0.734784 20 1 20H12C12.2652 20 12.5196 19.8891 12.7071 19.6917C12.8946 19.4943 13 19.2265 13 18.9474V15.7895C12.9984 14.3941 12.4711 13.0564 11.5338 12.0697C10.5964 11.083 9.32559 10.528 8 10.5263Z"
        fill="#9CA3AF"
      />
      <path
        d="M10.169 7.46105C10.7084 6.66602 10.9988 5.71378 11 4.73684C10.9979 4.38998 10.9596 4.04441 10.886 3.70631C10.4787 4.21972 10.1998 4.83212 10.0746 5.48785C9.9494 6.14359 9.98184 6.82187 10.169 7.46105Z"
        fill="#9CA3AF"
      />
      <path
        d="M14 2.10526C13.521 2.10912 13.0467 2.20434 12.6 2.38632C13.0113 3.5517 13.1101 4.81373 12.8856 6.03427C12.6611 7.25481 12.1219 8.3868 11.327 9.30632C11.7755 9.56805 12.1957 9.88042 12.58 10.2379C13.0325 10.425 13.5139 10.5228 14 10.5263C15.0609 10.5263 16.0783 10.0827 16.8284 9.29308C17.5786 8.50346 18 7.43249 18 6.31579C18 5.19909 17.5786 4.12812 16.8284 3.3385C16.0783 2.54887 15.0609 2.10526 14 2.10526Z"
        fill="#9CA3AF"
      />
      <path
        d="M15 11.5789H13.723C14.5515 12.81 14.9976 14.2808 15 15.7895V18.9474C14.9968 19.3068 14.9345 19.6629 14.816 20H19C19.2652 20 19.5196 19.8891 19.7071 19.6917C19.8946 19.4943 20 19.2265 20 18.9474V16.8421C19.9984 15.4467 19.4711 14.109 18.5338 13.1223C17.5964 12.1357 16.3256 11.5806 15 11.5789Z"
        fill="#9CA3AF"
      />
    </g>
    <defs>
      <clipPath id="clip0_51_26042">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const ShieldIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_51_26046)">
      <path
        d="M18.5063 3.0627L10.3582 0.0626497C10.1281 -0.0208832 9.87523 -0.0208832 9.64519 0.0626497L1.49704 3.0627C1.30239 3.13387 1.13456 3.26178 1.01605 3.42925C0.897538 3.59673 0.83401 3.79578 0.833984 3.99972C0.863639 7.12861 1.66368 10.204 3.16585 12.9637C4.66803 15.7233 6.82776 18.0852 9.46084 19.848C9.62271 19.9473 9.80976 20 10.0007 20C10.1915 20 10.3786 19.9473 10.5405 19.848C13.1735 18.0852 15.3333 15.7233 16.8355 12.9637C18.3376 10.204 19.1377 7.12861 19.1673 3.99972C19.1674 3.79602 19.1042 3.59714 18.9861 3.42969C18.868 3.26224 18.7006 3.1342 18.5063 3.0627Z"
        fill="#9CA3AF"
      />
    </g>
    <defs>
      <clipPath id="clip0_51_26046">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const WalletIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_51_26050)">
      <path
        d="M11.4667 3.94487L8.54223 0.404176C8.44886 0.292004 8.33311 0.198982 8.20182 0.130597C8.07053 0.0622123 7.92635 0.0198496 7.77778 0.00600829C7.47949 -0.0198924 7.18269 0.0689991 6.95223 0.253258L2.41223 3.94487H11.4667Z"
        fill="#9CA3AF"
      />
      <path
        d="M8.88889 13.5779V12.5076C8.88889 11.3721 9.35714 10.2831 10.1906 9.48022C11.0241 8.67731 12.1546 8.22624 13.3333 8.22624H18.8889V7.15589C18.8889 6.87202 18.7718 6.59978 18.5635 6.39905C18.3551 6.19832 18.0725 6.08555 17.7778 6.08555H1.11111C0.816426 6.08555 0.533811 6.19832 0.325437 6.39905C0.117063 6.59978 0 6.87202 0 7.15589V18.9297C0 19.2135 0.117063 19.4858 0.325437 19.6865C0.533811 19.8872 0.816426 20 1.11111 20H17.7778C18.0725 20 18.3551 19.8872 18.5635 19.6865C18.7718 19.4858 18.8889 19.2135 18.8889 18.9297V17.8593H13.3333C12.1546 17.8593 11.0241 17.4082 10.1906 16.6053C9.35714 15.8024 8.88889 14.7134 8.88889 13.5779Z"
        fill="#9CA3AF"
      />
      <path
        d="M18.8889 10.3669H13.3333C12.744 10.3669 12.1787 10.5925 11.762 10.9939C11.3452 11.3954 11.1111 11.9399 11.1111 12.5076V13.5779C11.1111 14.1457 11.3452 14.6902 11.762 15.0916C12.1787 15.4931 12.744 15.7186 13.3333 15.7186H18.8889C19.1836 15.7186 19.4662 15.6059 19.6746 15.4051C19.8829 15.2044 20 14.9322 20 14.6483V11.4373C20 11.1534 19.8829 10.8811 19.6746 10.6804C19.4662 10.4797 19.1836 10.3669 18.8889 10.3669ZM15 14.1131C14.7802 14.1131 14.5654 14.0503 14.3827 13.9327C14.2 13.8151 14.0576 13.648 13.9735 13.4524C13.8894 13.2568 13.8674 13.0416 13.9102 12.834C13.9531 12.6263 14.0589 12.4356 14.2143 12.2859C14.3697 12.1362 14.5677 12.0343 14.7832 11.993C14.9988 11.9517 15.2222 11.9729 15.4252 12.0539C15.6282 12.1349 15.8018 12.2721 15.9239 12.4481C16.0459 12.6241 16.1111 12.8311 16.1111 13.0428C16.1111 13.3266 15.994 13.5989 15.7857 13.7996C15.5773 14.0004 15.2947 14.1131 15 14.1131Z"
        fill="#9CA3AF"
      />
      <path
        d="M13.07 3.94487H15.9111L12.9867 0.404174C12.8031 0.181902 12.5353 0.0389883 12.2424 0.00687181C11.9494 -0.0252447 11.6552 0.0560672 11.4244 0.23292C11.1937 0.409772 11.0453 0.667678 11.012 0.949902C10.9787 1.23213 11.0631 1.51555 11.2467 1.73782L13.07 3.94487Z"
        fill="#9CA3AF"
      />
    </g>
    <defs>
      <clipPath id="clip0_51_26050">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DollarIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.3834 8.73201C9.34887 8.52343 8.4399 7.96244 7.84123 7.163C7.74515 7.03643 7.6782 6.89332 7.64445 6.74235C7.61071 6.59139 7.61087 6.43573 7.64494 6.28482C7.94044 5.30907 9.60894 4.76558 11.223 5.12465C11.9758 5.27645 12.6582 5.63899 13.1753 6.16188C13.3111 6.30951 13.4775 6.43113 13.6649 6.51974C13.8523 6.60835 14.0569 6.6622 14.2672 6.67819C14.4774 6.69418 14.689 6.67199 14.8898 6.61291C15.0906 6.55383 15.2767 6.45901 15.4373 6.33392C15.5979 6.20883 15.7299 6.05593 15.8256 5.88402C15.9214 5.7121 15.979 5.52457 15.9953 5.3322C16.0115 5.13983 15.986 4.94643 15.9202 4.76311C15.8544 4.57979 15.7496 4.41019 15.6119 4.26404C14.6586 3.27317 13.3904 2.57988 11.9847 2.28131C11.8994 2.26179 11.8162 2.25984 11.7308 2.24423V1.46363C11.7308 1.07545 11.5622 0.703171 11.2621 0.428687C10.962 0.154203 10.555 0 10.1306 0C9.70621 0 9.29919 0.154203 8.99909 0.428687C8.69899 0.703171 8.53039 1.07545 8.53039 1.46363V2.26765C7.61092 2.4295 6.75646 2.8159 6.0576 3.38588C5.35873 3.95585 4.84152 4.68817 4.56078 5.5052C4.4117 6.03349 4.38096 6.58391 4.47043 7.12334C4.5599 7.66278 4.76771 8.1801 5.08138 8.64419C6.11359 10.1307 7.74707 11.1831 9.62494 11.5714C10.6599 11.7803 11.569 12.3421 12.1672 13.1424C12.2634 13.2689 12.3305 13.412 12.3644 13.563C12.3983 13.7139 12.3984 13.8696 12.3645 14.0206C12.0669 14.9963 10.3973 15.5379 8.78536 15.1808C8.02492 15.029 7.3366 14.6607 6.81922 14.1289C6.54564 13.8347 6.156 13.6513 5.73521 13.6187C5.31443 13.5861 4.89662 13.707 4.57285 13.955C4.24909 14.2029 4.04562 14.5579 4.00678 14.9425C3.96795 15.3271 4.09691 15.7102 4.36555 16.0082C5.32254 17.0184 6.60519 17.7249 8.02899 18.0261C8.19541 18.0631 8.36077 18.0817 8.52719 18.109V18.5364C8.52719 18.9245 8.69579 19.2968 8.99589 19.5713C9.29599 19.8458 9.70301 20 10.1274 20C10.5518 20 10.9588 19.8458 11.2589 19.5713C11.559 19.2968 11.7276 18.9245 11.7276 18.5364V17.9948C12.5977 17.8043 13.3985 17.4098 14.0511 16.8501C14.7038 16.2905 15.1858 15.585 15.4497 14.8031C15.5985 14.2748 15.6289 13.7243 15.5393 13.1849C15.4497 12.6455 15.2418 12.1282 14.9281 11.6641C13.8963 10.1759 12.2624 9.12175 10.3834 8.73201Z"
      fill="#9CA3AF"
    />
  </svg>
);

const BookIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 2.90173C7.06 2.21613 1.646 0.88874 0.293 2.27114C0.107156 2.46039 0.00190241 2.71656 0 2.98425V15.922C4.45921e-06 16.1008 0.0462139 16.2765 0.133984 16.4313C0.221754 16.5862 0.347993 16.7148 0.500011 16.8042C0.652029 16.8936 0.824472 16.9407 1.00001 16.9407C1.17554 16.9407 1.34798 16.8936 1.5 16.8042C2.559 16.5088 7.765 17.5927 9 18.3323V2.90173Z"
      fill="#9CA3AF"
    />
    <path
      d="M19.707 2.27114C18.353 0.889759 12.94 2.21613 11 2.90173V18.3333C12.234 17.5937 17.436 16.5108 18.5 16.8052C18.6521 16.8947 18.8246 16.9417 19.0002 16.9417C19.1759 16.9416 19.3484 16.8945 19.5004 16.805C19.6525 16.7154 19.7787 16.5867 19.8664 16.4317C19.9541 16.2767 20.0002 16.1009 20 15.922V2.98425C19.9981 2.71656 19.8928 2.46039 19.707 2.27114Z"
      fill="#9CA3AF"
    />
  </svg>
);

const BellIcon = (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_43_3619)">
      <path
        d="M16.1106 11.9197V10.0249C16.1113 8.74437 15.6236 7.50099 14.7262 6.49587C13.8288 5.49075 12.5742 4.78265 11.1653 4.48608C11.176 4.44934 11.1844 4.41208 11.1903 4.3745V1.88611C11.1903 1.60694 11.0649 1.3392 10.8416 1.1418C10.6184 0.944397 10.3156 0.833496 9.99984 0.833496C9.6841 0.833496 9.3813 0.944397 9.15804 1.1418C8.93479 1.3392 8.80936 1.60694 8.80936 1.88611V4.3745C8.81528 4.41208 8.82363 4.44934 8.83436 4.48608C7.42545 4.78265 6.17085 5.49075 5.27346 6.49587C4.37606 7.50099 3.88833 8.74437 3.88912 10.0249V11.9197C3.88912 14.4312 1.6665 15.0586 1.6665 16.3143C1.6665 16.9385 1.6665 17.5701 2.30698 17.5701H17.6927C18.3332 17.5701 18.3332 16.9385 18.3332 16.3143C18.3332 15.0586 16.1106 14.4312 16.1106 11.9197Z"
        fill="#6B7280"
      />
      <path
        d="M6.21769 18.6227C6.5335 19.2785 7.06042 19.8378 7.73289 20.2308C8.40536 20.6239 9.1937 20.8335 9.99984 20.8335C10.806 20.8335 11.5943 20.6239 12.2668 20.2308C12.9393 19.8378 13.4662 19.2785 13.782 18.6227H6.21769Z"
        fill="#6B7280"
      />
    </g>
    <defs>
      <clipPath id="clip0_43_3619">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.833496)"
        />
      </clipPath>
    </defs>
  </svg>
);
// ?dfjdkf

const SearchIcon = (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_55_26500)">
      <path
        d="M8.0001 16.5C6.41783 16.5 4.87109 16.0308 3.55548 15.1518C2.23987 14.2727 1.21448 13.0233 0.608974 11.5615C0.00346629 10.0997 -0.154962 8.49112 0.153723 6.93928C0.462409 5.38743 1.22434 3.96197 2.34318 2.84315C3.46201 1.72433 4.88749 0.962403 6.43936 0.653721C7.99122 0.34504 9.59977 0.503466 11.0616 1.10897C12.5234 1.71447 13.7729 2.73985 14.6519 4.05544C15.531 5.37103 16.0002 6.91775 16.0002 8.5C15.9978 10.621 15.1542 12.6544 13.6544 14.1542C12.1546 15.654 10.1211 16.4976 8.0001 16.5ZM8.0001 2.5C6.8134 2.5 5.65334 2.8519 4.66664 3.51118C3.67993 4.17047 2.91089 5.10754 2.45675 6.2039C2.00262 7.30026 1.8838 8.50665 2.11532 9.67054C2.34683 10.8344 2.91828 11.9035 3.75741 12.7426C4.59653 13.5818 5.66564 14.1532 6.82954 14.3847C7.99344 14.6162 9.19985 14.4974 10.2962 14.0433C11.3926 13.5891 12.3297 12.8201 12.989 11.8334C13.6483 10.8467 14.0002 9.68669 14.0002 8.5C13.9986 6.90919 13.3659 5.38399 12.241 4.25912C11.1161 3.13424 9.59093 2.50159 8.0001 2.5Z"
        fill="#6B7280"
      />
      <path
        d="M19.0002 20.5C18.735 20.4999 18.4807 20.3946 18.2932 20.207L14.2931 16.207C14.111 16.0184 14.0102 15.7658 14.0125 15.5036C14.0147 15.2414 14.1199 14.9906 14.3053 14.8052C14.4907 14.6198 14.7416 14.5146 15.0038 14.5123C15.266 14.51 15.5186 14.6108 15.7072 14.793L19.7072 18.793C19.847 18.9329 19.9422 19.111 19.9808 19.305C20.0194 19.4989 19.9996 19.7 19.9239 19.8827C19.8482 20.0654 19.7201 20.2215 19.5557 20.3314C19.3913 20.4413 19.198 20.5 19.0002 20.5Z"
        fill="#6B7280"
      />
    </g>
    <defs>
      <clipPath id="clip0_55_26500">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

const TimerIcon = (
  <svg width="26"
  height="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M112.91 128A191.85 191.85 0 0064 254c-1.18 106.35 85.65 193.8 192 194 106.2.2 192-85.83 192-192 0-104.54-83.55-189.61-187.5-192a4.36 4.36 0 00-4.5 4.37V152" fill="#9CA3AF" stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/><path d="M233.38 278.63l-79-113a8.13 8.13 0 0111.32-11.32l113 79a32.5 32.5 0 01-37.25 53.26 33.21 33.21 0 01-8.07-7.94z"/></svg>
  );

type LayoutType = { children: React.ReactNode };

const DesktopAdminLayout: React.FC<LayoutType> = ({ children }) => {
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'white',
          borderBottom: '1px solid #F9FAFB',
        }}
        elevation={0}
      >
        <Toolbar style={{ display: 'flex' }}>
          <div style={{ width: '226px' }}>
            <img src="/amoro-logo.png" width={106} height={'auto'} />
          </div>
          <TextField
            placeholder="Search"
            sx={{ flexGrow: 1 }}
            InputProps={{
              sx: { ...styledInputPropsSx, height: '35px' },
              startAdornment: (
                <InputAdornment position="start">{SearchIcon}</InputAdornment>
              ),
            }}
          />
          <IconButton sx={{ marginLeft: '40px' }}>{BellIcon}</IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.container}
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'white',
            borderRight: '1px solid #F9FAFB',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', height: '100%', position: 'relative' }}>
          <List>
            <Link href="/admin">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{HomeIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Dashboard'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/insights">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{PieChartIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Insights'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/users">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{UsersIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Users'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/access">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{ShieldIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Admin Access'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/revenues">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{WalletIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Revenue & Billing'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/quotations">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{WalletIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Quotations'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/work-statements">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{WalletIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Work statements'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/pricing">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{DollarIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Pricing'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/admin/blog">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{BookIcon}</ListItemIcon>
                  <ListItemText
                    primary={'Manage Blog'}
                    classes={{ primary: classes.listItemText }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',

              position: 'absolute',
              bottom: '16px',
            }}
          >
            <Button
              sx={{
                textTransform: 'none',
                color: '#E02424',
              }}
              startIcon={<LogoutIcon />}
              onClick={async () => {
                await signOut();
                router.push('/admin/login');
              }}
            >
              Log out
            </Button>
          </div>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

const MobileAdminLayout: React.FC<LayoutType> = ({ children }) => {
  const router = useRouter();

  const handleNavigate = (e: SelectChangeEvent<string>) => {
    if (e.target.value === 'logout') {
      signOut();
      router.push('/admin/login');
      return;
    }
    router.push(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', maxWidth: '100vw' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'white',
          borderBottom: '1px solid #F9FAFB',
          maxWidth: '100%',
        }}
        elevation={0}
      >
        <Toolbar
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 16px 12px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <img src="/amoro-logo.png" width={128} height={'auto'} />

            <IconButton sx={{ marginLeft: '40px' }}>{BellIcon}</IconButton>
          </div>
          <TextField
            fullWidth
            placeholder="Search"
            InputProps={{
              sx: { ...styledInputPropsSx, height: '45px' },
              startAdornment: (
                <InputAdornment position="start">{SearchIcon}</InputAdornment>
              ),
            }}
          />
          {[
            '/admin',
            '/admin/insights',
            '/admin/users',
            '/admin/access',
            '/admin/revenues',
            '/admin/quotations',
            '/admin/work-statements',
            '/admin/pricing',
            '/admin/blog',
          ].includes(router.pathname) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                // maxWidth: '80vw',
              }}
            >
              <Select
                value={router.pathname}
                onChange={handleNavigate}
                variant="standard"
                input={<StyledInput />}
                fullWidth
              >
                <MenuItem value="/admin">Dashboard</MenuItem>
                <MenuItem value="/admin/insights">Insights</MenuItem>
                <MenuItem value="/admin/users">Users</MenuItem>
                <MenuItem value="/admin/access">Admin Access</MenuItem>
                <MenuItem value="/admin/revenues">Revenues</MenuItem>
                <MenuItem value="/admin/quotations">Quotations</MenuItem>
                <MenuItem value="/admin/work-statements">
                  Work Statements
                </MenuItem>
                <MenuItem value="/admin/pricing">Pricing</MenuItem>
                <MenuItem value="/admin/blog">Blog</MenuItem>
                <MenuItem value="logout">Logout</MenuItem>
              </Select>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: '24px',
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
          width: 'calc(100vw - 48px)',
        }}
      >
        <Toolbar sx={{ height: '160px' }} />
        {children}
      </Box>
    </Box>
  );
};

export default function AdminLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const sizes = useWindowSize();

  if (!sizes.width)
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );

  if (sizes.width < 768) {
    return <MobileAdminLayout>{children}</MobileAdminLayout>;
  }
  return <DesktopAdminLayout>{children}</DesktopAdminLayout>;
}
