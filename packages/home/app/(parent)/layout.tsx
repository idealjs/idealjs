"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { proxy, useSnapshot } from "valtio";

interface IProps {}

const Layout = (props: PropsWithChildren<IProps>) => {
  const { children } = props;

  return (
    <ProxyContext.Provider value={layoutProxy}>
      {children}
    </ProxyContext.Provider>
  );
};

export default Layout;

export const layoutProxy = proxy({
  pageName: "page",
});

export const ProxyContext = createContext(layoutProxy);

export const usePageName = () => {
  const context = useContext(ProxyContext);
  const layout = useSnapshot(context);
  return layout.pageName;
};
