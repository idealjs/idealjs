"use client";

import { PropsWithChildren } from "react";

import { layoutProxy, ProxyContext } from "../components/LayoutProvider";

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
