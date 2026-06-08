const axios = require('axios');
async function test() {
  const token = 'EAAdoUKg0ZCTYBRvs7aUvZBsr7x7D3kPd6LvG0diDi4VScYnu89LneEhZCWhl9NNP0YYkUlRyRVkLs0XXKcgjquRuQSykWNLar2QqyBoZBpJyZBC9fnF3yYqGCVfNZC50nsw5Gvw1afSr4itcIfZAetngEfqVvV6ILZBVNirN8DpCngLPxoPNZC8GcDr7uZCJrBdyPgImqUN1Vh';
  try {
    const res = await axios.get('https://graph.facebook.com/v21.0/1111932568671242/leadgen_forms?access_token=' + token);
    console.log('SUCCESS!');
    console.log(res.data);
  } catch (err) {
    console.log('FAILED!');
    console.log(err.response?.data || err.message);
  }
}
test();
