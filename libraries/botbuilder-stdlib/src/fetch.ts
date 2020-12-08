// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Common init type for fetch calls, works regardless of platform
export type ReqInit = Omit<RequestInit, 'body' | 'headers' | 'signal'> & {
    body: string;
    headers: Record<string, string>;
};

// Common headers representation
export type Headers = Iterable<[string, string]> & {
    get(name: string): string | null;
};

// Common response type that is consistent regardless of platform
export type Resp = Omit<Response, 'blob' | 'body' | 'clone' | 'formData' | 'headers' | 'trailer'> & {
    headers: Headers;
};

/**
 * A (relatively type safe) cross-environment fetch implementation.
 *
 * @param {string} url url to fetch
 * @param {ReqInit} options options to pass to fetch
 * @returns {Promise<Resp>} a promise representing the fetch operation
 */
export async function fetch<RI extends ReqInit = ReqInit>(url: string, requestInit?: RI): Promise<Resp> {
    if (typeof window !== 'undefined') {
        return window.fetch(url, requestInit);
    }

    if (typeof self !== 'undefined') {
        return self.fetch(url, requestInit);
    }

    const fetch = await import('node-fetch');
    return fetch?.default(url, requestInit);
}
