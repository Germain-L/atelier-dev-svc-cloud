import Head from 'next/head';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Swagger = (): JSX.Element => {
  return (
    <div>
      <Head>
        <title>MFLIX API</title>
        <meta name="description" content="MFLIX API" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <SwaggerUI url="/api/doc" />
    </div>
  );
};

export default Swagger;
