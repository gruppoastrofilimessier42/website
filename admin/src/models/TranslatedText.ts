export default class TranslatedText {
  it!: string | null;
  en!: string | null;

  constructor(o: any = {}) {
    this.it = o.it ?? null;
    this.en = o.en ?? null;
  }
}
