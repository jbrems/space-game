import { logger } from "@/src/logger";
import { determineSuccess } from "@/src/utils";
import {trace} from "@opentelemetry/api";

const tracer = trace.getTracer('space-game');

export const POST = async (request: Request) => {
  const data = await request.json();

  const mission = data.mission;

  try {
    logger.info(`Landing mission: ${mission.name}`);

    let success = mission.steps.at(-1).success;

    await tracer.startActiveSpan('Landing burn', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Landing burn", success })
        logger.info({ success }, 'Landing burn')
      } finally {
        span.end()
      }
    });

    await tracer.startActiveSpan('Landing', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Landing", success })
        logger.info({ success }, 'Landing')
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
