export default class GamFile {
  originalFilename!: string;
  mime!: string;
  size!: number;
  url!: string;

  constructor(o: any = {}) {
    this.originalFilename = o.originalFilename;
    this.mime = o.mime;
    this.size = o.size;
    this.url = o.url;
  }
}
