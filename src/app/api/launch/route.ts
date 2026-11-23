import { logger } from "@/src/logger";
import { determineSuccess } from "@/src/utils";
import {trace} from "@opentelemetry/api";

const tracer = trace.getTracer('space-game');

export const POST = async (request: Request) => {
  const data = await request.json();

  const mission = {
    name: data.missionName,
    steps: [] as { step: string, success: number}[],
  }

  try {
    logger.info(`Launching mission: ${mission.name}`);

    let success = 1;

    await tracer.startActiveSpan('Prelaunch checks', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Prelaunch checks", success })
        logger.info({ success }, 'Prelaunch checks')
      } finally {
        span.end()
      }
    });

    await tracer.startActiveSpan('Ignition', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Ignition", success })
        logger.info({ success }, 'Ignition')
      } finally {
        span.end()
      }
    });

    await tracer.startActiveSpan('Lift off', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Lift off", success })
        logger.info({ success }, 'Lift off')
      } finally {
        span.end()
      }
    });
  } catch (error) {
    logger.error("Mission failed");
  }

  return new Response(JSON.stringify({ mission }), {
    headers: { "Content-Type": "application/json" }
  });
}
