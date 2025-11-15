// A simple in-memory set to store invalidated tokens.
// For a production environment, consider using a persistent store like Redis.
export const tokenBlocklist = new Set<string>();