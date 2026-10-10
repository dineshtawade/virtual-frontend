export const openRazorpayModal = ({
  keyId = 'rzp_test_9876543210AB',
  amount = 1999,
  planName = 'Direct Inventory Base Plan',
  userName = 'Broker User',
  userEmail = 'broker@prime-realty.com',
  userPhone = '+91 98201 44512',
  onSuccess,
  onCancel,
}) => {
  const options = {
    key: keyId || 'rzp_test_9876543210AB',
    amount: Math.round(Number(amount) * 100), // Amount in paise
    currency: 'INR',
    name: 'BrokerSim Platform HQ',
    description: `Subscription: ${planName}`,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    handler: function (response) {
      console.log('Razorpay Payment Success:', response);
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
          razorpay_order_id: response.razorpay_order_id || `order_${Date.now()}`,
          razorpay_signature: response.razorpay_signature || 'sim_sig',
        });
      }
    },
    prefill: {
      name: userName || 'Broker User',
      email: userEmail || 'broker@prime-realty.com',
      contact: userPhone || '+91 98201 44512',
    },
    notes: {
      planName,
      platform: 'BrokerSim Direct Inventory & Pro Plus Engine',
    },
    theme: {
      color: '#2563eb',
    },
    modal: {
      ondismiss: function () {
        if (onCancel) onCancel();
      },
    },
  };

  const launch = () => {
    try {
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK unavailable');
      }
    } catch (err) {
      console.warn('Razorpay SDK launch issue, executing fallback completion:', err);
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_order_id: `order_sim_${Date.now()}`,
        });
      }
    }
  };

  if (window.Razorpay) {
    launch();
  } else {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => launch();
    script.onerror = () => launch();
    document.body.appendChild(script);
  }
};
