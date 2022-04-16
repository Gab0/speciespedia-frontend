import React from 'react';

import CytoscapeComponent from 'react-cytoscapejs';
import ReactLoading from 'react-loading';

import backendRequest from './Backend.js'

class GameWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameSession: {},
      loading: false,
    }
  }

  ingestData () {


  }

  requestGame(event) {
    event.preventDefault();

    this.setState({loading: true});

    backendRequest('/game/new')
      .then((response) => {
        this.setState({loading: false});
        console.log(response);
      });


  }

  initialize_node_elements () {
     return [
       { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 50 } },
       { data: { id: 'two', label: 'Node 2' }, position: { x: 30, y: 50 } },
       { data: { id: 'three', label: 'Node 3' }, position: { x: 60, y: 50 } },
    ];
  }

  node_background_images () {
    return [];
  }

  render () {
    console.log(this.state.gameSession);

    if (this.state.loading) {
      return <ReactLoading type="spokes" color="#55dd44"/>;
    }
    var ks = Object.keys(this.state.gameSession).length === 0;
    if (ks) {
      return <div>
               "Game is not running."
      <form onSubmit={this.requestGame.bind(this)}>
               <input type="submit" className="search-btn" value="New Game" />
               </form>
             </div>
    } else {

    var elements = this.initialize_node_elements();

    const cy_style = {
      width: '90em',
      height: '30em',
      "background-image": this.node_background_images(),
      "background-fit": "cover cover",
      "background-image-opacity": 0.5
    };

    return <CytoscapeComponent elements={elements} style={cy_style} />;
    }
  }

  evaluate () {

  }
}

export default GameWindow;
