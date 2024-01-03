import { useMemo, createContext, useContext } from "react";

/**
 * @typedef MyContextObject
 * @property {string} a
 * @property {string} b
 */

/**
 * @type {import('react').Context<MyContextObject>} MyContext
 */
export const MyContext = createContext(null);
MyContext.displayName = "MyContext";

/**
 * React hook for retrieving the My context.
 *
 * @returns {MyContextObject}
 */
export function useMy() {
  return useContext(MyContext);
}

/**
 * @typedef ProviderProps
 * @property {string} aProp
 * @property {string} bProp
 * @property {import('react').ReactNode | ((context: MyContextObject) => import('react').ReactNode)} children
 */

/**
 * React provider component to expose the current ENV to child components,
 * including federated modules.
 *
 * @param {ProviderProps}  props
 * @returns {import('react').ReactComponentElement<any,any> | import('react/jsx-dev-runtime').JSX.Element}
 * @component
 */
export function Provider({ aProp, bProp, children }) {
  const context = /** @type {MyContextObject} */ (
    useMemo(
      () => ({
        a: aProp,
        b: bProp,
      }),
      [aProp, bProp],
    )
  );

  // if we receive a function, execute it and pass in the client
  if (typeof children === "function") {
    // eslint-disable-next-line no-param-reassign
    children = /** @type {import('react').ReactNode} */ (children(context));
  }

  return <MyContext.Provider value={context}>{children}</MyContext.Provider>;
}
