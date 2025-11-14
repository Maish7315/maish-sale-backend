// This is a serverless-only backend
// All functionality is handled by functions in the /api/ directory

module.exports = (req, res) => {
  res.status(200).json({
    message: 'Maish Sale Sync Backend - Serverless API',
    endpoints: {
      auth: {
        signup: '/api/auth/signup',
        login: '/api/auth/login'
      },
      sales: {
        create: '/api/sales/createSale',
        get: '/api/sales/getSales'
      },
      health: '/api/health'
    }
  });
};