import { AuthSync } from "./components/AuthSync";
import Routes from "./Routes";
import store from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <AuthSync>
        <Routes />
      </AuthSync>
    </Provider>
  );
}

export default App;
