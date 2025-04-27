// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap';
import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axiosInstance.post('/user', formData);
      
      if (response.data) {
        setSuccess(true);
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError("Nom d'utilisateur déjà utilisé");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du compte");
      console.error("Erreur d'inscription:", err);
    }
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-center">
              <h2 className="text-primary mb-0">S'inscrire</h2>
              <p className="text-muted">Créez votre compte</p>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {success && (
              <div className="alert alert-success">
                Compte créé avec succès! Redirection vers la page de connexion...
              </div>
            )}
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Nom d'utilisateur" 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="new-email"
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-muted font-italic">
                <small>
                  Force du mot de passe:{' '}
                  <span className="text-success font-weight-700">fort</span>
                </small>
              </div>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      required
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        J'accepte les{' '}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          conditions d'utilisation
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Créer un compte
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;