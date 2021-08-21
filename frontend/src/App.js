import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Base from "./components/Base";
import User from "./components/User";
import Roles from './components/RolesDashboard';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user">User</Link>
            </li>
            <li>
              <Link to="/channels">Channels</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/channels">
            <Roles />
          </Route>
          <Route path="/">
            <Base />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
