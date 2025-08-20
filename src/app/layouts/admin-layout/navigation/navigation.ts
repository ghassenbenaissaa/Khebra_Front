import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: 'dashboard',
    icon: 'feather icon-home',
    classes: 'nav-item',
  },
  {
    id: 'users',
    title: 'Users',
    type: 'item',
    url: 'users',
    icon: 'feather icon-user',
    classes: 'nav-item',
  },
  {
    id: 'experts',
    title: 'Experts',
    type: 'item',
    url: 'experts',
    icon: 'feather icon-user-check',
    classes: 'nav-item',
  },
  {
    id: 'domaines',
    title: 'Domaines',
    type: 'item',
    url: 'domaines',
    icon: 'feather icon-globe',
    classes: 'nav-item',
  },
  {
    id: 'avis',
    title: 'Avis',
    type: 'item',
    url: 'avis',
    icon: 'feather icon-star',
    classes: 'nav-item',
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
