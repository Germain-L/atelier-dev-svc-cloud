import {withSwagger} from 'next-swagger-doc';

const swaggerHandler = withSwagger({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MFLIX Swagger',
            version: '0.1.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'local development server',
            },
            {
                url: 'https://atelier-dev-svc-cloud.vercel.app',
                description: 'production server',
            },
        ],
    },
    apiFolder: 'pages/api',
});
export default swaggerHandler();
