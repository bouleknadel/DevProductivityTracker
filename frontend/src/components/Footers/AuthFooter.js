// reactstrap components
import { Container, Row, Col } from 'reactstrap';

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col className="text-center">
              <div className="copyright text-muted">
                © {new Date().getFullYear()} - Tous droits réservés
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
