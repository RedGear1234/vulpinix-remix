const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('https://vulpinix-backend.onrender.com/api/social/auth/facebook', {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
  } catch (err) {
    console.log('Redirect location:', err.response?.headers?.location);
  }
}
test();
