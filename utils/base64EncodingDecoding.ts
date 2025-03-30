import baseX from 'base-x';

const BASE62_ALPHABET: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const base62 = baseX(BASE62_ALPHABET);

// Encode a number
export function encodeBase62(input: string) {
    return base62.encode(Buffer.from(input.toString()));
}

// Decode a Base62 string
export function decodeBase62(input: string) {
    return parseInt(base62.decode(input).toString(), 10);
}
