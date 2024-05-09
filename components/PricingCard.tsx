import { PriceType } from "@/common/types";
import useWindowSize from "@/hooks/useWindowSize";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function PricingPCard(props: { prices: Array<PriceType>; selectedButtonIndex: number | null }) {
  const { prices, selectedButtonIndex } = props;
  const price = prices[selectedButtonIndex ?? 0]
  const [packageSelected] = React.useState(prices[selectedButtonIndex ?? 0]?.name);
  console.log(packageSelected);
  
  const sizes = useWindowSize();
  const isMobile = sizes.width && sizes.width < 768;
  const smartLink = price?.stripe_link;
  //const premiumLink = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PACKAGE_CHECKOUT_LINK;

  if (!smartLink)
    return <div>Error! The payments links are not configured!</div>;
  const paymentLink = price?.stripe_link
  
  return (
    <Box
    >
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '10px 16px' : '10px 32px', gap: '10px', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', }}>
          <Link href={paymentLink}>
            <Button
              variant="contained"
              fullWidth
              sx={{ textTransform: 'none' }}
              disabled={!packageSelected}
              style={{ backgroundColor: 'rgba(15, 105, 55, 1)', color: 'white' }}
            >
              Pay with card
            </Button>
          </Link>
        </div>
        <div style={{ width: '100%' }}>
          <Link href={`/export-quotation?package=${packageSelected}`}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: 'none' }}
              disabled={!packageSelected}
              style={{ borderColor: 'rgba(15, 105, 55, 1)', color: 'rgba(15, 105, 55, 1)' }}

            >
              Export quotation
            </Button>
          </Link>
        </div>
        <div style={{ width: '100%' }}>
          <Link href={`/request-work-statement?package=${packageSelected}`}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ textTransform: 'none' }}
              disabled={!packageSelected}
              style={{ borderColor: 'rgba(15, 105, 55, 1)', color: 'rgba(15, 105, 55, 1)' }}
            >
              Request work statement
            </Button>
          </Link>
        </div>
      </div>
    </Box>
  );
}