 
interface ScoreWindowProps {
  score: number;
  speciesCards: any;
  debug: boolean;
}

const ScoreWindow = (props: ScoreWindowProps) => {
  const information = (
      <><br/>
      <span>{JSON.stringify(props.speciesCards)}</span></>
  )

  return (
    <div className="score-panel">
      <span className="score-view">Score: {Math.round(props.score * 100)}%</span>
      {props.debug ? information : <></>}
    </div>
  );
};

export default ScoreWindow;
