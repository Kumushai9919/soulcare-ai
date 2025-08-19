import { useNavigate } from "react-router-dom";
 

type HeroProps = {
  onStartChat: () => void;
};

export default function Hero({ onStartChat }: HeroProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="py-40 flex items-center flex-col justify-center mx-auto">
        <img
          src="/soul2.png"
          alt="Hero"
          className="w-80 h-80 object-cover rounded-lg mb-8 text-center"
        />
        <div className="text-2xl font-semibold mb-4 text-white">
          Welcome to Soulcare
        </div>
      </div>
      <div className="hero-section">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Your AI Companion for Mental Wellness
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Soulcare offers personalized support and guidance to help you
            navigate life's challenges and achieve emotional well-being.
          </p>
            <button
              onClick={() => {
              onStartChat(); 
              navigate('/chat');
              }}
              className="button-primary text-lg px-8 py-4"
            >
              Start Chatting
            </button>
        </div>
      </div>
    </>
  );
}