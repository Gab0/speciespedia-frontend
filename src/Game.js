import React, { Component } from 'react';

import ReactLoading from 'react-loading';

import backendRequest from './Backend.js'

import SpeciesCard from './Game/SpeciesCard'

import { Stage,
         Layer,
         Rect,
       } from 'react-konva';

export default class GameWindow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameSession: {},
      speciesCards: {},
      loading: false,
      scoreResult: null
    }
  }

  requestGame(event) {
    event.preventDefault();

    this.setState({loading: true});

    backendRequest('/game/new')
      .then((response) => {
        this.setState({
          loading: false,
          gameSession: response.data,
          stage: this.createStage(),
        });

        console.log(response);

      });
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
        <SpeciesCard
          x={120 + index * 30}
          y={120 + (index / 1.41) * 30}
          key={index}
          species={sp.remoteResultScientificName}
          images={sp.remoteResultImages}
          tracker={this.state.speciesCards}
        />
      )
    });

  }

  isGameRunning () {
     return Object.keys(this.state.gameSession).length !== 0;
  }

  render () {
    if (this.state.loading) {
      return <ReactLoading type="spokes" color="#55dd44"/>;
    }

    //var noGame = false;
    if (this.isGameRunning()) {
      return this.renderStage();
    }

    return <div>
             <form onSubmit={this.requestGame.bind(this)}>
               <input type="submit" className="navlink navbtn" value="Deal Samples" />
             </form>
           </div>
  }

  fetchHelpText(): string {
    var tips;
    try {
      tips = this.state.gameSession.textTip;
    } catch (e) {
      console.log(e);
    }
    return "Drag these species samples to form groups. " + tips;
  }

  generateBreakPoints(n: number, totalWidth: number): Array[number] {
    var breakpoints = [];
    for (var i in Array.from(Array(n).keys())) {
      breakpoints.push(i * totalWidth / n);
    }
    return breakpoints;
  }

  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  renderGroupZones(totalWidth: number, h: number) {
    var breakpoints = this.generateBreakPoints(
      this.state.gameSession.nbGroups, totalWidth
    );

    // Use random group zone colors on each game session;
    var colors = this.shuffle(["red", "purple", "orange", "cyan", "grey", "pink", "blue"]);

    var areas = breakpoints.map((v, idx) => {
      var width = breakpoints[1] - breakpoints[0];
      return (
        <Rect
          key={idx}
          x={breakpoints[idx]}
          y={0}
          width={width}
          height={h}
          fill={colors[idx]}
          id={"zone" + idx}
        />
      )
    });

    console.log("AREAS", areas)
    return areas
  }

  createStage() {
    var stage_w = window.innerWidth * 0.66;
    var stage_h = 500;

    //<Text text={this.fetchHelpText()} fontSize={15} x={60} y={10}/>
    return <Stage width={stage_w} height={stage_h}>
        <Layer>
          {this.renderGroupZones(stage_w, stage_h)}
        </Layer>
        <Layer>
            {this.renderNodes()}
        </Layer>
        </Stage>
  }

  renderStage() {
    let epilogue;
    if (this.state.scoreResult === null) {
      epilogue = null;
    } else {
      epilogue = <ScoreWindow toggle={this.togglePop} score={this.state.scoreResult}/>
    }
    return (
      <div>
        <center>{this.fetchHelpText()}</center>
        {this.createStage()}
        { epilogue }
        { this.renderSubmitAnswer() }
      </div>
    );
    }

  renderSubmitAnswer() {
    return <form onSubmit={this.submitGroups.bind(this)}>
             <input type="submit" className="navlink navbtn" value="Done!"/>
           </form>
  }
  // Read each Species node positions from the Stage,
  // and calculate in which category the player put them into.
  extractCategorization (): string[] {
    var breakpoints = this.generateBreakPoints(
      this.state.gameSession.nbGroups,
      this.state.stage.props.width
    );

    var results: string[][] = new Array(breakpoints.length)
        .fill(false)
        .map(() => []);

    // Iterate over our species card tracker.
    Object.entries(this.state.speciesCards).forEach(entry => {
      const [speciesName, posX] = entry;
      var category: number = 0;
      breakpoints.forEach((breakpoint, index) => {
        if (posX > breakpoint) {
          category = index;
        }
      });
      results[category].push(speciesName);
    });
    return results;
  }

  toggleScore () {
   this.setState({
    seen: !this.state.seen
   });
  };

  submitGroups (event) {
    console.log("Submitting...");
    event.preventDefault();
    //this.setState({loading: true});

    var answerData = {
      speciesGroups: this.extractCategorization.bind(this)(),
      answerTaxonomicDiscriminators: this.state.gameSession.gameTaxonomicDiscriminators
    }

    this.toggleScore();
    backendRequest('/game/answer', answerData)
      .then((response) => {
        this.setState({
          loading: false,
          scoreResult: response.data.gameResultScore
        });
        console.log(response);
      });
  }

  showResults () {

  }

}


class ScoreWindow extends Component {
  handleClick = () => {
   this.props.toggle();
  };

  render() {
    return (
      <div className="">
          <span className="score-view">Score: {Math.round(this.props.score * 100)}%</span>
      </div>
  );
 }
}
