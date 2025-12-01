import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 5001;

const swaggerOptions = {
definition: {
openapi: "3.0.0",
info: {
title: "Food Recipes API",
version: "1.0.0",
description: "API documentation for your full recipe application",
},
servers: [{ url: `http://localhost:${PORT}/api` }],
components: {
securitySchemes: {
bearerAuth: {
type: "http",
scheme: "bearer",
bearerFormat: "JWT",
description: "Enter your JWT token here",
},
},
},
security: [
{
bearerAuth: [],
},
],
},
apis: ["./routes.js", "./auth/authRoutes.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
