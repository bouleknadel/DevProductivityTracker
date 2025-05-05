import { Card, CardBody, CardTitle, Container, Row, Col } from 'reactstrap';
import { useEffect, useState } from 'react';
import { getCodingStats } from '../../services/statsService';
import axiosInstance from '../../services/axiosInstance';
import { useWebSocket } from '../../hooks/useWebSocket';
import axios from "axios";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, FormGroup, Label } from 'reactstrap';
const showProductivityAlert = async (score) => {
  try {
     // Déclencher une notification avec un son standard
     if (Notification.permission === "granted") {
      new Notification("Score de productivité", {
        body: `Votre score est de ${score}%`,
        icon: "/path/to/icon.png", // Facultatif
        silent: false // Garantit que le son de notification est joué
      });
    } else if (Notification.permission !== "denied") {
      // Demander la permission
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Score de productivité", {
            body: `Votre score est de ${score}%`,
            silent: false
          });
        }
      });
    }
    // Configuration de la popup avec SweetAlert
    await Swal.fire({
      title: 'Résultat de Productivité',
      html: `
        <div style="font-size: 24px; color: #2c3e50; margin: 20px 0;">
          Votre score: <strong style="color: ${getScoreColor(score)}">${score}%</strong>
        </div>
        <div style="background: ${getScoreBackground(score)}; 
             padding: 15px; border-radius: 8px; margin-top: 15px;">
          ${getScoreMessage(score)}
        </div>
      `,
      icon: getScoreIcon(score),
      background: '#f8f9fa',
      showConfirmButton: true,
      confirmButtonText: 'Fermer',
      confirmButtonColor: '#3498db'
    });

   

  } catch (error) {
    console.error("Erreur dans showProductivityAlert:", error);
    alert(`Score de productivité: ${score}%`);
  }
};

// Fonctions utilitaires existantes
const getScoreColor = (score) => score > 70 ? '#2ecc71' : score > 50 ? '#f39c12' : '#e74c3c';
const getScoreBackground = (score) => score > 70 ? '#d5f5e3' : score > 50 ? '#fdebd0' : '#fadbd8';
const getScoreMessage = (score) => score > 70 ? '🌟 Excellent travail !' : score > 50 ? '👍 Bon effort !' : '💪 Continuez à vous améliorer !';
const getScoreIcon = (score) => score > 70 ? 'success' : score > 50 ? 'warning' : 'error';
const Header = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false); // Pour gérer l'ouverture/fermeture du modal
  const [newGoal, setNewGoal] = useState(120); // Valeur par défaut
  const toggleModal = () => setModal(!modal);

  const handleGoalChange = (e) => {
    setNewGoal(parseInt(e.target.value) || 0);
  };

  const updateDailyGoal = async () => {
    try {
      await axiosInstance.put('/update-daily-goal', { dailyGoalMinutes: newGoal });
      // Recharger les stats après mise à jour
      const data = await getCodingStats();
      setStats(data);
      toggleModal();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'objectif:", err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCodingStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  useWebSocket('ws://localhost:8083/ws/sessions', (data) => {
    console.log('Reçu une mise à jour via WebSocket:', data);
      // Vérifier si c'est une notification de fin de session
      if (data.startsWith("SESSION_COMPLETED:")) {
        const parts = data.split(":");
        const sessionInfo = JSON.parse(parts.slice(1).join(":"));
    
        // Envoyer les données à l'API de prédiction
        const sendToPredictionAPI = async () => {
          try {
              const response = await axios.post('http://localhost:5000/predict', {
                  duration: sessionInfo.duration || 0,
                  interruptions: sessionInfo.interruptions || 0,
                  linesWritten: sessionInfo.linesWritten || 0,
                  errors: sessionInfo.errors || 0
              }, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  // withCredentials: false  // Non nécessaire avec la config CORS actuelle
              });
      
              const productivityScore = response.data.productivityScore.toFixed(2);
              
              showProductivityAlert(productivityScore);
              
          } catch (error) {
              console.error("Erreur API:", error);
              alert("Erreur lors du calcul du score de productivité");
          }
      };
    
        sendToPredictionAPI();
    }
    const fetchStats = async () => {
      try {
        const data = await getCodingStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  });

  if (loading) return <div className="header pb-8 pt-5 pt-md-8">Chargement...</div>;
  if (error) return <div className="header pb-8 pt-5 pt-md-8">Erreur: {error}</div>;

  // Fonction pour formater les tendances
  const formatTrend = (value, unit = '') => {
    if (!value) return '';
    const isPositive = value.includes('↑');
    const arrow = isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    const colorClass = isPositive ? 'text-success' : 'text-danger';
    
    return (
      <span className={`${colorClass} mr-2`}>
        <i className={arrow} /> {value.replace(/↑|↓/g, '')}
      </span>
    );
  };

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row>
            {/* Temps de codage */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Temps de codage
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.codingTime || '--'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-clock" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.codingTimeTrend)}
                    <span className="text-nowrap">Depuis hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Sessions aujourd'hui */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Sessions aujourd'hui
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.sessionsToday || '--'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-layer-group" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.sessionsTrend)}
                    <span className="text-nowrap">Par rapport à hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Productivité */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Productivité
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.productivityPercentage || '--'}%
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-bolt" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.productivityTrend)}
                    <span className="text-nowrap">Cette semaine</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Interruptions */}
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Interruptions
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.interruptions || '--'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-bell-slash" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.interruptionsTrend)}
                    <span className="text-nowrap">Aujourd'hui</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Focus moyen */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Focus moyen
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.averageFocusMinutes ? `${stats.averageFocusMinutes} min` : '--'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                        <i className="fas fa-bullseye" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.linesOfCodeTrend)}
                    <span className="text-nowrap">Moyenne journalière</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Lignes de code */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Lignes de code
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.linesOfCode || '--'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-dark text-white rounded-circle shadow">
                        <i className="fas fa-code" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.linesOfCodeTrend)}
                    <span className="text-nowrap">Depuis hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Erreurs détectées */}
            <Col lg="6" xl="3" className="mt-4">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Erreurs détectées
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {stats?.errorsDetected ? `${stats.errorsDetected} erreurs` : '--'}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-bug" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    {formatTrend(stats?.errorsTrend)}
                    <span className="text-nowrap">Depuis hier</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            {/* Objectif du jour */}
           {/* Objectif du jour */}
<Col lg="6" xl="3" className="mt-4">
  <Card className="card-stats mb-4 mb-xl-0">
    <CardBody>
      <Row>
        <div className="col">
          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
            Objectif du jour
          </CardTitle>
          <span className="h2 font-weight-bold mb-0">
            {stats?.dailyGoalAchieved ? '✔ Atteint' : 'Non atteint'}
          </span>
        </div>
        <Col className="col-auto">
          <div className="icon icon-shape bg-success text-white rounded-circle shadow">
            <i className="fas fa-flag-checkered" />
          </div>
        </Col>
      </Row>
      <p className="mt-3 mb-0 text-muted text-sm">
        <span className={`${stats?.dailyGoalAchieved ? 'text-success' : 'text-danger'} mr-2`}>
          <i className={stats?.dailyGoalAchieved ? 'fas fa-check' : 'fas fa-times'} /> 
          {stats?.goalMessage || 'Objectif journalier'}
        </span>
      </p>
      <Button 
        color="link" 
        size="sm" 
        onClick={() => {
          setNewGoal(stats?.dailyGoalMinutes || 120);
          toggleModal();
        }}
        className="px-0"
      >
        <i className="fas fa-edit mr-1" /> Modifier
      </Button>
    </CardBody>
  </Card>
</Col>
          </Row>
        </div>
      </Container>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Modifier l'objectif journalier</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="dailyGoal">Objectif (minutes)</Label>
              <Input
                type="number"
                name="dailyGoal"
                id="dailyGoal"
                min="15"
                max="720"
                value={newGoal}
                onChange={handleGoalChange}
              />
              <small className="text-muted">
                Entre 15 et 720 minutes (1 à 12 heures)
              </small>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Annuler
          </Button>
          <Button color="primary" onClick={updateDailyGoal}>
            Enregistrer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
    
  );
};

export default Header;