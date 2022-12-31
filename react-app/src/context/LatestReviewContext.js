import { createContext, useContext, useState } from "react";

export const LatestReviewContext = createContext();
export const useLatestReview = () => useContext(LatestReviewContext);

export default function LatestReviewProvider(props) {
  const [latestReview, setLatestReview] = useState();

  return (
    <LatestReviewContext.Provider
      value={{
        latestReview,
        setLatestReview,
      }}
    >
      {props.children}
    </LatestReviewContext.Provider>
  );
}
