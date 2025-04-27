import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import { getSession } from "../../services/SessionService";

const Tables = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSession();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "En cours";
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

  // Fonction pour calculer la durée en minutes
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "En cours";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    return Math.round(diffMs / 60000); // Convertir en minutes
  };

  // Fonction pour calculer le pourcentage de progression
  const calculateProgress = (linesWritten) => {
    // Vous pouvez ajuster cette valeur maximale selon vos besoins
    const maxLines = 500;
    return Math.min(Math.round((linesWritten / maxLines) * 100), 100);
  };

  if (loading) {
    return <div>Chargement des sessions...</div>;
  }

  if (error) {
    return <div className="text-danger">Erreur: {error}</div>;
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Sessions de Codage</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Début</th>
                    <th scope="col">Fin</th>
                    <th scope="col">Durée (min)</th>
                    <th scope="col">Interruptions</th>
                    <th scope="col">Lignes écrites</th>
                    <th scope="col">Erreurs</th>
                    <th scope="col">Utilisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id}>
                      <td>{formatDate(session.startTime)}</td>
                      <td>{formatDate(session.endTime)}</td>
                      <td>{calculateDuration(session.startTime, session.endTime)}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i className={
                            session.interruptions === null || session.interruptions === 0 ? "bg-success" :
                            session.interruptions <= 2 ? "bg-warning" : "bg-danger"
                          } />
                          {session.interruptions === null ? 0 : session.interruptions}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">{session.linesWritten}</span>
                          <div>
                            <Progress
                              max="100"
                              value={calculateProgress(session.linesWritten)}
                              barClassName={
                                calculateProgress(session.linesWritten) > 70 ? "bg-success" :
                                calculateProgress(session.linesWritten) > 40 ? "bg-warning" : "bg-danger"
                              }
                            />
                          </div>
                        </div>
                      </td>
                      <td>{session.errors}</td>
                      <td>{session.user.username}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Tables;