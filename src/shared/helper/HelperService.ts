// https://codebuckets.com/2018/06/17/extending-typescript-to-serialise-map-objects-to-json/
export function toKeyValueArray<K, V>(map: Map<K, V>): [K, V][] {
  return Array.from(map.entries());
}

export function keyValueArrayToMap<K, V>(keyValueArray: [K, V][]): Map<K, V> {
  return new Map(keyValueArray);
}

export function mapFromJson(jsonStr: string) {
  return new Map(JSON.parse(jsonStr));
}
