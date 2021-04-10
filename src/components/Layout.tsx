import React, { useCallback, useRef } from "react";
import Header from "./Header";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  const childrenRef = useRef(null);
  const scrollToChildren = useCallback(() => {
    childrenRef?.current.scrollIntoView(childrenRef);
  }, [childrenRef]);

  return (
    <>
      <div className={styles.fixedBackgroudImage}></div>
      <Header onClickScrollDown={scrollToChildren} />
      <div className={styles.content} ref={childrenRef}>
        {children}
      </div>
    </>
  );
}
