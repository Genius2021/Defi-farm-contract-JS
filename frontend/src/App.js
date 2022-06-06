import { DAppProvider, ChainId } from "@usedapp/core"
import { Header } from "./components/Header"
import { Main } from "./components/Main"



function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby, 1337]
    }}>
      <div className="App">
        <Header />
        <Main />
      </div>
    </DAppProvider>

  );
}

export default App;
