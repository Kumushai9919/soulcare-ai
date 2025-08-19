import { Features } from "../sections/home";

 

const Home = () => {
    const handleStartChat = () => { 
        console.log("Chat started");
    };

    return (
        <main className="mx-auto">
            <Features onStartChat={handleStartChat} />
        </main>
    );
}

export default Home;
