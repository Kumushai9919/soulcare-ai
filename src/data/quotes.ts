export const inspirationalQuotes = [
  "It's okay to take things one day at a time",
  "Your feelings are valid",
  "Small steps still move you forward",
  "You don't have to have it all figured out",
  "It's okay to rest and recharge",
  "Every small win counts",
  "You are stronger than you think",
  "Progress over perfection",
  "It's okay to want more, do more, be more",
  "Your journey is unique, and that's beautiful"
];

export const getRandomQuote = () => {
  return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
};
