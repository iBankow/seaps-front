import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface DialogContextType {
  // Observation Dialog
  observationDialog: {
    isOpen: boolean;
    item: any;
    status: string;
    open: (item: any, status: string) => void;
    close: () => void;
  };
  // Image Dialog  
  imageDialog: {
    isOpen: boolean;
    item: any;
    index?: number;
    open: (item: any, index?: number) => void;
    close: () => void;
  };
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  // Observation Dialog State
  const [observationOpen, setObservationOpen] = useState(false);
  const [observationItem, setObservationItem] = useState<any>(null);
  const [observationStatus, setObservationStatus] = useState<string>("");

  // Image Dialog State
  const [imageOpen, setImageOpen] = useState(false);
  const [imageItem, setImageItem] = useState<any>(null);
  const [imageIndex, setImageIndex] = useState<number | undefined>(undefined);

  const value: DialogContextType = {
    observationDialog: {
      isOpen: observationOpen,
      item: observationItem,
      status: observationStatus,
      open: (item: any, status: string) => {
        setObservationItem(item);
        setObservationStatus(status);
        setObservationOpen(true);
      },
      close: () => {
        setObservationOpen(false);
        setObservationItem(null);
        setObservationStatus("");
      },
    },
    imageDialog: {
      isOpen: imageOpen,
      item: imageItem,
      index: imageIndex,
      open: (item: any, index?: number) => {
        setImageItem(item);
        setImageIndex(index);
        setImageOpen(true);
      },
      close: () => {
        setImageOpen(false);
        setImageItem(null);
        setImageIndex(undefined);
      },
    },
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
}
