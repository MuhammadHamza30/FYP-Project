import Routes from "./Routes";
import store from "./store";
import { Provider } from "react-redux";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Routes />;
    </Provider>
  );
}

export default App;
