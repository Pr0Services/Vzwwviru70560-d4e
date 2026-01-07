import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UniverseView from "./views/UniverseView";
import SphereView from "./views/SphereView";
import { loadSession } from "./state/sessionStore";

export default function App() {
  const session = loadSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session && session.lastRoute !== "/" ? (
              <Navigate to={session.lastRoute} replace />
            ) : (
              <UniverseView />
            )
          }
        />
        <Route path="/sphere/:id" element={<SphereView />} />
      </Routes>
    </BrowserRouter>
  );
}
