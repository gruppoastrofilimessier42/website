import { decompressSync, compressSync, strToU8, strFromU8 } from "fflate";
import { bytesToBase64, base64ToBytes } from "byte-base64";

// TODO check whether the serialize and deserialize functions are deterministic or NOT!
// Maybe it depends on time

export function serializeQueryComponent(value: Object | null): string {
  const cleanValue = JSON.parse(JSON.stringify(value));
  const uint8Value = strToU8(JSON.stringify(cleanValue));
  return encodeURIComponent(bytesToBase64(compressSync(uint8Value)));
}

export function deserializeQueryComponent(value: string): Object {
  const base64CompressedValue = decodeURIComponent(value);
  const uint8CompressedValue = base64ToBytes(base64CompressedValue);
  const decompressedValue = strFromU8(decompressSync(uint8CompressedValue));
  return JSON.parse(decompressedValue);
}
