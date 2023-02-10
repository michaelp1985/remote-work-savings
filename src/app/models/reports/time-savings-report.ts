import { TimeSavingsType } from "../enumerations/time-savings-type";

export interface TimeSavingsReport {
  name: TimeSavingsType;
  value: number;
}