/**
 * Where the emoji picker reads its Emojibase data: our own copy on
 * emoji.voila.dev rather than a public npm CDN, so a thread opens no request
 * outside our domains. The version is in the path, which lets the data be
 * cached forever; apps/emoji.voila.dev refuses to build when its pinned
 * emojibase-data differs from this one.
 */
export const EMOJIBASE_URL = "https://emoji.voila.dev/emojibase-data@17.0.0";
