 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Encyclopedia from './Encyclopedia';
import GameWindow from './Game';


class TitleScreen extends React.Component {
  render() {
    return (
      <div id="title" className="centering">
        Species Information Aggregator.
      </div>
    );
  }

}


const Navbar = () => {
  return (
  <div>
      <Link to="/" className="navlink">Encyclopedia</Link>
      <Link to="/game" className="navlink">Game</Link>
  </div>
  );
}


class MainPage extends React.Component {
  render () {
    return <Router>
             <TitleScreen/>
             <Navbar/>
             <Routes>
               <Route path='/' element={<Encyclopedia
                                                backendUrl="http://localhost:5000"/>} />
               <Route path='/game' element={<GameWindow/>} />
             </Routes>
           </Router>
  }
}



export default MainPage;
