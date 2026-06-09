import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';

const Drops = () => {
  // Set drop date to 3 days from now for demo purposes
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dropDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(20, 0, 0, 0); // 8 PM drop
    return d.getTime();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = dropDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dropDate]);

  return (
    <main style={{ minHeight: '80vh', background: '#0a0a0a', color: 'white' }}>
      <PageTitle title="Upcoming Drops" />
      <div className="container" style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '950', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '2px' }}>
          LIMITED DROPS
        </h1>
        <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '600px', marginBottom: '50px' }}>
          Exclusive streetwear collections dropping soon. Once they're gone, they're gone. Set your alarms.
        </p>

        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(225,27,35,0.2)' }}>
          <img 
            src="https://images.unsplash.com/photo-1512353087810-258cb228ce9d?auto=format&fit=crop&w=1600&q=80" 
            alt="Upcoming Drop" 
            style={{ width: '100%', height: '500px', objectFit: 'cover', opacity: 0.8 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, transparent 60%)' }} />
          
          <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, padding: '0 20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '5px', textTransform: 'uppercase' }}>
              "Midnight Operations" Cargo Set
            </h2>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#ff4444', marginBottom: '30px' }}>
              Dropping at 8:00 PM IST
            </p>

            {/* Timer */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '15px 20px', borderRadius: '12px', minWidth: '90px' }}>
                  <div style={{ fontSize: '36px', fontWeight: '950', lineHeight: 1 }}>
                    {String(value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#ccc', textTransform: 'uppercase', marginTop: '5px' }}>
                    {unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Drops;
