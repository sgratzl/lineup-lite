import React from 'react';
import { ICommonStats } from '../../stats/common';
import { toPercent } from '../utils';

const histWrapperStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: 'xx-small',
    justifyContent: 'space-evenly',
    minHeight: '2.5em',
    marginBottom: '1em',
    position: 'relative',
};

const histBinStyle: React.CSSProperties = {
    position: 'relative',
    marginRight: 1,
    flexGrow: 1,
};
const histBinStyleDense: React.CSSProperties = {
    marginRight: 0
}

const histBinLabelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    overflow: 'hidden',
    textAlign: 'center',
};

const histMinSpanStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '50%',
    overflow: 'hidden',
    textAlign: 'left',
};


const histMaxSpanStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '50%',
    overflow: 'hidden',
    textAlign: 'right',
};

interface HistogramProps<T> {
    s: ICommonStats<T> & { readonly min?: T, readonly max?: T };
    maxBin?: number;
    label?: boolean;
}

export default function Histogram<T>(props: HistogramProps<T>) {
    const maxBin = (props.maxBin ?? props.s.maxBin);
    const lastBin = props.s.hist.length - 1;
    const dense = props.s.hist.length > 10;
    return <div style={histWrapperStyle}>
        {props.s.hist.map((h, i) => {
            const p = toPercent(h.count / maxBin);
            return <div key={String(h.x0)} style={{ ...histBinStyle, ...(dense || i === lastBin ? histBinStyleDense : {}), backgroundImage: `linear-gradient(to top, ${h.color} ${p}, transparent ${p})` }}>
                {props.label && <span style={histBinLabelStyle}>{props.s.format(h.x0)}</span>}
            </div>
        })}
        {props.s.min != null && <span style={histMinSpanStyle} >{props.s.format(props.s.min)}</span>}
        {props.s.max != null && <span style={histMaxSpanStyle} >{props.s.format(props.s.max)}</span>}
    </div>
}