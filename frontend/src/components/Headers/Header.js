import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';

const Header = ({ stats }) => {
  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          {/* Cards stats */}
          <Row>
            {/* 1. Temps de codage */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Temps de codage
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.codingTime || '2h 35min'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-clock" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up" /> +12min
                    </span>{' '}
                    <span className="text-nowrap">Depuis hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 2. Sessions aujourd’hui */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Sessions aujourd’hui
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.sessions || '3 sessions'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-layer-group" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      <i className="fas fa-arrow-down" /> -1
                    </span>{' '}
                    <span className="text-nowrap">Par rapport à hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 3. Taux de productivité */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Productivité
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.productivity || '82%'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-bolt" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up" /> +5%
                    </span>{' '}
                    <span className="text-nowrap">Cette semaine</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 4. Interruptions */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Interruptions
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.interruptions || '5 (12min)'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-bell-slash" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      <i className="fas fa-arrow-up" /> +2
                    </span>{' '}
                    <span className="text-nowrap">Aujourd’hui</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 5. Focus moyen */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Focus moyen
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.focusTime || '25 min'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                        <i className="fas fa-bullseye" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-info mr-2">
                      <i className="fas fa-arrow-up" /> +3min
                    </span>{' '}
                    <span className="text-nowrap">Moyenne journalière</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 6. Lignes de code */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Lignes de code
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.linesOfCode || '540'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-dark text-white rounded-circle shadow">
                        <i className="fas fa-code" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-arrow-up" /> +120
                    </span>{' '}
                    <span className="text-nowrap">Depuis hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 7. Erreurs détectées */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Erreurs détectées
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.errors || '8 erreurs'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-bug" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-danger mr-2">
                      <i className="fas fa-arrow-up" /> +2
                    </span>{' '}
                    <span className="text-nowrap">Depuis hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* 8. Carte BONUS - Objectif atteint */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Objectif du jour
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.goal || '✔️ Atteint'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-flag-checkered" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-success mr-2">
                      <i className="fas fa-check" /> Bravo !
                    </span>{' '}
                    <span className="text-nowrap">Objectif journalier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header;
