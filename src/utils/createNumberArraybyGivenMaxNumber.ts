export default function createNumberArraybyGivenMaxNumber(number: number) {
  return Array.from({ length: number }, (_, i) => i + 1);
}
