/// <reference types="vite/client" />

interface NetworkInformation {
  readonly effectiveType?: string;
  readonly saveData?: boolean;
}

interface Navigator {
  readonly connection?: NetworkInformation;
}
