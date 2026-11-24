export function randomHexId(characterLength: number): string {
  if (!Number.isSafeInteger(characterLength) || characterLength <= 0) {
    throw new RangeError("Character length must be a positive safe integer.");
  }

  const bytes = new Uint8Array(Math.ceil(characterLength / 2));
  let id: string;

  do {
    crypto.getRandomValues(bytes);
    id = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, characterLength);
  } while (/^0+$/.test(id));

  return id;
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function determineSuccess(success: number) {
  if (success < 0.1) throw new Error('Kaboom')
  const stepSuccess = 0.5 + Math.random() * 0.5
  const newSuccess = stepSuccess * success

  await delay(250 + Math.random() * 250)

  return newSuccess
}