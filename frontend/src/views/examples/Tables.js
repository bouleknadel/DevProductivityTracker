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
// reactstrap components
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
// core components
import Header from "components/Headers/Header.js";

const Tables = () => {
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
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
                  <tr>
                    <td>12/04/2025 09:30</td>
                    <td>12/04/2025 11:45</td>
                    <td>135</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />3
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">245</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>12</td>
                    <td>Bouleknadel</td>
                  </tr>
                  <tr>
                    <td>11/04/2025 14:00</td>
                    <td>11/04/2025 17:30</td>
                    <td>210</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-success" />1
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">342</span>
                        <div>
                          <Progress
                            max="100"
                            value="80"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>5</td>
                    <td>Bouleknadel</td>
                  </tr>
                  <tr>
                    <td>10/04/2025 10:00</td>
                    <td>10/04/2025 12:30</td>
                    <td>150</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-danger" />5
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">158</span>
                        <div>
                          <Progress
                            max="100"
                            value="40"
                            barClassName="bg-warning"
                          />
                        </div>
                      </div>
                    </td>
                    <td>23</td>
                    <td>Bouleknadel</td>
                  </tr>
                  <tr>
                    <td>09/04/2025 08:15</td>
                    <td>09/04/2025 11:30</td>
                    <td>195</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />2
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">287</span>
                        <div>
                          <Progress
                            max="100"
                            value="73"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>8</td>
                    <td>Sophie Martin</td>
                  </tr>
                  <tr>
                    <td>08/04/2025 13:00</td>
                    <td>08/04/2025 16:45</td>
                    <td>225</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-success" />0
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">412</span>
                        <div>
                          <Progress
                            max="100"
                            value="92"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>3</td>
                    <td>Thomas Dubois</td>
                  </tr>
                  <tr>
                    <td>07/04/2025 09:45</td>
                    <td>07/04/2025 12:30</td>
                    <td>165</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-danger" />7
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">143</span>
                        <div>
                          <Progress
                            max="100"
                            value="35"
                            barClassName="bg-warning"
                          />
                        </div>
                      </div>
                    </td>
                    <td>19</td>
                    <td>Léa Bernard</td>
                  </tr>
                  <tr>
                    <td>06/04/2025 14:30</td>
                    <td>06/04/2025 18:15</td>
                    <td>225</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />4
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">298</span>
                        <div>
                          <Progress
                            max="100"
                            value="68"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>11</td>
                    <td>Nicolas Roux</td>
                  </tr>
                  <tr>
                    <td>05/04/2025 10:00</td>
                    <td>05/04/2025 14:30</td>
                    <td>270</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-success" />1
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">375</span>
                        <div>
                          <Progress
                            max="100"
                            value="85"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>7</td>
                    <td>Camille Dupont</td>
                  </tr>
                  <tr>
                    <td>04/04/2025 09:00</td>
                    <td>04/04/2025 11:45</td>
                    <td>165</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-danger" />8
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">120</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-danger"
                          />
                        </div>
                      </div>
                    </td>
                    <td>25</td>
                    <td>Julien Leroy</td>
                  </tr>
                  <tr>
                    <td>03/04/2025 13:15</td>
                    <td>03/04/2025 17:30</td>
                    <td>255</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />3
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">329</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>9</td>
                    <td>Marie Laurent</td>
                  </tr>
                  <tr>
                    <td>02/04/2025 08:30</td>
                    <td>02/04/2025 12:00</td>
                    <td>210</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-success" />1
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">267</span>
                        <div>
                          <Progress
                            max="100"
                            value="65"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>6</td>
                    <td>Pierre Moreau</td>
                  </tr>
                  <tr>
                    <td>01/04/2025 14:00</td>
                    <td>01/04/2025 18:30</td>
                    <td>270</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />5
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">315</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>15</td>
                    <td>Emma Petit</td>
                  </tr>
                  <tr>
                    <td>31/03/2025 09:30</td>
                    <td>31/03/2025 13:45</td>
                    <td>255</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />2
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">290</span>
                        <div>
                          <Progress
                            max="100"
                            value="67"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td>10</td>
                    <td>Lucas Simon</td>
                  </tr>
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
        {/* Dark table */}
      </Container>
    </>
  );
};

export default Tables;
