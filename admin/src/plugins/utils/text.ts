import _ from "lodash";

export default function () {
  function capitalize(text: string): string | null {
    return text ? _.capitalize(text) : null;
  }
  return {
    capitalize,
  };
}
