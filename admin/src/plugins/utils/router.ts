import { Context } from "@nuxt/types";
import _ from "lodash";
import { deserializeQueryComponent, serializeQueryComponent } from "./commons";

export default function (context: Context) {
  const { app } = context;

  function withBackTo(routePath: string, options?: object) {
    const pushOptions = options
      ? { query: { b: serializeQueryComponent(options) } }
      : { query: { b: serializeQueryComponent(_.pick(context.route, ["path", "query", "params"])) } };
    return {
      path: routePath,
      ...pushOptions,
    };
  }

  function backOptions(defaultUrl: string) {
    const backField = "b";
    const { route } = app.context;
    const urlBackOptions = route.query[backField];
    if (urlBackOptions) {
      return deserializeQueryComponent(urlBackOptions);
    } else if (defaultUrl) {
      return {
        path: defaultUrl,
      };
    }
  }

  function smartBack(defaultUrl = "/") {
    const back = backOptions(defaultUrl);
    if (back) {
      app.router?.push(back);
    } else {
      throw new Error("Unable to determine the back url");
    }
  }

  return {
    smartBack,
    backOptions,
    withBackTo,
  };
}
