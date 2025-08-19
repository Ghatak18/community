

const errorHandler = (res, options = {}) => {
    const {
        message = "Something went wrong",
        statusCode = 500,
        errors = null,
        stack = null
    } = options;

    const response = {
        success: false,
        message,
        statusCode,
        ...(errors && { errors }) // Include errors only if provided
    };

    // Show stack trace in development mode (optional)
    if (process.env.NODE_ENV === "development" && stack) {
        response.stack = stack;
    }

    return res.status(statusCode).json(response);
};

module.exports = errorHandler;


