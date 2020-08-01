import React from 'react';

export const histWrapperStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: 'x-small',
    justifyContent: 'space-evenly',
    minHeight: '3em',
    marginBottom: '1em',
    position: 'relative',
};

export const histBinStyle: React.CSSProperties = {
    position: 'relative',
    flexGrow: 1,
};

export const histBinInnerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    width: '90%'
};

export const histBinLabelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    overflow: 'hidden',
    textAlign: 'center',
};

export const histMinSpanStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '50%',
    overflow: 'hidden',
    textAlign: 'left',
};


export const histMaxSpanStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '50%',
    overflow: 'hidden',
    textAlign: 'right',
};
