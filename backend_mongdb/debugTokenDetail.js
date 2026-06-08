const axios = require('axios');
async function test() {
  const token = 'EAAdoUKg0ZCTYBRvs7aUvZBsr7x7D3kPd6LvG0diDi4VScYnu89LneEhZCWhl9NNP0YYkUlRyRVkLs0XXKcgjquRuQSykWNLar2QqyBoZBpJyZBC9fnF3yYqGCVfNZC50nsw5Gvw1afSr4itcIfZAetngEfqVvV6ILZBVNirN8DpCngLPxoPNZC8GcDr7uZCJrBdyPgImqUN1Vh';
  const appId = '2085020465691958';
  const appSecret = '5c44a102f074fb018aef61dccc14ed64';
  try {
    const res = await axios.get(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`);
    console.log('Token Details:', res.data.data);
  } catch (err) {
    console.log('Failed debug token:', err.response?.data || err.message);
  }
}
test();
