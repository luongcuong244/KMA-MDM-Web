import React from "react";
import { motion } from "framer-motion";

const CircleLoader = ({
  size = 30,
  strokeWidth = 5,
  color = "black",
  backgroundColor = "white",
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${strokeWidth} solid ${backgroundColor}`,
        borderTop: `${strokeWidth} solid ${color}`,
      }}
    ></motion.div>
  );
};

export default CircleLoader;
