import { UserResource } from "@/utils/firebase/resources/user";


export class User {
  constructor(public readonly userResource: UserResource){}

  public get fullName() {
    return `${this.userResource.name} ${this.userResource.surname}`
  }
  
}