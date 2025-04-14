import { useState } from 'react';
import classnames from 'classnames';
import Chart from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from 'reactstrap';

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  interruptionsChart,
  sessionDurationChart,
  focusTimeChart,
  codeVsErrorsChart,
} from 'variables/charts.js';

import Header from 'components/Headers/Header.js';

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState('data1');

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data('data' + index);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Statistiques
                    </h6>
                    <h2 className="text-white mb-0">Temps de codage</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          Mois
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames('py-2 px-3', {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          Semaine
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Sessions
                    </h6>
                    <h2 className="mb-0">Par semaine</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h6 className="text-uppercase text-muted ls-1 mb-1">Focus</h6>
                <h2 className="mb-0">Interruptions par jour</h2>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar
                    data={interruptionsChart.data}
                    options={interruptionsChart.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h6 className="text-uppercase text-muted ls-1 mb-1">
                  Sessions longues vs courtes
                </h6>
                <h2 className="mb-0">Durée Moyenne</h2>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Pie
                    data={sessionDurationChart.data}
                    options={sessionDurationChart.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h6 className="text-uppercase text-muted ls-1 mb-1">
                  Concentration par heure
                </h6>
                <h2 className="mb-0">Focus Time</h2>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Radar
                    data={focusTimeChart.data}
                    options={focusTimeChart.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h6 className="text-uppercase text-muted ls-1 mb-1">Analyse</h6>
                <h2 className="mb-0">Code vs Erreurs</h2>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line
                    data={codeVsErrorsChart.data}
                    options={codeVsErrorsChart.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
