const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  console.log('inside handler')
  console.log('Received request:', req.body);
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;
      console.log("in create checkout session. userId:", userId);

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: process.env.ACCESS_TOKEN_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/payment-result?status=success`,
        cancel_url: `${process.env.DOMAIN}/payment-result?status=cancel`,
        metadata: {
          userId: userId
        }
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

module.exports = handler;
