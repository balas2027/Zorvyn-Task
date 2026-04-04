import { useContext } from "react";
import { ActionNotifierContext } from "@/context/ActionNotifierContext";

export function useActionNotifier() {
  const context = useContext(ActionNotifierContext);

  if (!context) {
    throw new Error(
      "useActionNotifier must be used inside ActionNotifierProvider",
    );
  }

  return context;
}
