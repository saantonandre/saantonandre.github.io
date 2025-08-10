import gamesData from "./games_data.json";
import GameCard from "./GameCard";
import { useRef } from "react";
import PageHeader from "../PageHeader";
import { useNavigate, useParams } from "react-router-dom";

const GamesPage = () => {
  const top = useRef(null);
  let { game } = useParams();
  let navigate = useNavigate();

  return (
    <div ref={top}>
      <PageHeader section="games"/>
      {gamesData.hasOwnProperty(game) && (
        <GameCard
          gameData={gamesData[game]}
          expanded={true}
          className="m-3 mw-100 shadow d-flex justify-content-center"
          style={{ maxWidth: "1000px" }}
          key={`${game}-card`}
        />
      )}
      <div className="d-flex flex-row flex-wrap justify-content-center">
        {Object.values(gamesData).map((gameData) => {
          if (gameData.path !== game) {
            return (
              <GameCard
                gameData={gameData}
                expanded={false}
                onClick={() => {
                  top.current.scrollIntoView();
                  navigate("/games/" + gameData.path);
                }}
                className="m-3 shadow"
                key={`${gameData.path}-card`}
              />
            );
          } else {
            return <div key={gameData.title}></div>;
          }
        })}
      </div>
    </div>
  );
};
export default GamesPage;
