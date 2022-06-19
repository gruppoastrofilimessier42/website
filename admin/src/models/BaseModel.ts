import moment from "moment";
import SuperModel from "./SuperModel";

export default class BaseModel extends SuperModel {
  public id: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(o: any) {
    super(o);
    this.id = o.id;
    this.createdAt = o.createdAt ? moment(o.createdAt).toDate() : null;
    this.updatedAt = o.updatedAt ? moment(o.updatedAt).toDate() : null;
  }
}
