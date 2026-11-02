// Vercel serverless function: creates a Stripe PaymentIntent for the
// on-page Stripe Elements card form. Ported from netlify/functions/create-payment-intent.js.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DESCRIPTION =
  'Tax-deductible donation to Open Universe Inc., a 501(c)(3) (EIN 33-1595908). ' +
  'No goods or services were provided in exchange for this contribution.';

module.exports = async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    const { amount, email, name } = body || {};

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    const params = new URLSearchParams();
    params.append('amount', String(Math.round(amount)));
    params.append('currency', 'usd');
    params.append('description', DESCRIPTION);
    params.append('statement_descriptor_suffix', 'DONATION'); // shows as "OU* DONATION"
    params.append('metadata[type]', 'donation');
    if (email) params.append('receipt_email', email);
    if (name)  params.append('metadata[donor_name]', name);
    if (email) params.append('metadata[donor_email]', email);

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + secretKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error((data.error && data.error.message) || 'Stripe error');
    }

    return res.status(200).json({ clientSecret: data.client_secret });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
