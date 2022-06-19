import { Context } from "@nuxt/types";

export default function (context: Context) {
  const { app } = context;

  function hasGrants(grants: string | string[] | undefined): boolean {
    if (typeof grants === "string") {
      grants = [grants];
    }
    const userGrants = (app.$auth.user?.grants ?? []) as string[];
    return !grants || grants.length === 0 || grants.every((g: string) => userGrants.includes(g));
  }

  return {
    hasGrants,
  };
}
