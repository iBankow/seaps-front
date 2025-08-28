import { useState } from "react";

export const useModal = (defaultVisible = false) => {
  const [visible, setVisible] = useState(defaultVisible);
  const [index, setIndex] = useState(0);

  const show = () => setVisible(true);
  const hide = () => {
    setVisible(false);
    setIndex(0);
  };

  const showIndex = (index: number) => {
    setVisible(true);
    setIndex(index);
  };

  const toggle = (nextVisible: any) => {
    if (typeof nextVisible !== "undefined") {
      setVisible(nextVisible);
    } else {
      setVisible((previousVisible) => !previousVisible);
    }
  };

  return { hide, show, showIndex, toggle, index, visible };
};
