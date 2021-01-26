---
title: Overview
---

LineUp-lite is an extension of the excellent [react-table](https://react-table.tanstack.com/) library for rendering beautiful interactive table visualizations based on the [LineUp](https://jku-vds-lab.at/tools/lineup/) ranking visualization technique.

## Relation to react-table

LineUp-lite is an extension to but also wrapper of react-table depending on the used abstraction level. [`@lineup-lite/hooks`](/docs/hooks) provide extensions to react-table such as additional React hooks and custom renderers. [`@lineup-lite/table`](/docs/table) provides a wrapper around react-table providing a single LineUp-like React table component.

## Relation to LineUp.js

LineUp-lite is the small, lite, but customizable nephew of [LineUp.js](https://lineup.js.org). LineUp.js is a comprehensive JavaScript library, providing numerous advanced ranking features and scalability. However, in most cases, only a fraction of the provided features are needed and used. In addition, new custom features are often required.

This is where LineUp-lite jumps in. LineUp-lite is a [React](https://reactjs.org) library written in [TypeScript](https://www.typescriptlang.org/) providing a several abstraction levels ranging ranging from `LineUpLite` - a ready to use ranking table visualization - over custom react-table hooks and renderers, down to individual components such as `Histogram` or `BoxPlot`.
