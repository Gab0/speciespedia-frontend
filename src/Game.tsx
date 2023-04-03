import React, { useEffect, useState } from 'react';

import backendRequest from './Backend.js'

import Loading from './Loading.js'
import SpeciesCard from './Game/SpeciesCard'

import { RemoteResult, GameAnswer, GameSetup } from './Types';

import { Stage,
         Layer,
         Rect,
       } from 'react-konva';

const defaultColors = ["red", "purple", "orange", "cyan", "grey", "pink", "blue"];

const GameWindow = () => {

  const [gameSession, setGameSession] = useState<GameSetup | {}>({});
  const [speciesCards, setSpeciesCards] = useState({});
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [colors, setColors] = useState(defaultColors);
  const [stage, setStage] = useState({});
  const [seen, setSeen] = useState(false);


  const requestGame = (event: any) => {
    try {
      event.preventDefault();
    } catch(e) {};

    setLoading(true);
    setColors(shuffle(colors));
    console.log("REQUEST");

    backendRequest('/game/new')
      .then((response) => {
        resetState();

        setLoading(false);
        setGameSession(response.data);
        setStage(createStage());

        console.log(response);

      });
  }

  const resetState = () => {
    setSpeciesCards({});
    setScoreResult(null);
    setColors(shuffle(colors));
  }


  const renderNodes = () => {
    var species = gameSession.species;

    if (species === undefined) return;

    return species.map((sp: RemoteResult, index: number) => {
      return (
        <SpeciesCard
          x={120 + index * 30}
          y={120 + (index / 1.41) * 30}
          key={index}
          species={sp}
          images={sp.remoteResultImages}
          tracker={speciesCards}
        />
      )
    });
  }

  const isGameRunning = () => {
     return Object.keys(gameSession).length !== 0;
  }

  const renderDealSamplesButton = () => {
    return <div>
             <form onSubmit={requestGame.bind(this)}>
               <input type="submit" className="navlink navbtn" value="Deal Samples" />
             </form>
           </div>
  }

  const fetchHelpText = (): string => {
    var tips;
    try {
      tips = gameSession.textTip;
    } catch (e) {
      console.log(e);
    }

    if (tips === undefined) {
      tips = "";
    }

    return "Drag these species samples to form groups. " + tips;
  }

  const generateBreakPoints = (n: number, totalWidth: number): Array<number> => {
    var breakpoints = [];
    var i: any = 0;

    for (i in Array.from(Array(n).keys())) {
      breakpoints.push(i * totalWidth / n);
    }

    return breakpoints;
  }

  const shuffle = (array: any[]) => {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex !== 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const renderGroupZones = (totalWidth: number, h: number) => {
    var breakpoints = generateBreakPoints(
      gameSession.nbGroups, totalWidth
    );

    var areas = breakpoints.map((v: number, idx: number) => {
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

    return areas
  }

  const createStage = () => {
    var stage_w = window.innerWidth * 0.66;
    var stage_h = 500;

    //<Text text={fetchHelpText()} fontSize={15} x={60} y={10}/>
    return <Stage width={stage_w} height={stage_h}>
        <Layer>
          {renderGroupZones(stage_w, stage_h)}
        </Layer>
        <Layer>
          {renderNodes()}
        </Layer>
        </Stage>
  }

  const renderStage = () => {
    let epilogue;
    if (scoreResult === null) {
      epilogue = null;
    } else {
      epilogue = <ScoreWindow
                   score={scoreResult}
                   speciesCards={speciesCards}
                 />
    }

    return (
      <div>
        <center>{fetchHelpText()}</center>
        {createStage()}
        {epilogue}
        {scoreResult === 1 ? renderNewGameButton() : renderSubmitAnswer()}
      </div>
    );


  }

  const renderSubmitAnswer = () => {
    return <form onSubmit={submitGroups.bind(this)}>
             <input type="submit" className="navlink navbtn" value="Done!"/>
           </form>
  }

  const renderNewGameButton = () => {
    return <form onSubmit={requestGame.bind(this)}>
             <input type="submit" className="navlink navbtn" value="New Game"/>
           </form>
  }

  // Read each Species node positions from the Stage,
  // and calculate in which category the player put them into.
  const extractCategorization = (): Array<Array<string>> => {
    var breakpoints = generateBreakPoints(
      gameSession.nbGroups,
      stage.props.width
    );

    var results: string[][] = new Array(breakpoints.length)
        .fill(false)
        .map(() => []);

    // Iterate over our species card tracker.
    Object.entries(speciesCards).forEach(entry => {
      const [speciesName, posX]: [string, unknown] = entry;
      var category: number = 0;
      breakpoints.forEach((breakpoint: number, index: number) => {
        if (posX > breakpoint) {
          category = index;
        }
      });
      results[category].push(speciesName);
    });
    return results;
  }

  const toggleScore = () => {
    setSeen(!seen);

  };

  const submitGroups = event => {

    event.preventDefault();

    var answerData = {
      speciesGroups: extractCategorization.bind(this)(),
      answerTaxonomicDiscriminators: gameSession.gameTaxonomicDiscriminators
    }

    console.log("Submitting response", answerData);

    backendRequest('/game/answer', answerData)
      .then((response) => {
        setLoading(false);
        setScoreResult(response.data.gameResultScore);

        console.log("Score response", response);
        toggleScore();
      });
  }


  useEffect(() => {

    if (!isGameRunning()) {
      requestGame(undefined);
    }
  }, [isGameRunning, requestGame, speciesCards, resetState]);

  if (loading) {
    <Loading />
  }

  //var noGame = false;
  if (isGameRunning()) {
    //return renderStage();
    requestGame.bind(this);
  }

  return renderStage();

}

interface ScoreWindowProps {
  score: number;
  speciesCards: any;
}

const ScoreWindow = (props: ScoreWindowProps) => {
  return (
    <div className="score-panel">
      <span className="score-view">Score: {Math.round(props.score * 100)}%</span>
      <br/>
      <span>{JSON.stringify(props.speciesCards)}</span>
    </div>
  );
};

export default GameWindow;
