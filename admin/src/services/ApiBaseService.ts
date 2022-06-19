import { Auth } from "@nuxtjs/auth-next";
import axios, { AxiosResponse } from "axios";
import urlJoin from "url-join";
import VueI18n from "vue-i18n";
import BaseModel from "~/models/BaseModel";
import SuperModel from "~/models/SuperModel";

export interface QueryInterface {
  filters?: any;
  page?: number;
  itemsPerPage?: number;
  sort?: string;
  queryOptions?: any;
}

export interface ApiPaginatedData {
  results: any[];
  size: number;
  number: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginatedResult {
  items: BaseModel[];
  meta: {
    page: {
      size: number;
      number: number;
      totalPages: number;
      totalResults: number;
    };
  };
}

export default abstract class ApiBaseService {
  public static apiBaseURL: string = "";
  public static $auth: Auth;
  public static i18n: VueI18n;
  private static refreshTokenPromise?: Promise<boolean> = undefined;

  public static getToken(): string | null {
    return (this.$auth.strategy as any).token.get();
  }

  public static getRefreshToken(): string | null {
    return (this.$auth.strategy as any).refreshToken.get();
  }

  private entity: string;

  public constructor(entity: string) {
    this.entity = entity;
  }

  protected urlJoin(...params: string[]) {
    return urlJoin(...params);
  }

  protected getApiUrl(): string {
    return ApiBaseService.apiBaseURL;
  }

  private buildPath(path: string): string {
    return urlJoin(this.getApiUrl(), this.entity, path);
  }

  protected prepareRequestConfig(
    method: string,
    path: string,
    parameters: any = undefined,
    data: any = undefined,
    config: any = {}
  ) {
    return {
      ...config,
      method,
      url: this.buildPath(path),
      cancelToken: config.cancelToken ?? null,
      headers: {
        Authorization: ApiBaseService.getToken(),
        "Accept-Language": (ApiBaseService.i18n as any).localeProperties.iso,
        ...(config.headers ?? {}),
      },
      params: parameters,
      data,
    };
  }

  protected static async refreshToken() {
    if (this.refreshTokenPromise) return this.refreshTokenPromise;
    return await (this.refreshTokenPromise = new Promise<boolean>((resolve) => {
      this.$auth
        .refreshTokens()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        })
        .finally(() => {
          this.refreshTokenPromise = undefined;
        });
    }));
  }

  protected async exec(
    method: string,
    path: string,
    parameters: any = undefined,
    data: any = undefined,
    config: any = {}
  ): Promise<AxiosResponse<any>> {
    const cfg = this.prepareRequestConfig(method, path, parameters, data, config);

    try {
      return await axios.request(cfg);
    } catch (error: any) {
      const options: any = ApiBaseService.$auth.strategy.options;
      // try refresh only if
      // NOT authenticated
      // AND tried authentication
      // AND exists refresh token
      // AND NOT trying to login
      // AND NOT trying to refresh tokens
      if (
        error.response.status === 401 &&
        error.config.headers.Authorization &&
        ApiBaseService.getRefreshToken() &&
        !error.config.url.endsWith(options.endpoints.refresh.url)
      ) {
        if (error.config.headers.Authorization !== ApiBaseService.getToken() || (await ApiBaseService.refreshToken())) {
          return this.exec(method, path, parameters, data, config);
        }
      }
      throw error;
    }
  }

  protected async execGet(path: string, parameters: any = {}, config: any = {}): Promise<AxiosResponse<any>> {
    return await this.exec("get", path, parameters, undefined, config);
  }

  protected async execHead(path: string, parameters: any = {}, config: any = {}): Promise<AxiosResponse<any>> {
    return await this.exec("head", path, parameters, undefined, config);
  }

  protected async execOptions(path: string, parameters: any = {}, config: any = {}): Promise<AxiosResponse<any>> {
    return await this.exec("options", path, parameters, undefined, config);
  }

  protected async execPost(
    path: string,
    data: any = {},
    parameters: any = {},
    config: any = {}
  ): Promise<AxiosResponse<any>> {
    config = Object.assign({}, config, {
      params: parameters,
    });
    return await this.exec("post", path, parameters, data, config);
  }

  protected async execPut(
    path: string,
    data: any = {},
    parameters: any = {},
    config: any = {}
  ): Promise<AxiosResponse<any>> {
    return await this.exec("put", path, parameters, data, config);
  }

  protected async execPatch(
    path: string,
    data: any = {},
    parameters: any = {},
    config: any = {}
  ): Promise<AxiosResponse<any>> {
    return await this.exec("patch", path, parameters, data, config);
  }

  protected async execDelete(path: string, parameters: any = {}, config: any = {}): Promise<AxiosResponse<any>> {
    return await this.exec("delete", path, parameters, undefined, config);
  }

  protected createTypedArray<T extends SuperModel>(res: any, Type: typeof SuperModel): T[] {
    if (Array.isArray(res)) {
      const arr = res as Array<any>;
      return arr
        .map((e) => {
          try {
            return new Type(e) as T;
          } catch (ex) {
            console.log(ex);
            console.log(e);
            console.log(Type);
            return null;
          }
        })
        .filter((i) => !!i) as T[];
    } else {
      throw new TypeError("Array expected");
    }
  }

  protected createTypedObject<T extends SuperModel>(res: any, Type: typeof SuperModel): T {
    if (!Array.isArray(res) && typeof res === "object" && res !== null) {
      return new Type(res) as T;
    } else {
      throw new TypeError("Object expected");
    }
  }

  protected abstract typeObject(obj: any): BaseModel;
  protected abstract typeArray(list: any[]): BaseModel[];

  public async query({ filters, itemsPerPage, page, sort, queryOptions }: QueryInterface): Promise<PaginatedResult> {
    const data = (
      await this.execGet(
        "/",
        {
          page: {
            number: page,
            size: itemsPerPage,
          },
          sort,
          filter: filters,
        },
        queryOptions
      )
    ).data as ApiPaginatedData;

    return {
      items: this.typeArray(data.results),
      meta: {
        page: {
          size: data.size,
          number: data.number,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
        },
      },
    };
  }

  public async create(content: any, config?: any): Promise<any> {
    return (await this.execPost("/", content, {}, config)).data;
  }

  public async edit(content: any, id: string | number, config?: any): Promise<any> {
    const data = content;
    if (content.originalObject) {
      // data = diff
      delete data.originalObject;
    }
    return (await this.execPatch(`/${id}`, data, {}, config)).data;
  }

  public save(content: any, id?: string | number, config?: any): Promise<any> {
    return id ? this.edit(content, id, config) : this.create(content, config);
  }
}
