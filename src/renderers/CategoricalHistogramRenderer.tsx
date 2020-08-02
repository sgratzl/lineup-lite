import React from 'react';
import { Renderer } from 'react-table';
import { StatsProps } from '../hooks/useStats';
import { categoricalStats } from '../stats/categoricalStats';
import { CategoricalRendererOptions } from './CategoricalRenderer';
import Histogram, { HistogramProps, generateBinTitle } from './components/Histogram';
import { extractStats, isFilterAble, toPercent } from './utils';

export interface CategoricalHistogramRendererOptions extends CategoricalRendererOptions {
  maxBin?: number;
}

export interface InteractiveCategoricalHistogramProps extends HistogramProps<string> {
  setFilter: (value: any) => void;
  filterValue: any;
}

export function InteractiveCategoricalHistogram(props: InteractiveCategoricalHistogramProps) {
  const maxBin = props.maxBin ?? props.s.maxBin;
  const { setFilter, filterValue } = props;
  const current: string[] = filterValue ?? [];
  const lastBin = props.s.hist.length - 1;
  const dense = props.s.hist.length > 10;
  const hist = props.s.hist;

  const onClick = React.useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      const bin = hist[Number.parseInt(evt.currentTarget.dataset.i!, 10)];
      const value = bin.x0;
      const next = current.includes(value) ? current.filter((d) => d !== value) : current.concat([value]);
      setFilter(next);
    },
    [setFilter, hist, current]
  );
  return (
    <div className="lt-histogram lt-summary">
      {props.s.hist.map((h, i) => {
        const p = toPercent(h.count / maxBin);
        return (
          <div
            key={String(h.x0)}
            className={
              'lt-histogram-bin lt-histogram-bin-interactive' +
              (dense || i === lastBin ? ' lt-histogram-bin-dense' : '')
            }
            style={{
              backgroundImage: `linear-gradient(to top, ${h.color} ${p}, transparent ${p})`,
              opacity: current.includes(h.x0) ? 0.2 : undefined,
            }}
            data-i={i}
            onClick={onClick}
            data-label={props.s.format(h.x0)}
            title={generateBinTitle(props, h)}
          />
        );
      })}
    </div>
  );
}

export default function CategoricalHistogramRenderer<P extends { value: readonly string[] } | StatsProps<any>>(
  options: CategoricalHistogramRendererOptions = {}
): Renderer<P> {
  const stats = categoricalStats(options);
  return (props: P) => {
    const s = extractStats(props, stats);
    if (isFilterAble(props) && props.column.canFilter) {
      const { setFilter, filterValue } = props.column;
      return (
        <InteractiveCategoricalHistogram
          s={s}
          maxBin={options.maxBin}
          setFilter={setFilter}
          filterValue={filterValue}
        />
      );
    }
    return <Histogram s={s} maxBin={options.maxBin} label />;
  };
}
