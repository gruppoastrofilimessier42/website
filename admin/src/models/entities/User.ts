import BaseModel from "../BaseModel";

export default class User extends BaseModel {
  email!: string | null;
  firstName!: string | null;
  lastName!: string | null;
  grants!: string[];
  roles!: string[];
  preferredLanguage!: string | null;

  constructor(o: any = {}) {
    super(o);
    this.email = o.email;
    this.firstName = o.firstName;
    this.lastName = o.lastName;
    this.grants = o.grants ?? [];
    this.roles = o.roles ?? [];
    this.preferredLanguage = o.preferredLanguage;
  }
}
