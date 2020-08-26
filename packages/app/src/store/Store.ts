/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { action, autorun, computed, observable, runInAction } from 'mobx';
import { IDataSet, IElems, listStatic, listLocal, deleteLocal } from '../data';
import UIStore from './UIStore';

export default class Store {
  @observable
  readonly ui = new UIStore();

  @observable.shallow
  datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.shallow
  elems: IElems = [];

  @observable.ref
  hover: IElems | null = null;
  @observable.ref
  selection: IElems | null = null;

  constructor() {
    this.appendDatasets(listStatic());
    this.ui.showToast({
      severity: 'info',
      message: 'Preparing Datasets...',
    });
    Promise.all([listLocal().then((ds) => this.appendDatasets(ds))]).then(() => {
      this.ui.closeToast();
      this.syncHistory();
    });

    autorun(() => {
      // sync document title
      document.title = this.title;
    });
  }

  private syncHistory() {
    const onURLChangeImpl = (firstRun = false) => {
      const url = new URL(window.location.href);
      if (url.searchParams.has('ds')) {
        const id = decodeURIComponent(url.searchParams.get('ds')!);
        if (firstRun && id.startsWith('http')) {
          // URL mode
          this.importFile(id);
        } else if (this.dataset?.id !== id) {
          this.selectDataSet(id);
        }
      }
    };
    const onURLChange = onURLChangeImpl.bind(this, false);

    window.addEventListener('popstate', onURLChange);
    onURLChangeImpl(true);

    autorun(() => {
      const params = new URLSearchParams();
      if (this.dataset) {
        params.set('ds', encodeURIComponent(this.dataset.id));
      }
      params.sort();
      const current = new URL(window.location.href);
      if (current.searchParams.toString() !== params.toString()) {
        current.search = `?${params.toString()}`;
        window.removeEventListener('popstate', onURLChange);
        window.history.pushState(null, '', current.toString());
        window.addEventListener('popstate', onURLChange);
      }
    });
  }

  @action
  private appendDatasets(ds: IDataSet[]) {
    if (ds.length <= 0) {
      return;
    }
    this.datasets.push(...ds);
    this.sortDatasets();
    if (this.datasets.length > 0 && !this.dataset) {
      this.loadDataSet(this.datasets[0]);
    }
  }

  private sortDatasets() {
    this.datasets = this.datasets.slice().sort((a, b) => {
      if (a.id === 'got') {
        return -1;
      }
      if (b.id === 'got') {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  @action
  selectDataSet(id: string) {
    const ds = this.datasets.find((d) => d.id === id) ?? null;
    this.loadDataSet(ds);
  }

  // @action.bound
  // private pushDataSet(dataset: IDataSet) {
  //   this.datasets.push(dataset);
  //   this.sortDatasets();
  //   this.dataset = dataset;
  //   this.loadDataSet(dataset, () => {
  //     saveLocal(this).then((stored) => {
  //       this.dataset = stored;
  //       this.datasets.splice(this.datasets.indexOf(dataset), 1, stored);
  //     });
  //   });
  //   this.ui.showToast({
  //     severity: 'success',
  //     message: 'Data set loaded',
  //   });
  // }

  @action
  deleteDataSet(dataset: IDataSet) {
    if (!dataset.uid) {
      return;
    }
    deleteLocal(dataset).then(() =>
      runInAction(() => {
        this.datasets.splice(this.datasets.indexOf(dataset), 1);
        if (this.dataset === dataset) {
          this.loadDataSet(this.datasets[0]!);
        }
        this.ui.showToast({
          severity: 'success',
          message: 'Data set deleted',
        });
      })
    );
  }

  private loadDataSet(dataset: IDataSet | null, done?: () => void) {
    this.dataset = dataset;
    this.elems = [];
    this.hover = null;
    this.selection = null;

    if (!this.dataset) {
      return;
    }
    this.dataset.load().then((d) =>
      runInAction(() => {
        this.elems = d.elems;
        if (done) {
          done();
        }
      })
    );
  }

  @action.bound
  setHover(set: IElems | null) {
    this.hover = set;
  }

  @action.bound
  setSelection(set: IElems | null) {
    this.selection = set;
  }

  @computed
  get title() {
    return `LineUp-lite - ${this.dataset?.name ?? 'Unknown'}`;
  }

  @action.bound
  importFile(file: File | string) {
    const name = typeof file == 'string' ? file : file.name;
    this.ui.showToast({
      severity: 'info',
      message: `Importing Dataset: ${name}...`,
    });
    const loader = null;

    if (!loader) {
      this.ui.showToast({
        severity: 'error',
        message: 'Unknown Dataset type: only .csv and .json are supported',
      });
      return;
    }
    // loader(file)
    //   .then((ds) => {
    //     this.ui.closeToast();
    //     this.pushDataSet(ds);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     this.ui.showToast({
    //       severity: 'error',
    //       message: 'Error occurred during dataset import!',
    //     });
    //   });
  }
}
