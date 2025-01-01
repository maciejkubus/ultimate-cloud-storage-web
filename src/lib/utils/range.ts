export function range(start: number, size: number) {
  const items: number[] = [];
  for (let i = start; i < size; i++) {
    items.push(i)
  }
  return items;
}