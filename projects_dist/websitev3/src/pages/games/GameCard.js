import { useNavigate } from "react-router-dom";

const fetchDomain = (url) => {
  let splitArray = url.split("/");
  for (let i = 0; i < splitArray.length; i++) {
    if (splitArray[i].includes(".")) {
      return "https://" + splitArray[i];
    }
  }
  return "";
};

const GameCard = ({
  gameData = {},
  onClick = () => {},
  expanded = false,
  ...props
}) => {
  const gamesPath = "/games/";
  const imagesPath = "/images/";
  const navigate = useNavigate();

  return (
    <div {...props}>
      <div
        className={`d-flex flex-wrap p-2 bg-black position-relative ${
          expanded ? "flex-row" : "flex-column"
        }`}
      >
        {expanded ? (
          <div className="flex-grow-1 mw-50 d-flex align-items-center justify-content-center p-2">
            {/* Video Preview */}
            <div className="position-relative w-100">
              <video autoPlay muted loop width="100%">
                <source
                  type="video/mp4"
                  src={`${gamesPath + gameData.path}/preview.mp4`}
                />
              </video>
              <div className="d-flex position-absolute justify-content-center align-items-center top-0 left-0 w-100 h-100 fade-over">
                <div
                  onClick={() => navigate(`../player/${gameData.path}`)}
                  role="button"
                  className="fs-1 px-font"
                >
                  PLAY
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            role="button"
            onClick={onClick}
            className="d-flex position-relative justify-content-end"
          >
            {/* Image Preview */}
            <img
              src={`${gamesPath + gameData.path}/thumb.png`}
              alt={`${gameData.path} thumbnail`}
              width="315px"
              height="250px"
            />
            <img
              className="position-absolute"
              src={`${imagesPath}shine-effect.gif`}
              alt={`shine effect`}
              width="100%"
              height="100%"
            />
            <img
              className="position-absolute floating"
              src={`${imagesPath}glass.png`}
              alt={`glass`}
              style={{ bottom: "54px", right: "12px" }}
            />
          </div>
        )}
        {/* Title / Description / Links */}
        <div
          className={`d-flex flex-column bg-black flex-1 p-1 ${
            expanded || "position-absolute bottom-0"
          }`}
          style={{ minWidth: "250px" }}
        >
          <div className={`bg-black text-center px-font fs-5`}>
            {gameData.title}
          </div>
          {expanded && (
            <>
              <div className="d-inline text-left fs-5 bottom-0 p-4">
                {gameData.description}
              </div>
              <span className="px-font p-3">Publishers:</span>
              <div className="d-flex flex-row flex-wrap justify-content-center">
                {gameData.links.map((link, index) => {
                  return (
                    <a
                      key={index}
                      rel="noreferrer"
                      target="_blank"
                      title={new URL(link).hostname}
                      href={link}
                    >
                      <img
                        width="32px"
                        height="32px"
                        className="m-1"
                        src={`https://www.google.com/s2/favicons?sz=64&domain=${fetchDomain(
                          link
                        )}`}
                        alt="game-link"
                      />
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default GameCard;
