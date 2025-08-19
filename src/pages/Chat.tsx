import { ChatInterface } from "../sections/chat";

const Chat = () => {
    return (
        <main className="mx-auto">
            <ChatInterface onBack={() => { /* handle back action */ }} />
        </main>
    );
}
 
export default Chat;