import React, { useState,useEffect } from 'react';
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
import { login }  from '../../services/AuthService';
import { useNavigate, useSearchParams  } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVSCodeCallback, setIsVSCodeCallback] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callbackUrl = searchParams.get('callback');
  useEffect(() => {
    // Vérifier si on a un paramètre callback dans l'URL (venant de VS Code)
    const callbackUrl = searchParams.get('callback');
    if (callbackUrl) {
      setIsVSCodeCallback(true);
    }
  }, [searchParams]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('access_token', data.access_token);
      const callbackUrl = searchParams.get('callback');
      if (callbackUrl) {
        // Redirection pour VS Code
        window.location.href = `${callbackUrl}?token=${encodeURIComponent(JSON.stringify(data))}`;
      } else {
        // Redirection normale
        navigate('/admin');
      }
    } catch (error) {
      const callbackUrl = searchParams.get('callback');
      const errorMsg = error.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.';
      
      setErrorMessage(errorMsg);
      
      if (callbackUrl) {
        // Si c'est une requête depuis VS Code, on peut aussi rediriger avec l'erreur
        window.location.href = `${callbackUrl}?error=${encodeURIComponent(errorMsg)}`;
      }
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-center">
              <h2 className="text-primary mb-0">Se connecter</h2>
              <p className="text-muted">Accédez à votre compte</p>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="nom d'utilisateur
"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Se souvenir de moi</span>
                </label>
              </div>
              {errorMessage && (
                <div className="text-danger text-center mt-2">{errorMessage}</div>
              )}
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Connexion
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Mot de passe oublié?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Créer un compte</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
