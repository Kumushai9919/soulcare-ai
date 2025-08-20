import { Hero} from "../sections/home";

const Home = () => {
  const handleStartChat = () => {
    console.log("Chat started");
  };

  return (
    <main className="mx-auto">
      <Hero onStartChat={handleStartChat} /> 
    </main>
  );
};

export default Home;
