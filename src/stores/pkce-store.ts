import { cacheClient } from "../configs/connections.js";
interface PkceTransaction {
    codeVerifier: string;
    createdAt: number;
    expireAt: number;
}

// Keyed by the OAuth `state` value. In-memory is fine for a single instance;
// for multiple instances behind a load balancer, back this with Redis
// (it only needs to live ~5 minutes, so a short TTL cache works well).
// const transactions = new Map<string, PkceTransaction>();

const TRANSACTION_TTL_MS: number = 5 * 60 * 1000; // 5 minutes to complete the login round-trip

// export function savePkceTransaction(state: string, codeVerifier: string): void {
//     transactions.set(state, { codeVerifier, createdAt: Date.now() });
// }

// export function consumePkceTransaction(state: string): string | null {
//     const entry = transactions.get(state);
//     transactions.delete(state); // one-time use regardless of outcome

//     if (!entry) return null;
//     if (Date.now() - entry.createdAt > TRANSACTION_TTL_MS) return null;

//     return entry.codeVerifier;
// }

// Periodic sweep so abandoned login attempts don't accumulate
// setInterval(() => {
//     const now = Date.now();
//     for (const [state, entry] of transactions) {
//         if (now - entry.createdAt > TRANSACTION_TTL_MS) transactions.delete(state);
//     }
// }, 60 * 1000).unref();

export async function savePkceTransactionToRedis(state: string, codeVerifier: string): Promise<void> {
    const transaction: PkceTransaction = { codeVerifier, createdAt: Date.now(), expireAt: Date.now() + TRANSACTION_TTL_MS };
    await cacheClient.set(state, JSON.stringify(transaction), 'PX', TRANSACTION_TTL_MS);
}
export async function consumePkceTransactionFromRedis(state: string): Promise<string | null> {
    const entryStr = await cacheClient.get(state);
    if (!entryStr) return null;
    const entry: PkceTransaction = JSON.parse(entryStr);
    if (Date.now() > entry.expireAt) {
        await cacheClient.del(state);
        return null;
    }
    return entry.codeVerifier;
}