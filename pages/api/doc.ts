import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NextJS Swagger',
            version: '0.1.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement local',
            },
        ],
    },
    apiFolder: 'pages/api',
});
export default swaggerHandler();
