export type Environment = {
    postgresUrl: string,
}

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Environment variable ${name} is required, but was not found`);
    }
    return value;
};

const fromEnv = (): Environment => ({
    postgresUrl: requireEnv("POSTGRES_URL"),
});


export const environment = {
    fromEnv,
};
