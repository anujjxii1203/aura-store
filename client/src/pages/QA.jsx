import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const faqs = [
  {
    category: 'ORDERS',
    questions: [
      { q: 'How do I place an order?', a: 'Browse our collection, select your size, and add items to your cart. Proceed to checkout, enter your shipping details, and complete payment.' },
      { q: 'Can I modify or cancel my order after placing it?', a: 'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Contact us immediately if you need assistance.' },
      { q: 'How do I track my order?', a: 'Visit the Track Order page from the footer, enter your order ID and email, and view real-time status updates.' },
    ]
  },
  {
    category: 'SHIPPING',
    questions: [
      { q: 'What are the shipping charges?', a: 'Standard shipping is free on orders above ₹999. For orders below ₹999, a flat shipping fee of ₹99 applies.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3–7 business days. Express delivery (1–3 business days) is available at checkout for an additional fee.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. International shipping costs and delivery times are calculated at checkout based on your location.' },
    ]
  },
  {
    category: 'RETURNS & EXCHANGES',
    questions: [
      { q: 'What is your return policy?', a: 'You can return or exchange items within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached.' },
      { q: 'How do I initiate a return?', a: 'Go to the Returns & Exchanges page, click "Start a Return", and follow the instructions. You will receive a prepaid return label via email.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.' },
    ]
  },
  {
    category: 'PAYMENTS & COUPONS',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept UPI, credit/debit cards (Visa, Mastercard, Amex), net banking, and popular wallets like Paytm and PhonePe.' },
      { q: 'How do I apply a coupon code?', a: 'Enter your coupon code in the discount field during checkout and click "Apply". The discount will be reflected in your order total before payment.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All transactions are encrypted and processed through secure payment gateways. We never store your card details on our servers.' },
    ]
  },
  {
    category: 'ACCOUNT',
    questions: [
      { q: 'How do I create an account?', a: 'Click the user icon in the navigation bar and select "Sign Up". You can register with your email and phone number.' },
      { q: 'I forgot my password. What do I do?', a: 'Click "Forgot Password" on the login page, enter your registered email, and follow the instructions to reset your password.' },
      { q: 'How do I delete my account?', a: 'Contact our support team at support@aura-store.com with your registered email. Account deletion requests are processed within 48 hours.' },
    ]
  },
];

const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 0',
      }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>{question}</span>
        {open ? <ChevronUp size={18} color="#999" /> : <ChevronDown size={18} color="#999" />}
      </div>
      {open && (
        <p style={{
          color: '#666', fontSize: '14px', lineHeight: '1.8',
          paddingBottom: '18px', paddingRight: '30px',
        }}>
          {answer}
        </p>
      )}
    </div>
  );
};

const QA = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="FAQ" />
      <BackButton />
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>FREQUENTLY ASKED QUESTIONS</h1>
      <p style={{ color: '#999', fontSize: '12px', fontWeight: '700', marginBottom: '40px' }}>Find answers to common questions</p>

      <div style={{ maxWidth: '800px' }}>
        {faqs.map((section, i) => (
          <div key={i} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '5px', color: '#111' }}>{section.category}</h2>
            <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
              {section.questions.map((item, j) => (
                <AccordionItem key={j} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QA;
