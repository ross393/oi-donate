export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const { amount, email, name } = JSON.parse(event.body);

    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount.' }),
      };
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    const params = new URLSearchParams();
    params.append('amount', String(Math.round(amount)));
    params.append('currency', 'usd');
    params.append('description', 'Open Invitational Exhibition Support');
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
      throw new Error(data.error?.message || 'Stripe error');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ clientSecret: data.client_secret }),
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
