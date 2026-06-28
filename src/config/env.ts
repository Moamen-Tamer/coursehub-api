const requireEnv = (key: string) => {
    const value: string | undefined = process.env[key];

    if (!value) throw new Error(`${key} is missing`);

    return value
};

const requireNumberEnv = (key: string) => {
    const value: number = Number(requireEnv(key));

    if (Number.isNaN(value)) throw new Error(`${key} must be a number`);

    return value
};

export const env = {
    nodeEnv: requireEnv("NODE_ENV") as "development" | "production",

    serverPort: requireNumberEnv("SERVER_PORT"),

    dbHost: requireEnv("DB_HOST"),
    dbPort: requireNumberEnv("DB_PORT"),
    dbUser: requireEnv("DB_USER"),
    dbPassword: requireEnv("DB_PASSWORD"),
    dbDatabase: requireEnv("DB_DATABASE"),

    accessKeySecret: requireEnv("ACCESS_KEY_SECRET"),
    refreshKeySecret: requireEnv("REFRESH_KEY_SECRET"),

    accessKeyExpiry: requireEnv("ACCESS_KEY_EXPIRY"),
    refreshKeyExpiry: requireEnv("REFRESH_KEY_EXPIRY"),
};