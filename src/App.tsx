import { Route, Routes } from "react-router-dom";
import ChatInterface from "./sections/chat/ChatInterface";
import DefaultLayout from "./components/layout/DefaultLayout";
import { Home, NotFound } from "./pages";
import { LayoutProvider } from "./context/LayoutContext";

function App() {
  return (
    <LayoutProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Routes>
          <Route path="/chat" element={<ChatInterface onBack={() => {}} />} />
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </LayoutProvider>
  );
}

export default App;
