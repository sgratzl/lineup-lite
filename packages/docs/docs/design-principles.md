---
title: Design Principles
---

LineUp-lite is build based on the following design principles:

- **Customizability** -
  LineUp-lite provides multiple levels in which the library can be used.
  From the ready-to-use `LineUpLite` React component down to individual visualization components such as `BoxPlot` or `Histogram`.

- **Only import what you need** -
  The library and its components are ESM tree-shakeable whenever possible.
  If you don't have a numeric column in your table, there is no need to have the code for one in your bundle.

- **Layered architecture** -
  To further emphasize the previous points, the library is split up in three packages, each implementing a different abstraction level:
  - [`@lineup-lite/components`](https://npmjs.com/package/@lineup-lite/components)
    contains basic React components and statistical logic methods which can be used independently of the LineUp ranking scenario.
  - [`@lineup-lite/hooks`](https://npmjs.com/package/@lineup-lite/hooks)
    provides a series of extensions to the [react-table](https://react-table.tanstack.com/) for creating a LineUp based table, such as a react-table plugin for computing column statistics, Cell renderer using the `@lineup-lite/components`, ...
  - [`@lineup-lite/table`](https://npmjs.com/package/@lineup-lite/table)
    provides the highest abstraction level and provides React components such as `LineUpLite` for generating LineUp ranking tables with minimal effort.
- **Good defaults** -
  LineUp-lite fosters good visualization practices, such as proper use of color, through good defaults that work in most cases without any customizations.

---

About the author: [Samuel Gratzl](https://www.sgratzl.com) is main developer behind [LineUp-lite](https://lineup-lite.js.org). He also developed several other libraries [LineUp.js](https://lineup.js.org), [UpSet.js](https://upset.js.org), and numerous [chart.js plugins](https://github.com/sgratzl?tab=repositories&q=chartjs-&type=&language=). In addition, he is the active maintainer of [slack-cleaner](https://github.com/sgratzl/slack-cleaner). Find more about him at his [website](https://wwww.sgratzl.com) or visit his [GitHub profile](https://github.com/sgratzl).
