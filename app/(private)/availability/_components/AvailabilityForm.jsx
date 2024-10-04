"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema } from "@/app/lib/validators";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeSlots } from "../data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAvailability } from "@/actions/availability";
import useFetch from "@/hooks/use-fetch";

const AvailabilityForm = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    loading,
    error,
    fn: fnUpdateAvailability,
  } = useFetch(updateAvailability);

  const onSubmit = async (data) => {
    await fnUpdateAvailability(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {[
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ].map((day) => {
        const isAvailable = watch(`${day}.isAvailable`);

        return (
          <div key={day} className="flex items-center space-x-4 mb-4">
            <Controller
              name={`${day}.isAvailable`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    setValue(`${day}.isAvailable`, checked);
                    if (!checked) {
                      setValue(`${day}.startTime`, "09:00");
                      setValue(`${day}.endTime`, "17:00");
                    }
                  }}
                />
              )}
            />
            <span className="w-24">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </span>
            {isAvailable && (
              <>
                <Controller
                  name={`${day}.startTime`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Start Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {Number(time.split(":")[0]) > 12
                              ? Number(time.split(":")[0]) -
                                12 +
                                ":" +
                                time.split(":")[1] +
                                " PM"
                              : Number(time.split(":")[0]) === 12
                              ? time + " PM"
                              : Number(time.split(":")[0]) === 0
                              ? "12:" + time.split(":")[1] + " AM"
                              : Number(time.split(":")[0]) +
                                ":" +
                                time.split(":")[1] +
                                " AM"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <span>to</span>
                <Controller
                  name={`${day}.endTime`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="End Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {Number(time.split(":")[0]) > 12
                              ? Number(time.split(":")[0]) -
                                12 +
                                ":" +
                                time.split(":")[1] +
                                " PM"
                              : Number(time.split(":")[0]) === 12
                              ? time + " PM"
                              : Number(time.split(":")[0]) === 0
                              ? "12:" + time.split(":")[1] + " AM"
                              : Number(time.split(":")[0]) +
                                ":" +
                                time.split(":")[1] +
                                " AM"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors[day]?.endTime && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors[day].endTime.message}
                  </span>
                )}
              </>
            )}
          </div>
        );
      })}

      <div className="flex items-center space-x-4">
        <span>Minimum gap before booking (minutes)</span>
        <Input
          type="number"
          {...register("timeGap", {
            valueAsNumber: true,
          })}
          className="w-32"
        />

        {errors.timeGap && (
          <span className="text-red-500 text-sm mt-1">
            {errors.timeGap.message}
          </span>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-sm mt-1">{error?.message}</span>
      )}
      <Button type="submit" className="mt-5" disabled={loading}>
        {loading ? "Updating..." : "Update Availability"}
      </Button>
    </form>
  );
};

export default AvailabilityForm;
