import { logger } from "@/src/logger";
import { determineSuccess } from "@/src/utils";

export const POST = async (request: Request) => {
  const data = await request.json();

  const mission = data.mission;

  try {
    logger.info(`Landing mission: ${mission.name}`);

    let success = await determineSuccess(mission.steps.at(-1).success);
    mission.steps.push({ step: "Landing burn", success })

    logger.info({ success }, 'Landing burn')

    success = await determineSuccess(success);
    mission.steps.push({ step: "Landing", success })

    logger.info({ success }, 'Landing')
  } catch (error) {
    logger.error("Mission failed");
  }

  return new Response(JSON.stringify({ mission }), {
    headers: { "Content-Type": "application/json" }
  });
}
