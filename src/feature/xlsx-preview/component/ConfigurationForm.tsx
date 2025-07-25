"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  configurationSchema,
  type XlxsDownload,
  type ConfigurationSchema,
} from "@/feature/xlsx-preview/schema/configXlxsDownloadSchema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useXlsxSettingsState } from "../context/XlsxSettingsContext";

export default function ConfigurationForm({
  onNext,
}: {
  onNext: (data: Partial<XlxsDownload>) => void;
}) {
  const { xlsxSettings } = useXlsxSettingsState();
  const form = useForm<ConfigurationSchema>({
    resolver: zodResolver(configurationSchema),
    defaultValues: xlsxSettings.configuration
      ? { ...xlsxSettings.configuration }
      : {
          totalMonth: 4,
          sprintEachMonth: 2,
        },
  });

  function onSubmit(data: ConfigurationSchema) {
    onNext({
      configuration: data,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full lg:w-1/2 mx-auto min-h-[500px]">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="totalMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total month</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Please enter total month"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sprintEachMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total sprint each month</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Total sprint each month"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <div className="flex-grow" />

          <CardFooter>
            <Button variant="ghost" type="submit">
              Next
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
