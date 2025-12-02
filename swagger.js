import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 5001;
const API_URL = process.env.API_URL || `http://localhost:${PORT}/api`;




const swaggerOptions = {
definition: {
openapi: "3.0.0",
info: {
title: "Food Recipes API",
version: "1.0.0",
description: "API documentation for your full recipe application",
},
servers: [{ url: API_URL }],
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
