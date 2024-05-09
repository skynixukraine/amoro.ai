import useWindowSize from '@/hooks/useWindowSize';
import { Box, Button, Table, TableBody, TableCell } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import classes from '@/components/AdminPricingPage.module.css';
import ModalPayWithCard from '@/components/ModalPayWithCard';
import { PriceType } from '@/common/types';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ModalAcountUsage from '@/components/ModalAcountUsage';
import ModalPricing from '@/components/ModalPricing';
import { getServerSession } from 'next-auth';
import axios from '@/common/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const PricingTable: React.FC<{
  prices: Array<PriceType>;
  handleOpenModal: () => void;
  handleChangePackage: (e: string) => void;
}> = ({ prices, handleOpenModal, handleChangePackage }) => {
  let rows = [
    ['All Templates', ...prices.map((price) => price.allTemplates)],
    ['Video Hosting', ...prices.map((price) => price.videoHosting)],
    ['Export to PDF', ...prices.map((price) => price.exportToPdf)],
    ['Export to HTML', ...prices.map((price) => price.exportToHtml)],
    ['Number of user', ...prices.map((price) => 1)],
    // ['Price', ...prices.map((price) => `$${price.price} /${price.billing} months`)],
  ];

  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(
    null
  );
  const [openPricingModal, setOpenPricingModal] = useState(false);
  const handleButtonClick = (idx: number, name: string) => {
    handleChangePackage(name);
    setSelectedButtonIndex(idx);
    setOpenPricingModal(true);
  };
  const titleProps = {
    color: '#111928',
    fontFamily: 'Inter',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '150%',
    paddingTop: '30px',
    paddingBottom: '30px',
  };

  const subtitleProps = {
    color: '#6B7280',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '14px',
  };
  return (
    <>
      {/* <Table className={classes.table} aria-label="simple table">
        <TableHead >
          <TableRow>
            <TableCell
              width={'20%'}
              style={{ fontWeight: 600, fontFamily: 'Inter' }}
            >
              Comparison
            </TableCell>
            {prices.map((price) => (
              <TableCell
                width={'16%'}
                key={price.id}
                style={{ fontWeight: 600, fontFamily: 'Inter', position: 'relative', overflow: 'hidden' }}
              >
                {price.name === "Nhi" && (
                  <div style={{
                    fontSize: "10px", display: "flex", justifyContent: "center", alignItems: "center", transform: "rotate(45deg)", width: "80%",
                    height: "57px", position: "absolute", right: '-90px',
                    zIndex: '1',
                  }}>
                    <div style={{
                      color: 'white',
                      background: 'linear-gradient(90deg, #0F6937, #239867)',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      marginRight: '50px'
                    }}>
                      Best Deals
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", }}>
                  <div style={{ color: '#0F6937' }}>
                    {price.name}
                  </div>
                </div>
                <div >
                  <div style={{ display: "flex" }}>
                    {price?.discountedPrice && <>
                      <span style={{ color: 'red', textDecoration: 'line-through', paddingRight: "4px", fontSize: "12px" }}>{price?.discountedPrice}</span>
                    </>}
                    {price.billing && price.price >= 0 && <span style={{ fontWeight: 600, color: '#858BA0', fontSize: '16px' }}> <span style={{ color: 'black' }}>${price.price}</span> /{price.billing} months</span>}
                  </div>
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row[0].toString()}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

            >
              <TableCell component="th" scope="row" style={{ color: '#6B7280'}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: "10px" }}>
                  {row[0]}
                  {row[0] === 'Number of user' && <InfoRoundedIcon fontSize="small" onClick={handleOpenModal} style={{ color: '#0F6937', cursor: 'pointer' }} />}
                </div>
              </TableCell>

              {row.slice(1).map((value, jindex) => (
                <TableCell
                  style={{ fontWeight: 600 }}
                  key={`${index} - ${jindex}`}

                >
                  <div style={{ display: "flex", position: 'relative'  }}>

                    {typeof value === 'string' || typeof value === 'number'
                      ? (
                        (jindex === 1 && row[0] === 'Price') ? (
                          <div style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                            <span style={{ color: 'red', textDecoration: 'line-through', paddingRight: "4px", fontSize: "14px" }}>$4998</span>
                            <span>{value}</span>
                          </div>
                        ) : value
                      )
                      : value
                        ? CheckedIcon
                        : UncheckedIcon}
                    {
                      (jindex === 1 && row[0] === 'Price') && (
                        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                          <div style={{
                            color: 'rgba(15, 105, 55, 1)', paddingRight: "4px",
                            fontSize: "14px", fontWeight: "500", width: "55px", height: "25px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "8px", font: "14px", backgroundColor: "rgba(15, 105, 55, 0.1)"
                          }}>Best</div>
                        </div>
                      )
                    }
                  </div>

                </TableCell>
              ))}

            </TableRow>
          ))}
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 }  }}
          >
            <TableCell component="th" scope="row" style={{ color: '#6B7280' }}>
              Select Package
            </TableCell>
            {prices.map((item, idx) => (
              <TableCell key={idx}>
                <Button
                  variant={idx === selectedButtonIndex ? 'contained' : 'outlined'}
                  sx={{ textTransform: 'none' }}
                  onClick={() => { handleButtonClick(idx, item.name) }}
                >
                  Select package
                </Button>
              </TableCell>
            )
            )}

          </TableRow>

        </TableBody>
      </Table> */}
      <Table
        className={classes.table}
        sx={{ width: '100% !important' }}
        aria-label="simple table"
      >
        <TableBody style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCell
                sx={titleProps}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  height: '9vh',
                  alignItems: 'center',
                }}
              >
                Pricing table
              </TableCell>
            </div>
            <TableBody style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <TableCell
                  sx={{
                    ...subtitleProps,
                    display: 'flex',
                    height: '3vh',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginLeft: '8px' }}>All Templates</span>
                </TableCell>
              </div>
              <div>
                <TableCell
                  sx={{
                    ...subtitleProps,
                    display: 'flex',
                    height: '3vh',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginLeft: '8px' }}>Video Hosting</span>
                </TableCell>
              </div>
              <div>
                <TableCell
                  sx={{
                    ...subtitleProps,
                    display: 'flex',
                    height: '3vh',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginLeft: '8px' }}>Export to PDF</span>
                </TableCell>
              </div>
              <div>
                <TableCell
                  sx={{
                    ...subtitleProps,
                    display: 'flex',
                    height: '3vh',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginLeft: '8px' }}>Export to HTML</span>
                </TableCell>
              </div>
              <div>
                <TableCell
                  sx={{
                    ...subtitleProps,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    height: '3vh',
                  }}
                >
                  <span style={{ marginLeft: '8px' }}>Number of user</span>
                  <InfoRoundedIcon
                    fontSize="small"
                    onClick={handleOpenModal}
                    style={{ color: '#0F6937', cursor: 'pointer' }}
                  />
                </TableCell>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    padding: '23px',
                    color: '#6B7280',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '14px',
                  }}
                >
                  <span style={{ textAlign: 'center' }}>Select Package</span>
                </div>
              </div>
            </TableBody>
          </div>
          {prices.map((price, idx) => (
            <div
              key={price.id}
              style={{
                border: price?.popular ? '1px solid #0F6937' : 'none',
                boxShadow: price?.popular ? '0 0 10px #0F6937' : 'none',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TableCell
                  sx={titleProps}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '9vh',
                  }}
                >
                  {price?.popular && (
                    <div
                      style={{
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: 'rotate(41deg)',
                        width: '100%',
                        height: '60px',
                        position: 'absolute',
                        right: '-100px',
                        zIndex: '1',
                      }}
                    >
                      <div
                        style={{
                          color: 'white',
                          background:
                            'linear-gradient(90deg, #0F6937, #239867)',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          marginRight: '30px',
                        }}
                      >
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div style={{ color: '#0F6937' }}>{price.name}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex' }}>
                      {price?.discountedPrice > 0 && (
                        <>
                          <span
                            style={{
                              color: 'black',
                              textDecoration: 'line-through',
                              paddingRight: '4px',
                              fontSize: '14px',
                            }}
                          >
                            {'$'}
                            {price?.discountedPrice}
                          </span>
                        </>
                      )}
                      {price.billing && price.price >= 0 && (
                        <span style={{ fontWeight: 600, color: '#858BA0' }}>
                          {' '}
                          <span
                            style={{
                              color:
                                price?.discountedPrice > 0 ? 'red' : 'black',
                            }}
                          >
                            ${price.price}
                          </span>{' '}
                          /{price.billing} months
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <TableCell
                    sx={{
                      ...subtitleProps,
                      display: 'flex',
                      height: '3vh',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {price.allTemplates ? (
                      <img src="/check.svg" alt="" />
                    ) : (
                      <img src="/uncheck.svg" alt="" />
                    )}
                  </TableCell>
                </div>
                <div>
                  <TableCell
                    sx={{
                      ...subtitleProps,
                      display: 'flex',
                      height: '3vh',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {price.videoHosting ? (
                      <img src="/check.svg" alt="" />
                    ) : (
                      <img src="/uncheck.svg" alt="" />
                    )}
                  </TableCell>
                </div>
                <div>
                  <TableCell
                    sx={{
                      ...subtitleProps,
                      display: 'flex',
                      height: '3vh',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {price.exportToPdf ? (
                      <img src="/check.svg" alt="" />
                    ) : (
                      <img src="/uncheck.svg" alt="" />
                    )}
                  </TableCell>
                </div>
                <div>
                  <TableCell
                    sx={{
                      ...subtitleProps,
                      display: 'flex',
                      height: '3vh',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {price.exportToHtml ? (
                      <img src="/check.svg" alt="" />
                    ) : (
                      <img src="/uncheck.svg" alt="" />
                    )}
                  </TableCell>
                </div>
                <div>
                  <TableCell
                    sx={{
                      ...subtitleProps,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '3vh',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {price.id ? (
                        <div style={{ fontWeight: 600, color: '#000' }}>1</div>
                      ) : (
                        <div style={{ fontWeight: 600, color: '#000' }}>1</div>
                      )}
                    </div>
                  </TableCell>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    key={idx}
                    style={{ marginTop: '16px', marginBottom: '16px' }}
                  >
                    <Button
                      variant={
                        idx === selectedButtonIndex ? 'contained' : 'outlined'
                      }
                      sx={{ textTransform: 'none' }}
                      fullWidth
                      onClick={() => {
                        handleButtonClick(idx, price.name);
                      }}
                    >
                      Select package
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TableBody>
      </Table>
      <ModalPricing
        open={openPricingModal}
        setOpen={() => setOpenPricingModal(false)}
        prices={prices}
        selectedButtonIndex={selectedButtonIndex}
      />
    </>
  );
};

const PricingTableMobile: React.FC<{
  prices: Array<PriceType>;
  handleOpenModal: () => void;
  handleChangePackage: (e: string) => void;
}> = ({ prices, handleOpenModal, handleChangePackage }) => {
  const titleProps = {
    color: '#111928',
    fontFamily: 'Inter',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '150%',
    paddingTop: '30px',
    paddingBottom: '30px',
  };

  const subtitleProps = {
    color: '#6B7280',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '14px',
  };
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(
    null
  );
  const [openPricingModal, setOpenPricingModal] = useState(false);

  const handleButtonClick = (idx: number, name: string) => {
    handleChangePackage(name);
    setSelectedButtonIndex(idx);
    setOpenPricingModal(true);
  };

  return (
    <>
      <Table
        className={classes.table}
        sx={{ width: '100% !important' }}
        aria-label="simple table"
      >
        {prices.map((price, idx) => (
          <div
            key={price.id}
            style={{
              border: price.popular ? '1px solid #0F6937' : 'none',
              boxShadow: price.popular ? '0 0 10px #0F6937' : 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCell
                sx={titleProps}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {price.popular && (
                  <div
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: 'rotate(41deg)',
                      width: '80%',
                      height: '57px',
                      position: 'absolute',
                      right: '-100px',
                      zIndex: '1',
                    }}
                  >
                    <div
                      style={{
                        color: 'white',
                        background: 'linear-gradient(90deg, #0F6937, #239867)',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginRight: '15px',
                      }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div style={{ color: '#0F6937' }}>{price.name}</div>
                </div>
                <div>
                  <div style={{ display: 'flex' }}>
                    {price?.discountedPrice && (
                      <>
                        <span
                          style={{
                            color: 'black',
                            textDecoration: 'line-through',
                            paddingRight: '4px',
                            fontSize: '14px',
                          }}
                        >
                          {'$'}
                          {price?.discountedPrice}
                        </span>
                      </>
                    )}
                    {price.billing && price.price >= 0 && (
                      <span style={{ fontWeight: 600, color: '#858BA0' }}>
                        {' '}
                        <span
                          style={{
                            color: price?.discountedPrice > 0 ? 'red' : 'black',
                          }}
                        >
                          ${price.price}
                        </span>{' '}
                        /{price.billing} months
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
            </div>
            <TableBody style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <TableCell sx={{ ...subtitleProps, display: 'flex' }}>
                  {price.allTemplates ? (
                    <img src="/check.svg" alt="" />
                  ) : (
                    <img src="/uncheck.svg" alt="" />
                  )}
                  <span style={{ marginLeft: '8px' }}>All Templates</span>
                </TableCell>
              </div>
              <div>
                <TableCell sx={{ ...subtitleProps, display: 'flex' }}>
                  {price.videoHosting ? (
                    <img src="/check.svg" alt="" />
                  ) : (
                    <img src="/uncheck.svg" alt="" />
                  )}
                  <span style={{ marginLeft: '8px' }}>Video Hosting</span>
                </TableCell>
              </div>
              <div>
                <TableCell sx={{ ...subtitleProps, display: 'flex' }}>
                  {price.exportToPdf ? (
                    <img src="/check.svg" alt="" />
                  ) : (
                    <img src="/uncheck.svg" alt="" />
                  )}
                  <span style={{ marginLeft: '8px' }}>Export to PDF</span>
                </TableCell>
              </div>
              <div>
                <TableCell sx={{ ...subtitleProps, display: 'flex' }}>
                  {price.exportToHtml ? (
                    <img src="/check.svg" alt="" />
                  ) : (
                    <img src="/uncheck.svg" alt="" />
                  )}
                  <span style={{ marginLeft: '8px' }}>Export to HTML</span>
                </TableCell>
              </div>
              <div>
                <TableCell
                  sx={{
                    ...subtitleProps,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {price.id ? (
                      <div style={{ fontWeight: 600, color: '#000' }}>1</div>
                    ) : (
                      <div style={{ fontWeight: 600, color: '#000' }}>1</div>
                    )}
                    <span style={{ marginLeft: '15px' }}>Number of user</span>
                  </div>
                  <InfoRoundedIcon
                    fontSize="small"
                    onClick={handleOpenModal}
                    style={{ color: '#0F6937', cursor: 'pointer' }}
                  />
                </TableCell>
              </div>
              <TableCell key={idx}>
                <Button
                  variant={
                    idx === selectedButtonIndex ? 'contained' : 'outlined'
                  }
                  sx={{ textTransform: 'none' }}
                  fullWidth
                  onClick={() => {
                    handleButtonClick(idx, price.name);
                  }}
                >
                  Select package
                </Button>
              </TableCell>
            </TableBody>
          </div>
        ))}
      </Table>
      <ModalPricing
        open={openPricingModal}
        setOpen={() => setOpenPricingModal(false)}
        prices={prices}
        selectedButtonIndex={selectedButtonIndex}
      />
    </>
  );
};

export default function PricingPage() {
  const router = useRouter();
  // const prices = props.prices.sort((a, b) => (a.index || 0) - (b.index || 0));
  const { data: session, status } = useSession();
  const [openCardModal, setOpenCardModal] = React.useState(false);
  const [openUsageModal, setOpenUsageModal] = React.useState(false);
  const [packageSelected, setPackageSelected] = React.useState<string>();
  const [prices, setPrices] = useState<any>([]);
  useEffect(() => {
    hanldeGetPricing();
  }, []);
  useEffect(() => {
    if (session) {
    } else {
      router.push('/');
    }
  }, []);

  const handleChangePackage = (e: string) => {
    if (e) {
      setPackageSelected(e);
    }
  };
  const hanldeGetPricing = async () => {
    await axios
      .get('/api/pricing')
      .then((res) => {
        setPrices(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sizes = useWindowSize();
  const isMobile = sizes.width && sizes.width < 768;

  const textProps = {
    color: '#111928',
    fontFamily: 'Inter',
    fontSize: isMobile ? '20px' : '32px',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: 'normal',
    padding: isMobile ? '12px 16px' : '24px 32px',
    marginTop: isMobile ? '10px' : '0px',
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F9FAFB',
        minHeight: '100%',
        paddingBottom: '10vh',
      }}
    >
      <div style={textProps}>Select Package</div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: isMobile ? '12px 16px' : '24px 32px',
          marginBottom: '20px',
        }}
      >
        {isMobile ? (
          <PricingTableMobile
            prices={prices}
            handleOpenModal={() => setOpenUsageModal(true)}
            handleChangePackage={handleChangePackage}
          />
        ) : (
          <PricingTable
            prices={prices}
            handleOpenModal={() => setOpenUsageModal(true)}
            handleChangePackage={handleChangePackage}
          />
        )}
      </div>
      {packageSelected && (
        <ModalPayWithCard
          open={openCardModal}
          setOpen={setOpenCardModal}
          packageSelected={packageSelected}
        />
      )}
      <ModalAcountUsage open={openUsageModal} setOpen={setOpenUsageModal} />
    </Box>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // @ts-expect-error
  const session = await getServerSession(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: session?.user.email,
    },
  };
};
