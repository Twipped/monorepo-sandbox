import { useMemo } from "react";
import { MyContext } from "./context";

/** @typedef {import('./context').MyContextObject} MyContextObject */

/**
 * @typedef MockProviderProps
 * @property {import('react').ReactNode | ((context: MyContextObject) => import('react').ReactNode)} children
 */

/**
 * React provider component to expose the current ENV to child components,
 * including federated modules.
 *
 * @param {MockProviderProps}  props
 * @returns {import('react').ReactComponentElement<any,any> | import('react/jsx-dev-runtime').JSX.Element}
 * @component
 */
export function MockProvider({ children }) {
  const context = /** @type {MyContextObject} */ (
    useMemo(
      () => ({
        a: "a",
        b: "b",
      }),
      [],
    )
  );

  // if we receive a function, execute it and pass in the client
  if (typeof children === "function") {
    // eslint-disable-next-line no-param-reassign
    children = /** @type {import('react').ReactNode} */ (children(context));
  }

  return <MyContext.Provider value={context}>{children}</MyContext.Provider>;
}
