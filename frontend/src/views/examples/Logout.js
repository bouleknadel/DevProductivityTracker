import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Effacer le token d'authentification du localStorage
    localStorage.removeItem('access_token');

    // Rediriger vers la page de connexion
    navigate('/auth/login');
  }, [navigate]);

  // Cette page ne sera jamais affichée car l'utilisateur est redirigé immédiatement
  return null;
};

export default Logout;
