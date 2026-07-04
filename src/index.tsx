import "./fonts.scss";
import "./style.css";

import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";
import { NotFound } from "./pages/_404.jsx";
import { Home } from "./pages/Home.js";

export function App() {
    return (
        <LocationProvider>
            <main class="p-0 md:p-8 min-h-dvh overflow-y-auto!">
                <Router>
                    <Route path="/" component={Home} />
                    <Route default component={NotFound} />
                </Router>
            </main>
        </LocationProvider>
    );
}

render(<App />, document.getElementById("app"));
