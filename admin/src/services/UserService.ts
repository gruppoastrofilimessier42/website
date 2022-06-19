import ApiBaseService from "./ApiBaseService";
import User from "~/models/entities/User";

const UserService = new (class extends ApiBaseService {
  constructor() {
    super("users");
  }

  async get(id: number): Promise<User> {
    return this.createTypedObject<User>((await this.execGet(`/${id}`)).data, User);
  }

  async getAll(): Promise<User[]> {
    return this.typeArray((await this.execGet("/")).data);
  }

  protected typeObject(obj: any): User {
    return this.createTypedObject<User>(obj, User);
  }

  protected typeArray(list: any[]): User[] {
    return this.createTypedArray<User>(list, User);
  }
})();

export default UserService;
