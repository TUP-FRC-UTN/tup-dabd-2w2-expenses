import { Expenditure } from "./expenditure";
import { Resume } from "./resume";

export interface ReportPeriod {
  expenditures:Expenditure;
  categories:Expenditure;
  resume: Resume;
  periods: Resume[];
}
