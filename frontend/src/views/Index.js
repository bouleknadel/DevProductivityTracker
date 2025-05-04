import { useState,useEffect } from 'react';
import classnames from 'classnames';
import Chart from 'chart.js';
import { Line, Bar, Pie, Radar, Doughnut } from 'react-chartjs-2';
import {getSessionByWeek,getInterupptionByWeek,getCodingHoursByWeek,getCodingHoursByMonth,getSessionDurationStats,
  getConcentrationData,getCodeVsErrorsData,getLanguageUsageStats
} from '../services/statsService';
import { useWebSocket } from '../hooks/useWebSocket';
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


const languageUsageChart = {
  data: {
    labels: ['JavaScript', 'Python', 'Java', 'HTML/CSS', 'PHP', 'Autres'],
    datasets: [
      {
        label: "Pourcentage d'utilisation",
        data: [35, 25, 15, 10, 8, 7],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)', // Jaune pour JavaScript
          'rgba(75, 192, 192, 0.7)', // Bleu-vert pour Python
          'rgba(255, 99, 132, 0.7)', // Rouge pour Java
          'rgba(54, 162, 235, 0.7)', // Bleu pour HTML/CSS
          'rgba(153, 102, 255, 0.7)', // Violet pour PHP
          'rgba(201, 203, 207, 0.7)', // Gris pour Autres
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#32325d',
        fontSize: 11,
        padding: 20,
      },
    },
    title: {
      display: true,
      text: 'Répartition des langages',
      fontColor: '#32325d',
      fontSize: 16,
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return (
            data.labels[tooltipItem.index] +
            ': ' +
            data.datasets[0].data[tooltipItem.index] +
            '%'
          );
        },
      },
    },
  },
};


const Index = (props) => {

  const [languageData, setLanguageData] = useState(languageUsageChart.data);



  const [activeNav, setActiveNav] = useState(1);
  const [sessionsData, setSessionsData] = useState(chartExample2.data);
  const [chart4Data, setChart4Data] = useState(sessionDurationChart.data);
  const [interruptionData, setInterruotionData] = useState(interruptionsChart.data);
  const [codeVsErrorsData, setCodeVsErrorsData] = useState(codeVsErrorsChart.data);
  const [codingHoursValues, setCodingHoursValues] = useState({
    monthly: [15, 22, 28, 25, 32, 24, 30, 35], // Valeurs statiques par défaut (mois)
    weekly: [4.5, 6.2, 5.8, 7.1, 5.5, 3.2, 2.0] // Valeurs statiques par défaut (semaine)
  });
  const [foncusTimeData, setFoncusTimeData] = useState(focusTimeChart.data);
  const fetchLanguageData = async () => {
    try {
      const data = await getLanguageUsageStats();
      
      // Préparer les couleurs (vous pouvez garder votre palette existante)
      const colorPalette = [
        'rgba(255, 206, 86, 0.7)', // Jaune
        'rgba(75, 192, 192, 0.7)', // Bleu-vert
        'rgba(255, 99, 132, 0.7)', // Rouge
        'rgba(54, 162, 235, 0.7)', // Bleu
        'rgba(153, 102, 255, 0.7)', // Violet
        'rgba(201, 203, 207, 0.7)', // Gris
      ];

      const labels = Object.keys(data);
      const percentages = Object.values(data);
      
      const backgroundColors = labels.map((_, index) => 
        colorPalette[index % colorPalette.length]
      );
      
      const borderColors = backgroundColors.map(color => 
        color.replace('0.7', '1')
      );

      setLanguageData({
        labels,
        datasets: [{
          label: "Pourcentage d'utilisation",
          data: percentages,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        }]
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des stats de langage:", error);
    }
  };

  const fetchSessionsData = async () => {
    try {
      const data11 = await getCodingHoursByMonth();
      const data12 = await getCodingHoursByWeek();
      const data = await getSessionByWeek();
      const data2 = await getInterupptionByWeek();
      const data3=await getSessionDurationStats();
      const data4=await getConcentrationData();
      const data5=await getCodeVsErrorsData();
      console.log("data5",data5.errors)
      fetchLanguageData()
      // Mettre à jour les données avec ce que vous récupérez du serveur
      setSessionsData({
        ...chartExample2.data,
        datasets: [
          {
            ...chartExample2.data.datasets[0],
            data: data.counts || data // Adaptez selon la structure de vos données
          }
        ]
      });
      setCodeVsErrorsData({
        ...codeVsErrorsChart.data,
        datasets: [
          {
            ...codeVsErrorsChart.data.datasets[0],
            data:   data5.lines.counts ||  data5.lines // Adaptez selon la structure de vos données
          },
          {
            ...codeVsErrorsChart.data.datasets[1],
            data:  data5.errors.counts ||  data5.errors// Adaptez selon la structure de vos données
          }

        ]
      });
      setFoncusTimeData({
        ...focusTimeChart.data,
        datasets: [
          {
            ...focusTimeChart.data.datasets[0],
            data: data4.counts || data4 // Adaptez selon la structure de vos données
          }
        ]
      });
      setInterruotionData({
        ...interruptionsChart.data,
        datasets: [
          {
            ...interruptionsChart.data.datasets[0],
            data: data2.counts || data2 // Adaptez selon la structure de vos données
          }
        ]
      });
      setChart4Data({
        ...sessionDurationChart.data,
        datasets: [
          {
            ...sessionDurationChart.data.datasets[0],
            data: data3.counts || data3 // Adaptez selon la structure de vos données
          }
        ]
      });
      setCodingHoursValues({
        monthly: data11,
        weekly:  data12
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
    }
  };
  useEffect(() => {
   

    fetchSessionsData();
  }, []);
    // Utilisez WebSocket pour les mises à jour en temps réel
    useWebSocket('ws://localhost:8083/ws/sessions', (wsData) => {
      console.log('Reçu une mise à jour via WebSocket:', wsData);
     
      
      fetchSessionsData();
    });
  

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    const selectedData = index === 1 ? chartExample1.data1 : chartExample1.data2;
    
  };
  const getChartData = () => {
    // On récupère la configuration de base de chartExample1
    const baseConfig = activeNav === 1 
      ? chartExample1.data1() 
      : chartExample1.data2();
    
    // On ne modifie que les données (data) en gardant tout le reste identique
    return {
      ...baseConfig,
      datasets: baseConfig.datasets.map(dataset => ({
        ...dataset,
        data: activeNav === 1 
          ? codingHoursValues.monthly 
          : codingHoursValues.weekly
      }))
    };
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
                  <Line data={getChartData()} options={chartExample1.options} />
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
                  <Bar data={sessionsData} options={chartExample2.options} />
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
                    data={interruptionData}
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
                    data={chart4Data}
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
                    data={foncusTimeData}
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
                    data={codeVsErrorsData}
                    options={codeVsErrorsChart.options}
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
                <h6 className="text-uppercase text-muted ls-1 mb-1">Analyse</h6>
                <h2 className="mb-0">Langages Utilisés</h2>
              </CardHeader>
              <CardBody>
                <Row>
                  {/* Colonne pour le graphique */}
                  <Col md="7">
                    <div className="chart" style={{ height: '250px' }}>
                      <Doughnut
                        data={languageData}
                        options={languageUsageChart.options}
                      />
                    </div>
                  </Col>

                  {/* Colonne pour la légende personnalisée */}
                  <Col md="5">
                    <div className="language-legend">
                      <h4 className="text-muted mb-3">Détails des langages</h4>
                      <Table className="table-sm">
                        <tbody>
                          {languageData.labels.map((label, index) => (
                            <tr key={index}>
                              <td>
                                <span
                                  className="legend-color mr-2"
                                  style={{
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor:
                                      languageData.datasets[0].backgroundColor[
                                        index
                                      ],
                                    borderRadius: '2px',
                                  }}
                                />
                                <span className="font-weight-bold">
                                  {label}
                                </span>
                              </td>
                              <td className="text-right">
  {typeof languageData.datasets[0].data[index] === 'number' 
    ? languageData.datasets[0].data[index].toFixed(2) + '%'
    : 'N/A'}
</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
