import IMenuItem from "./IMenuItem";

export default class MenuItem implements IMenuItem {
  public title: string;
  public icon?: string;
  public to?: string;
  public children?: MenuItem[];
  public grants?: string[];

  constructor(item: IMenuItem) {
    this.title = item.title;
    if (item.icon) {
      this.icon = item.icon;
    }
    if (item.to) {
      this.to = item.to;
    }
    if (item.children) {
      this.children = item.children?.map((child) => new MenuItem(child));
    }
    if (item.grants) {
      this.grants = item.grants;
    }
  }
}
