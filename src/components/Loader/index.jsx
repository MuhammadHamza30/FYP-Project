import Lottie from "react-lottie-player";
import SpinnerJSon from "./spinner.json";

export const Loader = () => {
  return (
    <div className="loader-container">
      <Lottie
        loop
        animationData={SpinnerJSon}
        play
        style={{ width: 200, height: 100 }}
      />
    </div>
  );
};
