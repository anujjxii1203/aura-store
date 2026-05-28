const Preloader = () => {
  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      animation: 'pageGlideIn 0.5s ease'
    }}>
      <div className="spinner"></div>
      <h2 style={{ 
        marginTop: '25px', 
        fontSize: '14px', 
        fontWeight: '900', 
        letterSpacing: '6px', 
        color: 'var(--ss-dark)', 
        animation: 'pulseText 1.5s infinite ease-in-out' 
      }}>
        LOADING DRIP
      </h2>
    </div>
  );
};

export default Preloader;
