import { CostSavingsReport } from "./cost-savings-report";
import { TimeSavingsReport } from "./time-savings-report";

export interface UserSavingsReport {
  totalFuelSavings: number;
  totalTimeSavings: number;
  totalChildCareSavings: number;
  totalFoodBeverageSavings: number;
  totalMiscSavings: number;
  totalMoneySavings: number;
}