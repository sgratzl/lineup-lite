---
title: FAQ
slug: /faq
---

see also [FAQ of react-table](https://react-table.tanstack.com/docs/faq)

---

## How do I listen to state changes within LineUp-lite ?

The `LineUpLite` component supports the `onStateChange: (state: any) => void` property which will be triggered when the internal react-table state changes. The given argument needs to be _memorized_ (using `React.useCallback`) to work properly.

see also [Controlled State Example](/docs/examples/controlled-state).

---
