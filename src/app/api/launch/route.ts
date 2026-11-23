import { logger } from "@/src/logger";
import { delay, determineSuccess } from "@/src/utils";

export const POST = async (request: Request) => {
  const data = await request.json();

  const mission = {
    name: data.missionName,
    steps: [] as any[],
  }

  try {
    logger.info(`Launching mission: ${mission.name}`);

    let success = await determineSuccess(1);
    mission.steps.push({ step: "Prelaunch checks", success })

    logger.info({ success }, 'Prelaunch checks')

    success = await determineSuccess(success);
    mission.steps.push({ step: "Ignition", success })

    logger.info({ success }, 'Ignition')

    success = await determineSuccess(success);
    mission.steps.push({ step: "Lift off", success })

    logger.info({ success }, 'Lift off')
  } catch (error) {
    logger.error("Mission failed");
  }

  return new Response(JSON.stringify({ mission }), {
    headers: { "Content-Type": "application/json" }
  });
}
