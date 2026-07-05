// Vercel Serverless Function Entry Point
// All /api/* requests are routed here by vercel.json
// This file imports the Express app and lets Vercel invoke it
const app = require('../server/index');

module.exports = app;
