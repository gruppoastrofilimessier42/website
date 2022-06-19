// import DescriptionsSet from "./DescriptionsSet";
import { cloneDeep } from "lodash";

export default class SuperModel {
  protected originalObject: any = undefined;

  // eslint-disable-next-line no-useless-constructor
  constructor(o: any) {
    this.originalObject = cloneDeep(o);
  }

  public diff(): any {
    throw new Error("TBI");
  }

  toJSON(): any {
    const o = cloneDeep(this);
    delete o.originalObject;
    // for (const p in o) {
    //   if (o[p] instanceof DescriptionsSet) {
    //     const ds = o[p] as any as DescriptionsSet;
    //     delete o[p];
    //     ds.explode(o);
    //   }
    // }
    return o;
  }
}
