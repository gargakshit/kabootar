import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { MetaProvider } from "@solidjs/meta";
import type { Component } from "solid-js";

import HomePage from "./pages/Home";
import DiscoverPage from "./pages/Discover";
import SharePage from "./pages/Share";

const App: Component = () => {
  return (
    <MetaProvider>
      <main class="h-full">
        <Router>
          <Routes>
            <Route path="/" component={HomePage} />
            <Route path="/discover" component={DiscoverPage} />
            <Route path="/:id" component={SharePage} />
            <Route path="*404" component={() => <Navigate href="/" />} />
          </Routes>
        </Router>
      </main>
    </MetaProvider>
  );
};

export default App;
