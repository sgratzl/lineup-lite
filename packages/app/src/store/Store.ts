/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { action, autorun, computed, makeObservable, observable, runInAction } from 'mobx';
import { IDataSet, IRows, listStatic, listLocal, deleteLocal, saveLocal, IColumns, IColumn } from '../data';
import UIStore, { IToastLink } from './UIStore';
import { exportJSON, importJSON } from '../data/exportJSON';
import { exportCSV, importCSV } from '../data/exportCSV';

export default class Store {
  @observable
  readonly ui = new UIStore();

  @observable.shallow
  datasets: IDataSet[] = [];

  @observable.ref
  dataset: IDataSet | null = null;

  @observable.shallow
  rows: IRows = [];

  @observable.shallow
  columns: IColumns = [];

  @observable.ref
  defaultColumn: Partial<IColumn> = {};

  @observable.ref
  hover: IRows | null = null;
  @observable.ref
  selection: IRows | null = null;

  constructor() {
    makeObservable(this);
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
  private pushDataSet(dataset: IDataSet) {
    this.datasets.push(dataset);
    this.sortDatasets();
    this.dataset = dataset;
    this.loadDataSet(dataset, () => {
      saveLocal(this).then((stored) => {
        this.dataset = stored;
        this.datasets.splice(this.datasets.indexOf(dataset), 1, stored);
      });
    });
    this.ui.showToast({
      severity: 'success',
      message: 'Data set loaded',
    });
  }

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
    this.rows = [];
    this.columns = [];
    this.defaultColumn = {};
    this.hover = null;
    this.selection = null;

    if (!this.dataset) {
      return;
    }
    this.dataset.load().then((d) =>
      runInAction(() => {
        this.rows = d.rows;
        this.columns = d.columns;
        this.defaultColumn = d.defaultColumn;
        if (done) {
          done();
        }
      })
    );
  }

  @action.bound
  setHover(set: IRows | null) {
    this.hover = set;
  }

  @action.bound
  setSelection(set: IRows | null) {
    this.selection = set;
  }

  @computed
  get title() {
    return `LineUp-lite - ${this.dataset?.name ?? 'Unknown'}`;
  }

  private downloadFile(text: string, mimeType: string, extension: string, link?: IToastLink) {
    const b = new Blob([text], {
      type: mimeType,
    });
    const url = URL.createObjectURL(b);

    const a = document.createElement('a');
    a.download = `${this.title}.${extension}`;
    a.href = url;
    a.style.position = 'absolute';
    a.style.left = '-10000px';
    a.style.top = '-10000px';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
    this.ui.showToast({
      severity: 'success',
      message: `${this.title}.${extension} generated`,
      link,
    });
  }

  @action.bound
  exportCSV() {
    this.downloadFile(exportCSV(this), 'text/csv', 'csv');
  }

  @action.bound
  exportJSON() {
    this.downloadFile(exportJSON(this), 'application/json', 'json');
  }

  @action.bound
  importFile(file: File | string) {
    const name = typeof file == 'string' ? file : file.name;
    this.ui.showToast({
      severity: 'info',
      message: `Importing Dataset: ${name}...`,
    });
    const loader = name.endsWith('.json') ? importJSON : name.endsWith('.csv') ? importCSV : null;

    if (!loader) {
      this.ui.showToast({
        severity: 'error',
        message: 'Unknown Dataset type: only .csv and .json are supported',
      });
      return;
    }
    loader(file)
      .then((ds) => {
        this.ui.closeToast();
        this.pushDataSet(ds);
      })
      .catch((error) => {
        console.error(error);
        this.ui.showToast({
          severity: 'error',
          message: 'Error occurred during dataset import!',
        });
      });
  }
}
