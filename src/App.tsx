import PreviewTable from "./feature/xlsx-preview/component/PreviewTable";
import { Fragment, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./components/ui/breadcrumb";
import { cn } from "./lib/utils";
import ConfigurationForm from "@/feature/xlsx-preview/component/ConfigurationForm";
import type { XlxsDownload } from "./feature/xlsx-preview/schema/configXlxsDownloadSchema";
import TeamEstimationForm from "./feature/xlsx-preview/component/TeamEstimationForm";
import { useXlsxSettingsDispatch } from "./feature/xlsx-preview/context/XlsxSettingsContext";

const STEP_OPTIONS = ["Configuration", "Set up", "Preview"];

function App() {
  const [step, setStep] = useState(0);
  const { setXlxsSetting } = useXlsxSettingsDispatch();

  const onPrevious = () => {
    setStep((pre) => pre - 1);
  };

  const onNext = (data: Partial<XlxsDownload>) => {
    setXlxsSetting((pre) => ({ ...pre, ...data }));
    setStep((pre) => pre + 1);
  };

  function renderPageNavigation() {
    return (
      <Breadcrumb className="mx-auto">
        <BreadcrumbList>
          {STEP_OPTIONS.map((item, idx) => {
            const Component = idx === step ? BreadcrumbPage : "div";
            return (
              <Fragment key={item}>
                <BreadcrumbItem>
                  <Component> {item}</Component>
                </BreadcrumbItem>
                {idx < STEP_OPTIONS.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const renderStepContent = () => {
    const Component = {
      0: <ConfigurationForm onNext={onNext} />,
      1: <TeamEstimationForm onNext={onNext} onPrevious={onPrevious} />,
      2: <PreviewTable onPrevious={onPrevious} />,
    }[step];

    return <div className={cn("mt-10 w-full")}>{Component}</div>;
  };

  return (
    <main className="flex flex-col mx-3 my-10">
      {renderPageNavigation()}
      {renderStepContent()}
    </main>
  );
}

export default App;
