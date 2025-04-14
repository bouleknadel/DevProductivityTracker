// reactstrap components
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

const Profile = () => {
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
                    <Form>
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
                            defaultValue="lucky.jesse"
                            id="input-username"
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
                            defaultValue="jesse@example.com"
                            placeholder="Adresse email"
                            type="email"
                          />
                        </FormGroup>

                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Mot de passe
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-password"
                            placeholder="••••••••"
                            type="password"
                          />
                        </FormGroup>

                        <div className="text-center">
                          <Button
                            className="my-4"
                            color="info"
                            type="button"
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
