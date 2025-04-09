import React from "react";
import { motion } from "framer-motion";

const Loader = ({ width = "30px", color = "black" }) => {
  const loadingContainer = {
    width: width,
    display: "flex",
    y: "-30%",
    justifyContent: "space-around",
  };

  const loadingCircleSize = {
    width: `calc(${width} / 4)`,
    height: `calc(${width} / 4)`,
  };

  const loadingCircle = {
    display: "block",
    backgroundColor: color,
    borderRadius: "200px",
    ...loadingCircleSize,
  };

  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const loadingCircleVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "60%",
    },
  };
  const loadingCircleTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <motion.div
      style={loadingContainer}
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
    >
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      ></motion.span>
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      ></motion.span>
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      ></motion.span>
    </motion.div>
  );
};

export default Loader;
