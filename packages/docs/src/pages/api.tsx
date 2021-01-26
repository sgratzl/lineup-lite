import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function API() {
  return (
    <Layout title={`API Overview`} description="LineUp-lite API Docs">
      <div className="container">
        <div className="row padding-vert--lg">
          <div className="col">
            <h1>API Docs</h1>
            <p>The API documentation is automatically generated using TypeDoc</p>
            <ul>
              <li>
                <Link to={useBaseUrl('api/table/')}>LineUp-lite Table Docs</Link>
              </li>
              <li>
                <Link to={useBaseUrl('api/hooks/')}>LineUp-lite Hooks Docs</Link>
              </li>
              <li>
                <Link to={useBaseUrl('api/components/')}>LineUp-lite Components Docs</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
