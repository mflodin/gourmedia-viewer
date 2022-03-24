import * as React from "react";
// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number | undefined;
  height: number | undefined;
}

export function useWindowSize(): Size {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState<Size>({
      width: undefined,
      height: undefined,
    });
    React.useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  }