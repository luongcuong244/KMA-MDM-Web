import { useState, useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const useNavigationChecking = () => {
  const [keys, setKeys] = useState([]);
  const [previousKey, setPreviousKey] = useState("?");
  const { pathname, key } = useLocation();
  const type = useNavigationType();

  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (key == "default") {
      if (keys.indexOf(key) != -1) {
        setKeys([...keys, key]);
      }
      if (keys.indexOf(key) < keys.indexOf(previousKey)) {
        setCanGoForward(true);
      }
      setCanGoBack(false);
      return;
    }

    setCanGoBack(true);

    if (type === "POP") {
      if (!keys.includes(key)) {
        setKeys([...keys, key]);
        setPreviousKey(key);
        setCanGoForward(false);
      } else if (keys.indexOf(key) < keys.indexOf(previousKey)) {
        setCanGoForward(true);
      } else {
        setCanGoForward(false);
      }
    } else {
      setCanGoForward(false);
      setKeys([...keys, key]);
      setPreviousKey(key);
    }

    return () => {};
  }, [pathname, type]);

  return [canGoBack, canGoForward];
};

export default useNavigationChecking;
