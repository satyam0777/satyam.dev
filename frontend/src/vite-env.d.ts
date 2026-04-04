/// <reference types="vite/client" />

declare module "*.tsx" {
  import React from "react";
}

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_URL?: string;
}
