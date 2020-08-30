import React from 'react';

// duplicate skeleton for better bundling

export default function Skeleton() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 300 200"
        style={{ maxWidth: '80vw', maxHeight: '80vh', flexGrow: 1, background: '#F4F4F4' }}
      ></svg>
    </div>
  );
}
