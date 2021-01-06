/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { action, observable, autorun, computed, makeObservable } from 'mobx';
import { createRef } from 'react';

export interface IToastLink {
  href: string;
  alt: string | React.ReactNode;
}

export interface IToast {
  severity: 'error' | 'info' | 'warning' | 'success';
  message: string | React.ReactNode;
  link?: IToastLink;
}

export default class UIStore {
  @observable
  readonly sidePanelExpanded = new Set<string>((localStorage.getItem('sidePanel') || 'datasetinfo').split(','));

  @observable
  menu = false;

  @observable
  zen = localStorage.getItem('zen') === 'T';

  @observable
  defaultTheme: 'dark' | 'light' | null = null;

  @observable
  speedDial = false;

  @observable
  readonly ref = createRef<SVGSVGElement>();

  @observable
  toast: IToast | null = null;

  constructor() {
    makeObservable(this);
    autorun(() => {
      localStorage.setItem('zen', this.zen ? 'T' : 'F');
    });
    autorun(() => {
      localStorage.setItem('sidePanel', Array.from(this.sidePanelExpanded).join(','));
    });
  }

  @action
  setDefaultTheme(theme: 'dark' | 'light' | null) {
    this.defaultTheme = theme;
  }

  @computed
  get theme() {
    return this.defaultTheme ?? 'light';
  }

  @action
  setSpeedDial(value: boolean) {
    this.speedDial = value;
  }

  @action
  toggleSidePanelExpansion(id: string) {
    if (this.sidePanelExpanded.has(id)) {
      this.sidePanelExpanded.delete(id);
    } else {
      this.sidePanelExpanded.add(id);
    }
  }

  @action.bound
  closeToast() {
    this.toast = null;
  }

  @action
  showToast(toast: IToast) {
    this.toast = toast;
  }

  @action.bound
  toggleMenu() {
    this.menu = !this.menu;
  }

  @action.bound
  toggleTheme() {
    this.defaultTheme = this.defaultTheme === 'dark' ? 'light' : 'dark';
  }

  @action.bound
  toggleZen() {
    this.zen = !this.zen;
  }
}
