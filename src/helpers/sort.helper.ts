export const sortString = (a: string | null, b: string | null, isAsc: boolean, countEmptyAsLast = true) => {
  const secureA = a ?? '';
  const secureB = b ?? '';
  if(countEmptyAsLast) {
    if (secureA.length === 0 && secureB.length !== 0) { return 1 * (isAsc ? 1 : -1); }
    if (secureB.length === 0 && secureA.length !== 0) { return -1 * (isAsc ? 1 : -1); }
  }
  return secureA.localeCompare(secureB) * (isAsc ? 1 : -1);
};

export const sortNumber = (a: number | null, b: number | null, isAsc: boolean) => {
  const aValue = a ?? Number.MIN_VALUE;
  const bValue = b ?? Number.MIN_VALUE;
  return (aValue - bValue) * (isAsc ? 1 : -1);
};

export const sortStringOrNumber = (
  a: string | number | null,
  b: string | number | null,
  type: 'string' | 'number',
  isAsc: boolean
) => {
  if (type === 'string') {
    return sortString(a as string | null, b as string | null, isAsc);
  } else {
    return sortNumber(a as number | null, b as number | null, isAsc);
  }
}