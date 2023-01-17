import { createContext, useContext, useState } from "react";

export const SubmittedContext = createContext();
export const useSubmitted = () => useContext(SubmittedContext);

export default function SubmittedProvider(props) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SubmittedContext.Provider
      value={{
        submitted,
        setSubmitted,
      }}
    >
      {props.children}
    </SubmittedContext.Provider>
  );
}
