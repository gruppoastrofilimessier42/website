export default interface MenuAction {
  label: string;
  icon?: string;
  iconColor?: string;
  visibility?: () => boolean;
  action?: (vm: any) => void;
  subitems?: MenuAction[];
}
