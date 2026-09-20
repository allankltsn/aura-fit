export class InvalidCredentialsError extends Error { constructor() { super('invalid_credentials'); } }
export class UserAlreadyExistsError extends Error { constructor() { super('user_exists'); } }
export class InvalidRefreshTokenError extends Error { constructor() { super('invalid_refresh_token'); } }
export class EmailNotVerifiedError extends Error { constructor() { super('email_not_verified'); } }
