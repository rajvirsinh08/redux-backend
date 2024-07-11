const StatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,

};

const MESSAGES = {
    EMAIL_ALREADY_IN_USE: "Email already in use",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    NO_TOKEN_PROVIDED: "No token provided",
    TOKEN_EXPIRED: "Token has expired",
};

module.exports = { StatusCodes, MESSAGES };
