"use client";
import { Toaster } from "react-hot-toast";
//  layout.tsx 是 server component 所以用一個 Client Provider 來包覆 才能使用全域的 Toaster
function ClientProvider() {
  return (
    <>
      <Toaster position="top-right" />
    </>
  );
}

export default ClientProvider;
