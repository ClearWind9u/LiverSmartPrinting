import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.h1
        className="text-[100px] font-bold text-white"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-[20px] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Page Not Found
      </motion.p>
      <Link to="/" className="mt-4 text-white hover:underline">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
