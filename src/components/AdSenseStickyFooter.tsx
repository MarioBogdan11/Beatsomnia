import React, { useEffect } from "react";

const AdSenseStickyFooter = () => {
  useEffect(() => {
    // @ts-ignore
    if (window.adsbygoogle && process.env.NODE_ENV === "production") {
      // @ts-ignore
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        background: "rgba(24,24,72,0.97)",
        zIndex: 10000,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.16)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 0",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "60px", textAlign: "center" }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseStickyFooter;