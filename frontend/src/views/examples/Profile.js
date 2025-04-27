import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { useEffect, useState } from 'react';
import { getPorfil } from '../../services/AuthService';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPorfil();
        setProfile({
          username: data.username,
          email: data.email,
          password: '' // Ne pas afficher le mot de passe réel
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      // Ici vous devrez implémenter la mise à jour du profil
      // Exemple: await updateProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Erreur: {error}
      </div>
    );
  }

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg="6" md="8">
              <Card className="shadow-lg border-0">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="text-info mb-4">Votre Profil</h1>
                    <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow mb-4">
                      <i className="ni ni-single-02" />
                    </div>
                  </div>

                  <CardBody>
                    {success && (
                      <div className="alert alert-success">
                        Profil mis à jour avec succès!
                      </div>
                    )}
                    {error && (
                      <div className="alert alert-danger">
                        {error}
                      </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                      <div className="px-lg-4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nom d'utilisateur
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-username"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            placeholder="Nom d'utilisateur"
                            type="text"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Adresse email
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            placeholder="Adresse email"
                            type="email"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Nouveau mot de passe (laisser vide si inchangé)
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            name="password"
                            value={profile.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            type="password"
                          />
                        </FormGroup>

                        <div className="text-center">
                          <Button
                            className="my-4"
                            color="info"
                            type="submit"
                            size="lg"
                          >
                            Enregistrer les modifications
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </CardBody>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Profile;