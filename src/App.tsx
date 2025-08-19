import { useState } from "react";
import ChatInterface from "./sections/chat/ChatInterface";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Home, NotFound } from "./pages";

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleBack = () => {
    setShowChat(false);
  };

  if (showChat) {
    return <ChatInterface onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]"> 
      <Routes>
        <Route path="/">
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="chat"
              element={<ChatInterface onBack={handleBack} />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
