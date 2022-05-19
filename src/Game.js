import React from 'react';

import CytoscapeComponent from 'react-cytoscapejs';
import ReactLoading from 'react-loading';

import backendRequest from './Backend.js'

import { render } from "react-dom";

import { Image,
         Stage,
         Group,
         Layer,
         Circle,
         Rect,
         Line,
         Text
       } from 'react-konva';


// Stolen from https://konvajs.org/docs/react/Images.html;
class URLImage extends React.Component {
  state = {
    image: null,
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image,
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {

    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        fill={'gray'}
        ref={(node) => {
          this.imageNode = node;
        }}
        cornerRadius={70}
        width={100}
        height={100}
        shadowBlur={10}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    );
  }
}



class GameWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameSession: {},
      loading: false,
    }
  }

  requestGame(event) {
    event.preventDefault();

    this.setState({loading: true});

    backendRequest('/game/new')
      .then((response) => {
        this.setState({loading: false, gameSession: response.data});
        console.log(response);

      });
  }

  selectImage (imgData) {
    if (imgData.tag !== "Retrieved") return null;
    try {
    return imgData.contents[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  stylizeSpeciesName (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  renderNodes () {
    var species = this.state.gameSession.species;

    if (species === undefined) return;
    var sample = [
      {
        remoteResultScientificName: "Capybara",
        remoteResultImages: {
          tag: "Retrieved",
          content: ["https://www.rainforest-alliance.org/wp-content/uploads/2021/06/capybara-square-1.jpg.optimal.jpg"]}
      }
    ]

    return species.map((sp, index) => {
      return (
          <Group
            x={120 + index * 30}
            y={120 + index * 30}
            id={sp.remoteResultScientificName}
            draggable
          >
          <URLImage
            src={this.selectImage(sp.remoteResultImages)}
          />
          <Text
            text={this.stylizeSpeciesName(sp.remoteResultScientificName)}
            fontSize={15}
            x={0}
            y={110}
          />
          </Group>
      )
    });
  }

  handleDragStart (e) {

  }
  handleDragEnd (e) {

  }

  render () {
    console.log(this.state.gameSession);

    if (this.state.loading) {
      return <ReactLoading type="spokes" color="#55dd44"/>;
    }
    var noGame = Object.keys(this.state.gameSession).length === 0;
    //var noGame = false;
    if (noGame) {
      return <div>
               "Game is not running."
      <form onSubmit={this.requestGame.bind(this)}>
               <input type="submit" className="search-btn" value="New Game" />
               </form>
             </div>
    } else {
      return this.renderStage();
    }
  }

  fetchHelpText() {
    var tips;
    try {
      tips = this.state.gameSession.textTip;
    } catch (e) {
      console.log(e);
    }
    return "Drag these species samples to form up to three groups. " + tips;
  }

  renderGroupZones(w, h) {
    var breakpoints = [0, w/3, 2 * w / 3];
    var colors = ["red", "purple", "orange", "cyan", "grey", "pink", "blue"];

    var areas = breakpoints.map((v, idx) => {
       return (
         <Rect
          x={breakpoints[idx]}
          y={0}
          width={w / 3}
          height={h}
          fill={colors[idx]}
         />
       )
    });

    //this.setState({areas: areas});
    return areas
  }

  renderStage() {

    var stage_w = window.innerWidth;
    var stage_h = 500;
    return (
      <div>
      <Stage width={stage_w} height={stage_h}>
        <Layer>
          {this.renderGroupZones(stage_w, stage_h)}
        </Layer>
        <Layer>
          <Text text={this.fetchHelpText()} fontSize={15} x={40}/>
            {this.renderNodes()}
        </Layer>

        </Stage>
            <form onSubmit={this.submitGroups}>
            <input type="submit" className="search-btn" value="Submit result"/>
            </form>
      </div>
    );
    }

  evaluate () {



  }

  submitGroups () {
    this.setState({loading: true});
    var data = this.evaluate();
    backendRequest('/game/results', data)
      .then((response) => {
        this.setState({loading: false, gameSession: response.data});
        console.log(response);
      });
  }

}

export default GameWindow;
