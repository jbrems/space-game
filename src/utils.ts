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