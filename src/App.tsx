import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import { EntriesProvider } from "./components/EntriesProvider";

function App() {
    return (
        <>
            <Header />
            <EntriesProvider>
                <Main />
            </EntriesProvider>
        </>
    );
}

export default App;
