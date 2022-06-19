import { Plugin } from "@nuxt/types";
import date from "./date";
import text from "./text";
import file from "./file";
import roles from "./roles";
import router from "./router";
import user from "./user";

declare module "vue/types/vue" {
  interface Vue {
    $utils: {
      date: {
        formatDate(date: string, format?: string): string | null;
        parseDate(date: string, format?: string, outputFormat?: string): string | null;
      };
      text: {
        capitalize(text: string | null): string | null;
      };
      file: {
        getFilenameFromResponse(blobResponse: any, defaultFilename: string): string;
        downloadItem(response: any, fileName?: string): void;
      };
      roles: {
        rplToRoles(rpl: number, roles: Object[]): string[] | null;
        rolesToRpl(roles: any[]): number;
      };
      router: {
        withBackTo(routePath: string, options?: object): string;
        backOptions(defaultUrl: string): Object;
        smartBack(defaultUrl?: string): void;
      };
      user: {
        hasGrants(grants: string | string[] | undefined): boolean;
      };
    };
  }
}

const plugin: Plugin = (context, inject) => {
  inject("utils", {
    date: date(context),
    text: text(),
    file: file(),
    roles: roles(),
    router: router(context),
    user: user(context),
  });
};

export default plugin;
