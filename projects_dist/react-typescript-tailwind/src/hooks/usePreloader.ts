let preloaded = false;

export const usePreloader = (images: string[]) => {
  if (preloaded) return false;
  for (let src of images) {
    new Image().src = src;
  }
  preloaded = true;
};

export default usePreloader;