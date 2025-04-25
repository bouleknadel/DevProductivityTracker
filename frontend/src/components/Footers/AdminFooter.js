/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
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

  );
};

export default Footer;
