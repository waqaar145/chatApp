import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/Home';
import Subject from './pages/Subject';
import FormComp from './pages/TestingForm';
import TopNavbar from './components/navabr/navbar'

function App() {

  useEffect(() => {
    document.body.style.background = '#efefef';
  }, [])

  return (
    <Router>
    <div>
      <TopNavbar/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/subject/:subject_slug" component={Subject} />
        <Route path="/form" component={FormComp} />
      </Switch>
    </div>
  </Router>
  );
}

export default App;
