import React from "react";
import { BallTriangle } from "react-loader-spinner";

function LoderComponent() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        visible={true}
      />
    </div>
  );
}

export default LoderComponent;
