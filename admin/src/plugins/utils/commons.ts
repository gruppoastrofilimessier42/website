import { decompressSync, compressSync, strToU8, strFromU8 } from "fflate";
import { bytesToBase64, base64ToBytes } from "byte-base64";

export function serializeQueryComponent(value: object) {
  const uint8Value = strToU8(JSON.stringify(value));
  return encodeURIComponent(bytesToBase64(compressSync(uint8Value)));
}

export function deserializeQueryComponent(value: string) {
  const base64CompressedValue = decodeURIComponent(value);
  const uint8CompressedValue = base64ToBytes(base64CompressedValue);
  const decompressedValue = strFromU8(decompressSync(uint8CompressedValue));
  return JSON.parse(decompressedValue);
}
