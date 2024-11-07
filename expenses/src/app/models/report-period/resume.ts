import {CategoryData} from "./category-data";
import {Period} from "./period";

export interface Resume {
  period: Period;
  ordinary: CategoryData[];
  extraordinary: CategoryData[];
}
