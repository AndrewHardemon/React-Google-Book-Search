import React from "react";
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
import Nav from "./components/Nav";

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route exact path="/" component={Search}/>
          <Route exact path="/search" component={Search}/>
          <Route exact path="/saved/:id" component={Detail}/>
          <Route exact path="/saved" component={Saved}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
