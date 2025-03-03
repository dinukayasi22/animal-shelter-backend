const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Adoption = require('../models/Adoption');
const Animal = require('../models/Animal');

const paymentController = {
  createPaymentIntent: async (req, res) => {
    try {
      const { adoptionId } = req.body;
      
      if (!adoptionId) {
        return res.status(400).json({ message: 'Adoption ID is required' });
      }

      const adoption = await Adoption.findById(adoptionId);
      if (!adoption) {
        return res.status(404).json({ message: 'Adoption request not found' });
      }

      // Create payment intent with proper amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 4000 * 100, // Convert LKR 4000 to cents
        currency: 'lkr',
        metadata: {
          adoptionId: adoptionId,
          userId: req.user._id.toString()
        }
      });

      // Save payment intent ID to adoption record
      adoption.paymentIntentId = paymentIntent.id;
      await adoption.save();

      // Send only the client secret to the frontend
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Payment Intent Error:', error);
      res.status(500).json({ 
        message: 'Error creating payment intent',
        error: error.message 
      });
    }
  },

  confirmPayment: async (req, res) => {
    try {
      const { adoptionId, paymentIntentId } = req.body;

      const adoption = await Adoption.findById(adoptionId);
      if (!adoption) {
        return res.status(404).json({ message: 'Adoption request not found' });
      }

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update adoption status
        adoption.paymentStatus = 'completed';
        adoption.status = 'Pending';
        await adoption.save();

        // Update animal status
        const animal = await Animal.findById(adoption.animal);
        if (animal) {
          animal.status = 'Pending';
          await animal.save();
        }

        res.json({ message: 'Payment successful and adoption approved' });
      } else {
        adoption.paymentStatus = 'failed';
        await adoption.save();
        res.status(400).json({ message: 'Payment failed' });
      }
    } catch (error) {
      console.error('Payment Confirmation Error:', error);
      res.status(500).json({ 
        message: 'Error confirming payment',
        error: error.message 
      });
    }
  }
};

module.exports = paymentController; 