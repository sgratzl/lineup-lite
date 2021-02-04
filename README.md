# LineUp-lite

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url] [![License: MPL 2.0][license-image]][license-url]

LineUp-lite is an extension of the excellent [react-table](https://react-table.tanstack.com/) library for rendering beautiful interactive table visualizations based on the [LineUp](https://jku-vds-lab.at/tools/lineup/) ranking visualization technique.

see more at [https://lineup-lite.netlify.app](https://lineup-lite.netlify.app).

## Mono Repo structure

This monorepo contains following packages:

- [@lineup-lite/table](https://github.com/sgratzl/lineup-lite/tree/main/packages/table) higher level table component based on react-table and hooks
  [![Quick Start][quick-start]](https://lineup-lite.netlify.app/docs/getting-started) [![API Docs][docs]](https://lineup-lite.netlify.app/api/table)

- [@lineup-lite/hooks](https://github.com/sgratzl/lineup-lite/tree/main/packages/hooks) hooks and renderers for react-table
  [![Quick Start][quick-start]](https://lineup-lite.netlify.app/docs/getting-started/hooks) [![API Docs][docs]](https://lineup-lite.netlify.app/api/hooks)

- [@lineup-lite/components](https://github.com/sgratzl/lineup-lite/tree/main/packages/components) basic React components and statistic utils
  [![Quick Start][quick-start]](https://lineup-lite.netlify.app/docs/getting-started/components) [![API Docs][docs]](https://lineup-lite.netlify.app/api/components)

- [@lineup-lite/docs](https://github.com/sgratzl/lineup-lite/tree/main/packages/docs) Docusaurus based documentation

- [@lineup-lite/\_playground](https://github.com/sgratzl/lineup-lite/tree/main/packages/_playground) Playground setup for testing lineup-lite

In addition there are numerous [example projects](https://github.com/sgratzl/lineup-lite/tree/main/examples/).

## Installation and Usage

see also [Getting Started](https://lineup-lite.netlify.app/docs/getting-started) in the docs.

```sh
npm install @lineup-lite/table
```

or

```sh
yarn add @lineup-lite/table
```

**Is important to understand the principles of the underlying [react-table](https://react-table.tanstack.com/) library, such as following its own [Quick Start](https://react-table.tanstack.com/docs/quick-start).**

```jsx
import React from 'react';
import LineUpLite, {
  asTextColumn,
  asNumberColumn,
  asCategoricalColumn,
  asDateColumn,
  LineUpLiteColumn,
  featureDefault,
} from '@lineup-lite/table';
import '@lineup-lite/table/dist/table.css';

function GettingStarted() {
  const data = React.useMemo(
    () => [
      {
        name: 'Panchito Green',
        age: 10,
        shirtSize: 'S',
        birthday: new Date(2011, 1, 1),
      },
      {
        name: 'Rubia Robker',
        age: 25,
        shirtSize: 'M',
        birthday: new Date(1996, 4, 13),
      },
      {
        name: 'Micheil Sappell',
        age: 50,
        shirtSize: 'L',
        birthday: new Date(1971, 8, 23),
      },
      {
        name: 'Geoffrey Sprason',
        age: 30,
        shirtSize: 'M',
        birthday: new Date(1991, 11, 5),
      },
      {
        name: 'Grissel Rounsefull',
        age: 21,
        shirtSize: 'S',
        birthday: new Date(2000, 6, 30),
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [asTextColumn('name'), asNumberColumn('age'), asCategoricalColumn('shirtSize'), asDateColumn('birthday')],
    []
  );

  const features = React.useMemo(() => featureDefault(), []);

  return <LineUpLite data={data} columns={columns} features={features} />;
}
```

![Getting Started Result](https://user-images.githubusercontent.com/4129778/105834355-a74ff600-5fca-11eb-8e3b-5374c2511682.png)

## Dev Environment

```sh
npm i -g yarn
yarn set version berry
yarn plugin import version
yarn plugin import workspace-tools
cat .yarnrc_patch.yml >> .yarnrc.yml
yarn install
yarn pnpify --sdk vscode
```

### Commands

```sh
yarn clear
yarn build
yarn test
yarn lint
yarn fix
yarn watch ... compiles and watches table/components/hooks
yarn start ... starts playground
```

### Release

```sh
yarn workspaces foreach --verbose version X.X.X --deferred
yarn version apply --all
git commit -am 'release vX.X.X'
git push
git tag vX.X.X
git push --tags
yarn clear
yarn build
yarn workspaces foreach --verbose npm publish --access public
```

### Release Policy

to simplify this monorepo together with its siblings the following strategy for versioning is used:
Major and Minor versions should be in sync. Patch version are independent except the 10 potent.
Thus, a next unified patch release should be increased to the next 10 potent.

e.g.,

```

```

## Privacy Policy

LineUp-lite is a client only library. The library or any of its integrations doesn't track you or transfers your data to any server.

## License / Terms of Service

This library is released under the `MPL-2.0` license.

[license-image]: https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg
[license-url]: https://opensource.org/licenses/MPL-2.0
[npm-image]: https://badge.fury.io/js/%40lineup-lite%2Ftable.svg
[npm-url]: https://npmjs.org/package/@lineup-lite/table
[github-actions-image]: https://github.com/sgratzl/lineup-lite/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/lineup-lite/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
[codesandbox]: https://img.shields.io/badge/CodeSandbox-open-blue?logo=codesandbox
[nbviewer]: https://img.shields.io/badge/NBViewer-open-blue?logo=jupyter
[binder]: https://mybinder.org/badge_logo.svg
[docs]: https://img.shields.io/badge/API-open-blue
[quick-start]: https://img.shields.io/badge/Quick%20Start-open-red
