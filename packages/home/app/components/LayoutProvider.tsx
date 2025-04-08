import { createContext, useContext } from "react";
import { proxy, useSnapshot } from "valtio";

export const layoutProxy = proxy({
  pageName: "page",
});

export const ProxyContext = createContext(layoutProxy);

export const usePageName = () => {
  const context = useContext(ProxyContext);
  const layout = useSnapshot(context);
  return layout.pageName;
};
