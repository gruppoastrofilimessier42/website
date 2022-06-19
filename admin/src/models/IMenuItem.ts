export default interface IMenuItem {
  title: string;
  icon?: string;
  to?: string;
  children?: IMenuItem[];
  grants?: string[];
}
