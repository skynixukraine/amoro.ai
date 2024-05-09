import axios from 'axios';

axios.defaults.headers.common['x-api-key'] = process.env.NEXT_PUBLIC_API_KEY;
axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:4000';

export default axios;
