// Vercel serverless function entry point
const { getApp } = require('../dist/index.cjs');

module.exports = async (req, res) => {
    const app = await getApp();
    return app(req, res);
};
