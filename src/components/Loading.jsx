import "../../src/styles/authCss/loading.css";
import { DotLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className="loadingmain">
      <div className="loadingcircle">
        <div className="loadinginnercircle"></div>
      </div>
      <div className="loadingcircle1">
        <div className="loadinginnercircle1"></div>
      </div>
      <div className="loadinggoldsmallcircle"></div>
      <div className="loadinggoldsmallcircle1"></div>
      <section className="Loadingcontainer">
        <div className="loadingtext">
          <h1>Loading...</h1>
        </div>
        <div className="loadingimg">
          <DotLoader size={100} color="#804BF2" speedMultiplier={3} />
        </div>
        <div className="loadingtext2">
          <p>Just a moment</p>
        </div>
      </section>
    </div>
  );
};

export default Loading;
