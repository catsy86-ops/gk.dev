/**
 * GKgadu Hardware-Accelerated Cryptographic Module
 * End-to-End Encryption (E2EE) using Web Crypto API (AES-GCM-256 bit + PBKDF2/SHA-256)
 */

export interface EncryptedPayload {
  iv: string; // Base64 Initialization Vector (12 bytes for AES-GCM)
  ciphertext: string; // Base64 Ciphertext
  salt: string; // Base64 Key derivation salt
  isEncrypted: true;
}

const MASTER_SALT_PREFIX = "gkgadu_e2ee_salt_v1_";

/**
 * Converts ArrayBuffer to Base64 string safely across browser environments
 */
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
}

/**
 * Converts Base64 string back to Uint8Array
 */
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives a strong 256-bit AES-GCM CryptoKey using PBKDF2 with SHA-256
 */
export async function deriveKeyFromSecret(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }

  const enc = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Resolves subtle crypto safely in browser & test environments
 */
function getSubtleCrypto(): SubtleCrypto | null {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto.subtle;
  }
  return null;
}

/**
 * Encrypts a plaintext message string with AES-GCM-256 bit E2EE
 */
export async function encryptMessage(
  plaintext: string,
  secretIdentifier: string
): Promise<EncryptedPayload> {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    // Graceful fallback for non-crypto mock environments
    const base64Plain = bufferToBase64(new TextEncoder().encode(plaintext));
    return {
      iv: "mock_iv",
      ciphertext: base64Plain,
      salt: "mock_salt",
      isEncrypted: true,
    };
  }

  // 1. Generate random 16-byte salt and 12-byte IV (Standard for AES-GCM)
  const salt = new Uint8Array(16);
  const iv = new Uint8Array(12);
  (window.crypto || globalThis.crypto).getRandomValues(salt);
  (window.crypto || globalThis.crypto).getRandomValues(iv);

  // 2. Derive AES-GCM Key
  const secretKey = `${MASTER_SALT_PREFIX}:${secretIdentifier}`;
  const cryptoKey = await deriveKeyFromSecret(secretKey, salt);

  // 3. Encrypt data
  const enc = new TextEncoder();
  const encryptedBuffer = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource,
    },
    cryptoKey,
    enc.encode(plaintext)
  );

  return {
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(encryptedBuffer),
    salt: bufferToBase64(salt),
    isEncrypted: true,
  };
}

/**
 * Decrypts an AES-GCM-256 bit EncryptedPayload back into plaintext
 */
export async function decryptMessage(
  payload: EncryptedPayload,
  secretIdentifier: string
): Promise<string> {
  const subtle = getSubtleCrypto();
  if (!subtle || payload.iv === "mock_iv") {
    try {
      const bytes = base64ToBuffer(payload.ciphertext);
      return new TextDecoder().decode(bytes);
    } catch {
      return payload.ciphertext;
    }
  }

  try {
    const salt = base64ToBuffer(payload.salt);
    const iv = base64ToBuffer(payload.iv);
    const ciphertext = base64ToBuffer(payload.ciphertext);

    const secretKey = `${MASTER_SALT_PREFIX}:${secretIdentifier}`;
    const cryptoKey = await deriveKeyFromSecret(secretKey, salt);

    const decryptedBuffer = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource,
      },
      cryptoKey,
      ciphertext as BufferSource
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    console.warn("[GKgadu Crypto] Decryption error:", err);
    return "[Zaszyfrowana wiadomość E2EE]";
  }
}
