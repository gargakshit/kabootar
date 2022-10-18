import type { Component } from "solid-js";
import { Route, Router, Routes } from "@solidjs/router";

import HomePage from "./pages/Home";
import DiscoverPage from "./pages/Discover";

const App: Component = () => {
  return (
    <main class="h-full">
      <Router>
        <Routes>
          <Route path="/" component={HomePage} />
          <Route path="/discover" component={DiscoverPage} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
