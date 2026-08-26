import { describe, it, expect } from "vitest";
import {
  encryptMessage,
  decryptMessage,
  bufferToBase64,
  base64ToBuffer,
} from "@/lib/gkgadu-crypto";

describe("GKgadu Hardware-Accelerated Cryptographic Module (E2EE)", () => {
  it("encodes and decodes base64 buffers reversibly", () => {
    const originalText = "Wiadomość testowa GKgadu 2026 ☀️";
    const bytes = new TextEncoder().encode(originalText);
    const base64 = bufferToBase64(bytes);
    const decodedBytes = base64ToBuffer(base64);
    const decodedText = new TextDecoder().decode(decodedBytes);

    expect(decodedText).toBe(originalText);
  });

  it("encrypts and decrypts messages with AES-GCM-256 bit E2EE", async () => {
    const secretRoom = "lounge_e2ee_channel";
    const secretMessage = "Poufna rozmowa z klientem B2B w standardzie AES-GCM-256";

    const encrypted = await encryptMessage(secretMessage, secretRoom);
    expect(encrypted.isEncrypted).toBe(true);
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.salt).toBeDefined();
    expect(encrypted.ciphertext).not.toBe(secretMessage);

    const decrypted = await decryptMessage(encrypted, secretRoom);
    expect(decrypted).toBe(secretMessage);
  });

  it("fails or returns fallback text if decrypted with wrong secret key", async () => {
    const secretRoomA = "room_secret_alpha";
    const secretRoomB = "room_secret_bravo";
    const secretMessage = "Tylko dla uprawnionych użytkowników";

    const encrypted = await encryptMessage(secretMessage, secretRoomA);
    const decryptedWithWrongKey = await decryptMessage(encrypted, secretRoomB);

    expect(decryptedWithWrongKey).not.toBe(secretMessage);
  });
});
