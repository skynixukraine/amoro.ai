import classes from './Subscription.module.css';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TableFooter,
  TablePagination,
} from '@mui/material';
import moment from 'moment';

export default function Subscription({
  user,
  latestPaidDate,
  nextBillingDate,
}: any) {
  return (
    <Grid className={classes.cardAccount}>
      <div className={classes.card}>
        <h3>Type Account</h3>
        <p>{user?.Pricing?.name || 'Free'}</p>
      </div>

      <div className={classes.card}>
        <h3>Sign up on</h3>
        <p>{user?.createdAt.substring(0, 10)}</p>
      </div>

      <div className={classes.card}>
        <h3>Paid member since</h3>
        <p>{latestPaidDate && moment(latestPaidDate).format('DD/MM/YYYY')}</p>
      </div>

      <div className={classes.card}>
        <h3>Next billing</h3>
        <p>{nextBillingDate && moment(nextBillingDate).format('DD/MM/YYYY')}</p>
      </div>
    </Grid>
  );
}
