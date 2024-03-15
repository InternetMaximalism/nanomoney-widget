"use client";

import NanoMoneyWidget from "nanomoney-widget";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const walletWidget = new NanoMoneyWidget(containerRef.current.id, {
        clientId: "your-client-id",
      });
      walletWidget.mount();
    }

    return () => {
      const container = document.getElementById("widget-container");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div id="widget-container" ref={containerRef} style={{ position: "fixed", bottom: "0", right: "0" }} />
  );
}
