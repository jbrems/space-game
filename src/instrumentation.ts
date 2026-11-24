import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { TreeConsoleSpanProcessor } from "./TreeConsoleSpanProcessor";
import {NoopSpanProcessor} from "@opentelemetry/sdk-trace-node";

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Registering instrumentation for Node.js runtime');

    const sdk = new NodeSDK({
      resource: new Resource({
        "service.name": "space-game",
        "service.version": "1.0.0",
      }),
      // spanProcessor: new TreeConsoleSpanProcessor(),
      spanProcessor: new NoopSpanProcessor(),
    })

    sdk.start()
  }
}