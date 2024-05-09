import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Container, Grid } from '@mui/material';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import { useRouter } from 'next/router';

export default function Templates() {
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const templates = [
    {
      title: 'Standard Layout',
      description: 'Emailer with key messaging, data, clinical studies.',
      image: '/img/standard.png',
      href: '/copy-generator',
    },
    {
      title: 'Video Layout',
      description: 'Recordings of events, product demo, trailers etc',
      image: '/img/video.png',
      href: '/video-email-generator',
    },
    {
      title: 'Events Invitation Layout',
      description: 'Got an upcoming event that you like to invite your HCP?',
      image: '/img/event.png',
      href: '/speaker-email-generator',
    },
  ];

  return (
    <React.Fragment>
      <header style={{ display: 'flex', justifyContent: 'center', marginTop: mobile ? "20px" : '0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '24px',
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'start',
            backgroundColor:'#f9fafb',
          }}
        >
            <Link href={'/home'} style={{ textDecoration: 'none', color: '#000', display:'flex' , justifyContent:'center' , alignItems:'center', gap:'12px', cursor:'pointer'}}>
              <img src='/img/back-icon.png' height={16}/>
              <div style={{fontSize: mobile ? 16 : 24, fontWeight:700, fontFamily:'inter'}}>Select Layout</div>
            </Link>
            
          {/* <img
            style={{ width: '300px', height: 'auto' }}
            src="/amoro-logo.png"
            alt="Logo"
          />
          <div style={{ flexGrow: 1 }} />
          <Link
            className={styles.raise}
            style={{
              textDecoration: 'none',
              color: '#000',
              margin: 5,
              marginRight: 20,
            }}
            href="/"
          >
            Home
          </Link>
          <a
            className={styles.raise}
            style={{
              textDecoration: 'none',
              color: '#000',
              margin: 5,
              marginLeft: 20,
              marginRight: width > 1200 ? '130px' : 0,
            }}
            href="mailto:contactreiainow@gmail.com"
          >
            Contact Us
          </a> */}
        </div>
      </header>
      <Container
        maxWidth="lg"
        sx={{
          marginBottom: '20px',
          paddingBottom: '64px',
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          lg={12}
          xl={12}
          my={6}
          textAlign="center"
        >
          <Typography variant="h3" fontSize={mobile ? 24 : 36 } fontWeight={800} fontFamily={'inter'}  gutterBottom>
            Select layout
          </Typography>
          <Typography variant="body1" gutterBottom fontFamily={'inter'} color={"#6B7280"}>
            You can create emailers with different templates according to your needs.
          </Typography>
        </Grid>

        <Grid
          container
          item
          xs={12}
          md={12}
          sm={12}
          lg={12}
          xl={12}
          spacing={4}
          justifyContent="center"
        >
          {templates.map(({ title, description, image, href }, index) => (
            <Grid
              item
              xs={12}
              md={6}
              sm={8}
              lg={4}
              xl={4}
              key={index}
              sx={{ position: 'relative' }}
            >
              <TemplateCard
                title={title}
                description={description}
                image={image}
                href={href}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}

type CardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
};

function TemplateCard({ title, description, image, href }: CardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleButtonCreate = (url: string) => {
    setIsLoading(true);
    router.push(url);
  };
  return (
    <>
    {isLoading && <ProgressBar message="Get ready to create your masterpiece" open={isLoading} handleClose={() => {}}/>}
    <Card
      sx={{
        height: '100%',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
        padding: '8px',
        boxSizing: 'border-box',
        background: '#ffffff',
        border: '1px solid #F9FAFB',
        justifyContent: 'space-between',
        borderRadius: '8px',
      }}
    >
      <CardContent
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* <Link href={href} style={{ textDecoration: 'none', color: '#000'}}> */}
        <CardMedia
          component="img"
          image={image}
          style={{ marginBottom: '10px' }}
        />
        <div
          style={{
            width: '100%',
            backgroundColor: '#F9FAFB',
            height: '1px',
            marginBottom: '5px',
          }}
        />
        <CardContent sx={{ padding: 0 }}>
          <Typography
            gutterBottom
            variant="h5"
            fontWeight={700}
            fontFamily={'inter'}
            component="div"
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontFamily={'inter'}
          >
            {description}
          </Typography>
        </CardContent>
        <Link onClick={() => handleButtonCreate(href)} href={href} style={{ textDecoration: 'none', color: '#000' }}>
        <CardContent
          style={{ width: '100%', padding: 0, marginBottom: '40px' }}
        >
            <Button
              variant="contained"
              style={{
                width: '100%',
                textTransform: 'none',
                borderRadius: '8px',
                fontFamily: 'inter',
                fontWeight: 400,
                padding: '10px 6px',
              }}
            >
              Make Template
            </Button>
        </CardContent>
          </Link>
        {/* </Link> */}
      </CardContent>
    </Card>
    </>
  );
}
