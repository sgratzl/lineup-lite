---
id: _index
title: Overview
slug: /components
---

The `@lineup-lite/components` package is a collection of basic React visualization components and methods for computing statistics.

LineUp-lite supports four different attribute types: [text](components/text), [categorical](components/categorical), [number](components/number), and [date](components/date).

## Example

```jsx live
// import { TextLabel, NumberBar, CategoricalColor, DateLabel } from '@lineup-lite/components';

function Example() {
  const row = {
    name: 'Panchito Green',
    age: 10,
    shirtSize: 'S',
    birthday: new Date(2011, 1, 1),
  };

  return <div style={{maxWidth: 200}}>
    <TextLabel value={row.name} />
    <NumberBar value={row.age} scale={normalize(0, 50)} />
    <CategoricalColor value={row.shirtSize} color="red" />
    <DateLabel value={row.birthday} />
  </div>;
}
```