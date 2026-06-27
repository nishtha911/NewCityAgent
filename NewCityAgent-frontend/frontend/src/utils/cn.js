export function cn(...args) {
  return args
    .flat(Infinity)
    .filter(Boolean)
    .filter((x) => typeof x === 'string')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
