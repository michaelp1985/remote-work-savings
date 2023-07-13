import { CostSavingsType } from "../enumerations/cost-savings-type";

export interface CostSavingsReport{
  name: CostSavingsType;
  value: number;
}