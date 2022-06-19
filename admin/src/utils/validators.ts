import { helpers } from "vuelidate/lib/validators";

const htmlMaxLength = (length: number) =>
  helpers.withParams({ type: "maxLength", max: length }, (value: string) => {
    const div = document.createElement("div");
    div.innerHTML = value;
    return div.innerText.trim().length <= length;
  });

export { htmlMaxLength };
