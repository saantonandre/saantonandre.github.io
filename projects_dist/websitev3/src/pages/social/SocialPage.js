import PageHeader from "../PageHeader";
import { Timeline, Follow } from "react-twitter-widgets";
const SocialPage = () => {
  return (
    <div>
      <PageHeader section="social" />

      <div className="d-flex flex-column justify-content-center align-items-center">
        <span className="px-font my-3 fs-3">Twitter</span>
        <Follow username="saantonandre" options={{ size: "large" }} />
        <div className="col-8 m-3" style={{ height: "400px" }}>
          <Timeline
            dataSource={{ sourceType: "profile", screenName: "saantonandre" }}
            options={{ theme: "dark", width: "100%", height: "400px" }}
          />
        </div>
        <span className="px-font my-3 fs-3">Youtube</span>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/4Bn5N3u1EE4"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-3"
          ></iframe>
      </div>
    </div>
  );
};
export default SocialPage;
