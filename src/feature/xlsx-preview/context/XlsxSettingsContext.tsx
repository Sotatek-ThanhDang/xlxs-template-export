/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { XlxsDownload } from "@/feature/xlsx-preview/schema/configXlxsDownloadSchema";

export type XlsxSettingsDispatch = {
  setXlxsSetting: Dispatch<SetStateAction<XlxsDownload>>;
};

const XlsxSettingsStateContext = createContext<
  { xlsxSettings: XlxsDownload } | undefined
>(undefined);

const XlsxSettingsDispatchContext = createContext<
  XlsxSettingsDispatch | undefined
>(undefined);

//
//
//

export default function XlxsSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [xlsxSettings, setXlxsSetting] = useState<XlxsDownload>({
    configuration: {
      totalMonth: 4,
      sprintEachMonth: 2,
    },
    teamEstimation: [],
  });

  return (
    <XlsxSettingsStateContext.Provider value={{ xlsxSettings }}>
      <XlsxSettingsDispatchContext.Provider value={{ setXlxsSetting }}>
        {children}
      </XlsxSettingsDispatchContext.Provider>
    </XlsxSettingsStateContext.Provider>
  );
}

//
//
//

export const useXlsxSettingsDispatch = () => {
  const context = useContext(XlsxSettingsDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useXlsxSettingsDispatch must be used within a XlsxSettingsDispatchProvider"
    );
  }
  return context;
};

export const useXlsxSettingsState = () => {
  const context = useContext(XlsxSettingsStateContext);
  if (context === undefined) {
    throw new Error(
      "useXlsxSettingsState must be used within a XlsxSettingsStateProvider"
    );
  }
  return context;
};
