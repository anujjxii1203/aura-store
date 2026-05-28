import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ label = 'Go Back', className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`back-btn ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};

export default BackButton;
