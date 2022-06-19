import ApiBaseService from "~/services/ApiBaseService";

export default function (ctx: any) {
  ApiBaseService.i18n = ctx.i18n;
  ApiBaseService.$auth = ctx.$auth;
  ApiBaseService.apiBaseURL = ctx.env.apiBaseURL;
}
