"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  xlxsDownloadSchema,
  type TeamEstimationSchema,
  ProcessType,
  type XlxsDownload,
  Responsibility,
} from "@/feature/xlsx-preview/schema/configXlxsDownloadSchema";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import ErrorMessage from "@/components/ErrorMessage";
import { SPRINT_COLOR } from "@/feature/xlsx-preview/constants/sprintColor";
import { convertToOrdinal } from "@/lib/formatter";
import { useXlsxSettingsState } from "../context/XlsxSettingsContext";
import AddPositionDialog from "./AddPositionDialog";

const teamEstimationSchemaArr = xlxsDownloadSchema.pick({
  teamEstimation: true,
});
type TeamEstimationSchemaArr = z.infer<typeof teamEstimationSchemaArr>;

export default function TeamEstimationForm({
  onPrevious,
  onNext,
}: {
  onPrevious: () => void;
  onNext: (data: Partial<XlxsDownload>) => void;
}) {
  const { xlsxSettings } = useXlsxSettingsState();
  const form = useForm<TeamEstimationSchemaArr>({
    resolver: zodResolver(teamEstimationSchemaArr),
    defaultValues: {
      teamEstimation: xlsxSettings.teamEstimation.length
        ? xlsxSettings.teamEstimation
        : defaultTeamEstimation,
    },
  });
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    mode: "add" | "update";
    idx?: number;
    detail?: TeamEstimationSchema;
  }>({
    isOpen: false,
    mode: "add",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "teamEstimation",
  });

  const handleAdd = (
    values: TeamEstimationSchemaArr["teamEstimation"][number]
  ) => {
    append({
      ...values,
    });

    closePopup();
  };

  function handleUpdate(
    values: TeamEstimationSchemaArr["teamEstimation"][number]
  ) {
    update(popupState.idx!, values);
    closePopup();
  }

  function openAddPopup() {
    setTimeout(() => {
      setPopupState({
        isOpen: true,
        mode: "add",
      });
    }, 0);
  }

  function openUpdatePopup(detail: TeamEstimationSchema, idx: number) {
    setPopupState({
      isOpen: true,
      mode: "update",
      idx,
      detail,
    });
  }

  function closePopup() {
    setPopupState({
      isOpen: false,
      mode: "add",
    });
  }

  function onSubmit(data: TeamEstimationSchemaArr) {
    onNext(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full lg:w-2/3 mx-auto min-h-[500px]">
          <CardContent>
            <Table className="mb-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Position</TableHead>
                  <TableHead className="min-w-[150px]">
                    Sotatek Responsibility
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    Client Responsibility
                  </TableHead>
                  <TableHead className="min-w-[150px]">Man-month</TableHead>
                  <TableHead className="min-w-[250px]">Proccess</TableHead>
                  <TableHead className="min-w-[150px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((row, idx) => (
                  <TableRow key={row.id} className="h-[50px]">
                    <TableCell>{row.position}</TableCell>
                    <TableCell>{row.sotatekResponsibility}</TableCell>
                    <TableCell>{row.clientResponsibility}</TableCell>
                    <TableCell>{row.manMonth}</TableCell>
                    <TableCell>
                      {row.process &&
                      Array.isArray(row.process) &&
                      row.process.length > 0 ? (
                        <ul className="space-y-2">
                          {row.process.map((proc, idx) => (
                            <li
                              key={idx}
                              className="flex flex-col items-start gap-2 p-2 rounded hover:bg-gray-100 transition-colors"
                              style={{
                                borderLeft: `4px solid #${
                                  SPRINT_COLOR[proc.processType]
                                }`,
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Stage:</span>
                                {proc.processType}

                                <span
                                  className="inline-block border w-[20px] h-[20px] rounded mr-1"
                                  style={{
                                    background: `#${
                                      SPRINT_COLOR[proc.processType]
                                    }`,
                                  }}
                                />
                              </div>

                              <div>
                                <span className="font-semibold">Duration:</span>{" "}
                                {`${convertToOrdinal(
                                  proc.start
                                )} sprint - ${convertToOrdinal(
                                  proc.end
                                )} sprint`}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted-foreground">
                          No process
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={openUpdatePopup.bind(null, row, idx)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={remove.bind(null, idx)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Show error message if teamEstimation array is empty and touched */}
            {form.formState.errors.teamEstimation && (
              <ErrorMessage className="mb-2">
                {form.formState.errors.teamEstimation.message?.toString()}
              </ErrorMessage>
            )}

            <AddPositionDialog
              openAddPopup={openAddPopup}
              key={`AddPositionDialog_${popupState.mode}`}
              xlsxSettings={xlsxSettings}
              open={popupState.isOpen}
              closePopup={closePopup}
              defaultValue={popupState.detail}
              onSubmit={popupState.mode === "add" ? handleAdd : handleUpdate}
            />
          </CardContent>

          <div className="flex-grow" />
          <CardFooter>
            <Button variant="ghost" onClick={onPrevious}>
              Previous
            </Button>

            <Button variant="ghost" type="submit">
              Next
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

const defaultTeamEstimation = [
  {
    position: "PM cum BA",
    manMonth: 2.75,
    sotatekResponsibility: Responsibility.RESPONSIBLE,
    clientResponsibility: Responsibility.NOT_APPLICABLE,
    process: [
      {
        processType: ProcessType.DEFINE,
        start: 0,
        end: 5,
      },
    ],
  },
  {
    position: "Designer",
    manMonth: 1,
    sotatekResponsibility: Responsibility.RESPONSIBLE,
    clientResponsibility: Responsibility.NOT_APPLICABLE,
    process: [
      {
        processType: ProcessType.DESIGN_AND_CODE,
        start: 0,
        end: 1,
      },
    ],
  },
  {
    position: "Frontend developer",
    manMonth: 2,
    sotatekResponsibility: Responsibility.RESPONSIBLE,
    clientResponsibility: Responsibility.NOT_APPLICABLE,
    process: [
      {
        processType: ProcessType.DESIGN_AND_CODE,
        start: 2,
        end: 3,
      },
      {
        processType: ProcessType.UAT,
        start: 4,
        end: 5,
      },
    ],
  },
  {
    position: "Backend developer",
    manMonth: 2.75,
    sotatekResponsibility: Responsibility.RESPONSIBLE,
    clientResponsibility: Responsibility.NOT_APPLICABLE,
    process: [
      {
        processType: ProcessType.DESIGN_AND_CODE,
        start: 2,
        end: 3,
      },
      {
        processType: ProcessType.UAT,
        start: 4,
        end: 5,
      },
      {
        processType: ProcessType.RELEASE,
        start: 6,
        end: 6,
      },
    ],
  },
  {
    position: "Tester",
    manMonth: 3.5,
    sotatekResponsibility: Responsibility.RESPONSIBLE,
    clientResponsibility: Responsibility.NOT_APPLICABLE,
    process: [
      {
        processType: ProcessType.TESTING,
        start: 2,
        end: 5,
      },
    ],
  },
  {
    position: "Korean Communicator",
    manMonth: 2.5,
    sotatekResponsibility: Responsibility.RESPONSIBLE,
    clientResponsibility: Responsibility.NOT_APPLICABLE,
    process: [
      {
        processType: ProcessType.NONE,
        start: 0,
        end: 4,
      },
    ],
  },
];
