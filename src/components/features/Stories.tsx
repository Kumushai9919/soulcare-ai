const Stories = () => {
  const stories = [
    {
      title: "Finding Peace in Daily Life",
      description:
        "Sarah shares how Soulcare helped her manage stress and find balance in her busy schedule.",
      image: "/path-to-sarah-image.jpg",
    },
    {
      title: "Overcoming Anxiety with AI Support",
      description:
        "Mark recounts his journey of overcoming anxiety with the guidance and support of Soulcare.",
      image: "/path-to-mark-image.jpg",
    },
    {
      title: "Building Resilience Through Mindfulness",
      description:
        "Emily describes how Soulcare's mindfulness exercises helped her build resilience.",
      image: "/path-to-emily-image.jpg",
    },
  ];

  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold mb-12 text-center">
        Stories of Transformation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <div key={index} className="card p-6">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{story.title}</h3>
            <p className="text-gray-300">{story.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stories;
