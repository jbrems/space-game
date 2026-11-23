import { isSpanContextValid, trace, propagation, context } from "@opentelemetry/api";
import pino from "pino";

export const logger = pino({
  name: "space-game",
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.epochTime,
  base: {
    name: "space-game",
  },
  mixin() {
    const span = trace.getActiveSpan()?.spanContext()
    const missionName = propagation.getBaggage(context.active())?.getEntry("mission-name")?.value
    return span && isSpanContextValid(span) ? { traceId: span.traceId, spanId: span.spanId, mission: missionName } : {}
  }
})