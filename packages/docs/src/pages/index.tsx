/**
 * @lineup-lite/docs
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';
import Filter3FillIcon from 'remixicon-react/Filter3FillIcon';
import NewspaperLineIcon from 'remixicon-react/NewspaperLineIcon';
import BarChartBoxLineIcon from 'remixicon-react/BarChartBoxLineIcon';
import StackLineIcon from 'remixicon-react/StackLineIcon';

function Feature({ imageUrl, title, children }: PropsWithChildren<{ imageUrl: string | ReactNode; title: string }>) {
  const imgUrl = useBaseUrl(typeof imageUrl === 'string' ? imageUrl : '/');
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imageUrl && (
        <div className="text--center">
          {typeof imageUrl === 'string' && <img className={styles.featureImage} src={imgUrl} alt={title} />}
          {typeof imageUrl !== 'string' && imageUrl}
        </div>
      )}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Homepage" description="LineUp-lite is a LineUp implementation based on react-table">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to="https://github.com/sgratzl/lineup-lite"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <Feature title="Based on react-table" imageUrl="img/react-table.svg">
                {`LineUp-lite is an extension and is based on `}
                <a href="https://react-table.tanstack.com/">react-table</a>
                {`, a light-weight, headless React data table library.`}
              </Feature>
              <Feature
                title="Inspired by IEEEVIS publication"
                imageUrl={<NewspaperLineIcon className={styles.featureImageSVG} />}
              >
                {`LineUp-lite is inspired on the award winning paper `}
                <a href="https://lineup.caleydo.org/">Visual Analysis of Multi-Attribute Rankings</a>
                {` by Gratzl et. al. and is the lightweight nephew of `}
                <a href="https://lineup.js.org/">LineUp.js</a>
                {`.`}
              </Feature>
              <Feature
                title="Multiple abstraction levels"
                imageUrl={<StackLineIcon className={styles.featureImageSVG} />}
              >
                {`LineUp-lite supports three abstraction levels. Ranging from individual `}
                <Link to={useBaseUrl('docs/components')}>components</Link>
                {', over '}
                <Link to={useBaseUrl('docs/hooks')}>react-table hooks</Link>
                {', to a ready-to-use '}
                <Link to={useBaseUrl('docs/table')}>LineUpLite React component</Link>
                {'.'}
              </Feature>
              <Feature
                title="Flexible interactive filtering"
                imageUrl={<Filter3FillIcon className={styles.featureImageSVG} />}
              >
                {`Columns can be interactively filtered based on the column type using the column header.`}
              </Feature>
              <Feature
                title="Various proven visual encodings"
                imageUrl={<BarChartBoxLineIcon className={styles.featureImageSVG} />}
              >
                {`Proven visual visualizations for cells, aggregations, and summaries, such as `}
                <Link to={useBaseUrl('docs/components/number')}>Bars, Histograms, and Boxplots</Link>
                {`.`}
              </Feature>
              <Feature title="Written in TypeScript" imageUrl="img/typescript-seeklogo.com.svg">
                {`Developed using latest web technologies and written in clean TypeScript.`}
              </Feature>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
