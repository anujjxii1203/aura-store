import { useEffect } from 'react';

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} — Aura Store` : 'Aura Store';
  }, [title]);

  return null;
};

export default PageTitle;
