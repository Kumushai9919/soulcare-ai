import { useEffect } from "react";
import { ChatInterface } from "../sections/chat";
import { useLayout } from "../context/LayoutContext";

const Chat = () => {
    const { setShowFooter } = useLayout();

    useEffect(() => {
        setShowFooter(false);
        return () => setShowFooter(true);
    }, [setShowFooter]);

    return (
        <main className="h-screen overflow-hidden">
            <ChatInterface onBack={() => {}} />
        </main>
    );
}

export default Chat;