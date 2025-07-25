import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, useFieldArray } from "react-hook-form";
import { SPRINT_COLOR } from "../constants/sprintColor";
import {
  type XlxsDownload,
  type TeamEstimationSchema,
  teamEstimationSchema,
  Responsibility,
  ProcessType,
} from "../schema/configXlxsDownloadSchema";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { convertToOrdinal } from "@/lib/formatter";

type AddPositionDialogProps = {
  xlsxSettings: XlxsDownload;
  defaultValue?: TeamEstimationSchema;
  open: boolean;
  openAddPopup: () => void;
  closePopup: () => void;
  onSubmit: (values: TeamEstimationSchema) => void;
};

export default function AddPositionDialog({
  xlsxSettings,
  defaultValue,
  open,
  openAddPopup,
  closePopup,
  onSubmit,
}: AddPositionDialogProps) {
  const isUpdate = !!defaultValue;
  const popupForm = useForm<TeamEstimationSchema>({
    resolver: zodResolver(teamEstimationSchema),
    defaultValues: defaultValue ?? {
      position: "",
      sotatekResponsibility: Responsibility.RESPONSIBLE,
      clientResponsibility: Responsibility.NOT_APPLICABLE,
      manMonth: 1,
      process: [],
    },
  });

  const {
    fields: processFields,
    append: appendProcess,
    remove: removeProcess,
  } = useFieldArray({
    control: popupForm.control,
    name: "process",
  });

  const totalSprint =
    xlsxSettings.configuration.totalMonth *
      xlsxSettings.configuration.sprintEachMonth -
    1;

  return (
    <Form {...popupForm}>
      <Dialog open={open} onOpenChange={closePopup}>
        <DialogTrigger asChild onClick={openAddPopup}>
          <Button type="button" variant="outline">
            + Add
          </Button>
        </DialogTrigger>

        <DialogContent className="!max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{isUpdate ? "Update" : "Add"} Position</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              popupForm.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={popupForm.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter position" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={popupForm.control}
              name="sotatekResponsibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sotatek responsibility</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      {...field}
                      defaultValue={field.value}
                      className="w-full justify-between mt-3"
                      onValueChange={(value) => field.onChange(value)}
                    >
                      {Object.entries(Responsibility).map(([key, value]) => (
                        <ToggleGroupItem
                          key={key}
                          variant="outline"
                          value={key}
                          aria-label={`Toggle ${key}`}
                        >
                          {value.replace("_", " ")}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={popupForm.control}
              name="clientResponsibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client responsibility</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      {...field}
                      defaultValue={field.value}
                      className="w-full justify-between mt-3"
                      onValueChange={(value) => field.onChange(value)}
                    >
                      {Object.entries(Responsibility).map(([key, value]) => (
                        <ToggleGroupItem
                          key={key}
                          variant="outline"
                          value={key}
                          aria-label={`Toggle ${key}`}
                        >
                          {value.replace("_", " ")}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={popupForm.control}
              name="manMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Man month</FormLabel>
                  <FormControl>
                    <Input
                      min={0}
                      type="number"
                      placeholder="Please enter man month"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Process array form */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Sprint Process Configuration</FormLabel>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    appendProcess({
                      processType: ProcessType.NONE,
                      start: 0,
                      end: 0,
                    })
                  }
                >
                  + Add Process
                </Button>
              </div>

              {processFields.map((field, idx) => (
                <div
                  key={field.id as string}
                  className="flex gap-2 items-start mb-2"
                >
                  <FormField
                    control={popupForm.control}
                    name={`process.${idx}.processType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Select process type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ProcessType).map((type) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="flex flex-row gap-4 items-center"
                                >
                                  <span>{type}</span>
                                  <span
                                    className="border w-[24px] h-[24px]"
                                    style={{
                                      background: `#${SPRINT_COLOR[type]}`,
                                    }}
                                  />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={popupForm.control}
                    name={`process.${idx}.start`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-[150px]">
                          <FormLabel>Start sprint</FormLabel>
                          <FormControl>
                            <Select
                              value={String(field.value)}
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select process type" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  { length: totalSprint },
                                  (_, idx) => (
                                    <SelectItem
                                      key={idx}
                                      value={String(idx)}
                                      className="flex flex-row gap-4 items-center"
                                    >{`${convertToOrdinal(
                                      idx
                                    )} sprint`}</SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={popupForm.control}
                    name={`process.${idx}.end`}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-[150px]">
                          <FormLabel>End sprint</FormLabel>
                          <FormControl>
                            <Select
                              value={String(field.value)}
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select process type" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  { length: totalSprint },
                                  (_, idx) => (
                                    <SelectItem
                                      key={idx}
                                      value={String(idx)}
                                      className="flex flex-row gap-4 items-center"
                                    >{`${convertToOrdinal(
                                      idx
                                    )} sprint`}</SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <div className="flex flex-col gap-2 mt-0.5">
                    <Label className="opacity-0">button label</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProcess(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {/* Show error message if teamEstimation array is empty and touched */}
              {popupForm.formState.errors.process && (
                <ErrorMessage className="mb-2">
                  {popupForm.formState.errors.process.message?.toString()}
                </ErrorMessage>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">{isUpdate ? "Update" : "+ Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
