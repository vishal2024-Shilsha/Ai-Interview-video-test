import {loadStripe} from '@stripe/stripe-js';

import {
  CheckoutProvider
} from '@stripe/react-stripe-js/checkout';
import CheckoutForm from './CheckoutForm';
import { useEffect, useState } from 'react';
import { base } from '../redux/services/api';

const stripePromise = loadStripe("pk_test_51SiV0sRYoZzPOXjsUyNiLDaFLX2Hz8GJDfhueOoc5cpWLsDabjttNrSrCyrEn3yvfuyjTMBLGcpklmWNdpi8HVF200qWMAt06J");

const CheckoutPage = () => {
   const [clientSecret, setClientSecret] = useState(null);

  // useEffect(() => {
  //   fetch(`${base}/create-checkout-session`, {
  //     method: "POST"
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  useEffect(() => {
    fetch(`${base}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 50000 }), // ₹500
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };

    if (!clientSecret) return <p>Loading...</p>;

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret,elementsOptions:{appearance} }}
      
    >
      <CheckoutForm />
    </CheckoutProvider>
  )
}

export default CheckoutPage;