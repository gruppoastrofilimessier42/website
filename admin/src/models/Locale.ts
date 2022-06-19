export default class Locale {
  code!: string;
  iso!: string;
  name!: string;
  shortName!: string;

  constructor(o: any) {
    this.code = o.code;
    this.iso = o.iso;
    this.name = o.name;
    this.shortName = o.shortName;
  }
}
