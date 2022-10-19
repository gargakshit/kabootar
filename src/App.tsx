import type { Component } from "solid-js";
import { Route, Router, Routes } from "@solidjs/router";

import HomePage from "./pages/Home";
import DiscoverPage from "./pages/Discover";
import { MetaProvider } from "@solidjs/meta";

const App: Component = () => {
  return (
    <MetaProvider>
      <main class="h-full">
        <Router>
          <Routes>
            <Route path="/" component={HomePage} />
            <Route path="/discover" component={DiscoverPage} />
          </Routes>
        </Router>
      </main>
    </MetaProvider>
  );
};

export default App;
