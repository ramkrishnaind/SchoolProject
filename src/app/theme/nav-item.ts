export interface NavItem {
  displayName: string;
  disabled?: boolean;
  // iconName: string;
  iconClass: string;
  route?: string;
  children?: NavItem[];
}
