//import component Bootstrap React
import { Navbar, Container, Nav } from 'react-bootstrap'

//import react router dom
import { Switch, Route, Link } from "react-router-dom";

//import component Home
import Home from './pages/Home'

//import component Post Index
import TaskIndex from './pages/tasks/Index'

//import component Post Create
import TaskCreate from './pages/tasks/Create'

//import component Post Edit
import TaskEdit from './pages/tasks/Edit'

//import component Post Index
import TodolistIndex from './pages/todolist/Index'

//import component Post Create
// import TodolistCreate from './pages/todolist/Create'

//import component Post Edit
import TodolistEdit from './pages/todolist/Edit'



function App() {
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/" className="nav-link">HOME</Nav.Link>
                  <Nav.Link as={Link} to="/task" className="nav-link">TASK</Nav.Link>

                  <Nav.Link as={Link} to="/todolist" className="nav-link">TODOLIST</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/task" component={TaskIndex} />
        <Route exact path="/task/create" component={TaskCreate} />
        <Route exact path="/task/edit/:id" component={TaskEdit} />

        <Route exact path="/todolist" component={TodolistIndex} />
        {/* <Route exact path="/todolist/create" component={TodolistCreate} /> */}
        <Route exact path="/todolist/edit/:id" component={TodolistEdit} />
      </Switch>
      
    </div>
  );
}

export default App;
