import { motion } from "framer-motion";

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8 relative"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-3xl md:text-5xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        Welcome to TourismSpot GPT!
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl text-foreground/70"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        Your personal travel advisor for discovering amazing destinations worldwide.
      </motion.div>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="text-6xl md:text-8xl mt-8 text-center"
        exit={{ opacity: 0, scale: 0.8 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.7 }}
      >
        🌍✈️🗺️
      </motion.div>
    </div>
  );
};
