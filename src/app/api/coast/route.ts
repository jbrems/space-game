import { logger } from "@/src/logger";
import { determineSuccess } from "@/src/utils";
import {trace} from "@opentelemetry/api";

const tracer = trace.getTracer('space-game');

export const POST = async (request: Request) => {
  const data = await request.json();

  const mission = data.mission;

  try {
    logger.info(`Coasting mission: ${mission.name}`);

    let success = mission.steps.at(-1).success;

    await tracer.startActiveSpan('Max Q', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Max Q", success })
        logger.info({ success }, 'Max Q')
      } finally {
        span.end()
      }
    });

    await tracer.startActiveSpan('Main engine cut off', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Main engine cut off", success })
        logger.info({ success }, 'Main engine cut off')
      } finally {
        span.end()
      }
    });

    await tracer.startActiveSpan('Stage separation', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Stage separation", success })
        logger.info({ success }, 'Stage separation')
      } finally {
        span.end()
      }
    });

    await tracer.startActiveSpan('Second engine ignition', async (span) => {
      try {
        success = await determineSuccess(success);
        mission.steps.push({ step: "Second engine ignition", success })
        logger.info({ success }, 'Second engine ignition')
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
