import { logger } from "@/src/logger";
import { determineSuccess } from "@/src/utils";

export const POST = async (request: Request) => {
  const data = await request.json();

  const mission = data.mission;

  try {
    logger.info(`Coasting mission: ${mission.name}`);

    let success = await determineSuccess(mission.steps.at(-1).success);
    mission.steps.push({ step: "Max Q", success })

    logger.info({ success }, 'Max Q')

    success = await determineSuccess(success);
    mission.steps.push({ step: "Main engine cut off", success })

    logger.info({ success }, 'Main engine cut off')

    success = await determineSuccess(success);
    mission.steps.push({ step: "Stage separation", success })

    logger.info({ success }, 'Stage separation')

    success = await determineSuccess(success);
    mission.steps.push({ step: "Second engine ignition", success })

    logger.info({ success }, 'Second engine ignition')
  } catch (error) {
    logger.error("Mission failed");
  }

  return new Response(JSON.stringify({ mission }), {
    headers: { "Content-Type": "application/json" }
  });
}
