# LineUp-lite

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url] [![License: MPL 2.0][license-image]][license-url]

This monorepo contains following packages:

- [@lineup-lite/components](https://github.com/sgratzl/lineup-lite/tree/main/packages/components) basic React components and statistic utils
  [![Open Docs][docs]](https://lineup-lite.js.org/api/components)

- [@lineup-lite/hooks](https://github.com/sgratzl/lineup-lite/tree/main/packages/hooks) hooks and renderers for react-table
  [![Open Docs][docs]](https://lineup-lite.js.org/api/hooks)

- [@lineup-lite/table](https://github.com/sgratzl/lineup-lite/tree/main/packages/react) higher level table component based on react-table and hooks
  [![Open Docs][docs]](https://lineup-lite.js.org/api/react)

- [@lineup-lite/bundle](https://github.com/sgratzl/lineup-lite/tree/main/packages/bundle) zero dependency bundle of the table component using Preact
  [![Open Docs][docs]](https://lineup-lite.js.org/api/bundle)

- [@lineup-lite/app](https://github.com/sgratzl/lineup-lite/tree/main/packages/app) example application to explore datasets using LineUp-lite with import and export features
  [![Open Example][example]](https://lineup-lite.js.org/app)

## Usage and Installation

### Table

```sh
npm install @lineup-lite/table react react-dom
```

```ts
import React from 'react';

TODO;
```

### Bundled version

```sh
npm install @lineup-lite/bundle
```

```js
TODO;
```

## LineUp-lite App

The LineUp-lite App is an web application TODO. The app is deployed at [https://lineup-lite.js.org/app](https://lineup-lite.js.org/app).

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

### Storybook

Run inside another terminal:

```sh
yarn workspace @lineup-lite/table storybook
```

### Testing

```sh
yarn test
```

### Linting

```sh
yarn lint
```

### Building

```sh
yarn install
yarn build
```

### Release

```sh
yarn workspaces foreach --verbose version X.X.X --deferred
yarn version apply --all
git commit -am 'release vX.X.X'
git push
git tag vX.X.X
git push --tags
yarn clean
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
The uploaded data in the app are stored in your browser only using IndexedDB.
However, as soon as you export your session within the app to an external service (e.g., Codepen.io) your data will be transferred.

## License / Terms of Service

This library is released under the `MPL-2.0` license.

[license-image]: https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg
[license-url]: https://opensource.org/licenses/MPL-2.0
[npm-image]: https://badge.fury.io/js/%40lineup-lite%2Freact.svg
[npm-url]: https://npmjs.org/package/@lineup-lite/react
[github-actions-image]: https://github.com/sgratzl/lineup-lite/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/lineup-lite/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
[codesandbox]: https://img.shields.io/badge/CodeSandbox-open-blue?logo=codesandbox
[nbviewer]: https://img.shields.io/badge/NBViewer-open-blue?logo=jupyter
[binder]: https://mybinder.org/badge_logo.svg
[docs]: https://img.shields.io/badge/API-open-blue
[example]: https://img.shields.io/badge/Example-open-red
