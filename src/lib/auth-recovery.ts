import { createContext, useContext } from "react";

export const RecoveryContext = createContext(false);
export function useRecoverySession() {
  return useContext(RecoveryContext);
}