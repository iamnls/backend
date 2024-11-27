const envMiddleware = (req, res, next) => {
    req.env = {
        dbConnection: process.env.DB_CONNECTION,
    };
    next();
};

module.exports = envMiddleware;
