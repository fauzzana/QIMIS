"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// The component you want to print
const PrintableComponent = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} className="p-10 border">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPd5RjCvM-2MHiXMgGiWE5FYEbYT-INCvIPg&s"
      alt="QR Code"
    />
  </div>
));

PrintableComponent.displayName = "PrintableComponent";

export default function PrintPage() {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Invoice_12345",
  });

  return (
    <div className="p-5">
      <PrintableComponent ref={componentRef} />
      <button
        onClick={() => handlePrint()}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Print Component
      </button>
    </div>
  );
}
