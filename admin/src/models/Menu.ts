import MenuItem from "./MenuItem";
import IMenuItem from "./IMenuItem";

export default class Menu {
  private _items: MenuItem[];

  constructor(items: IMenuItem[]) {
    this._items = items.map((item) => new MenuItem(item));
  }

  get items(): MenuItem[] {
    return this._items;
  }
}
