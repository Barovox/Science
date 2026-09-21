export interface NavLink {
  path: string;
  level?: number;
  label: string;
  icon: React.FC<any>;
  onlyRole?: string;
}
