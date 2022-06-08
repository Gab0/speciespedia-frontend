 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Encyclopedia from './Encyclopedia';
import GameWindow from './Game';


class TitleScreen extends React.Component {
  render() {
    return (
      <div id="title" className="centering">
        Biodiversity Education Node
      </div>
    );
  }

}

const Navbar = () => {
  return (
  <div className="menu">
      <Link to="/" className="navlink navelt">Encyclopedia</Link>
      <Link to="/game" className="navlink navelt">Taxonomy Simulator</Link>
      <Link to="/devnotes" className="navlink navelt">About</Link>
  </div>
  );
}

class MainPage extends React.Component {
  render () {

    return <center>
             <Router>
               <TitleScreen/>
               <Navbar/>
               <Routes>
                 <Route path='/' element={<Encyclopedia/>} />
                 <Route path='/game' element={<GameWindow/>} />
               </Routes>
             </Router>
           </center>
  }
}



export default MainPage;
