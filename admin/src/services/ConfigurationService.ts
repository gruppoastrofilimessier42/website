import ApiBaseService from "./ApiBaseService";

const ConfigurationService = new (class extends ApiBaseService {
  constructor() {
    super("configurations");
  }

  async getUser(): Promise<any> {
    return (await this.execGet(`/user`)).data;
  }

  protected typeObject(obj: any): any {
    return obj;
  }

  protected typeArray(list: any[]): any[] {
    return list;
  }
})();

export default ConfigurationService;
