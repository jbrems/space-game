import {
    ReadableSpan,
    Span,
    SpanProcessor,
} from "@opentelemetry/sdk-trace-base";

type StoredSpan = {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    name: string;
    startTime: ReadableSpan["startTime"];
    durationMs: number;
};

type StoredTrace = {
    spans: StoredSpan[];
    activeSpanIds: Set<string>;
    timeout?: NodeJS.Timeout;
};

export class TreeConsoleSpanProcessor implements SpanProcessor {
    private traces = new Map<string, StoredTrace>();

    onStart(span: Span): void {
        const { traceId, spanId } = span.spanContext();
        const trace = this.getTrace(traceId);

        if (trace.activeSpanIds.size === 0) {
            // Bound buffering when a span never ends.
            this.schedulePrint(traceId, trace, 30_000);
        }

        trace.activeSpanIds.add(spanId);
    }

    onEnd(span: ReadableSpan): void {
        const traceId = span.spanContext().traceId;

        const durationMs =
            span.duration[0] * 1000 +
            span.duration[1] / 1_000_000;

        const trace = this.getTrace(traceId);

        trace.spans.push({
            traceId,
            spanId: span.spanContext().spanId,
            parentSpanId: span.parentSpanId,
            name: span.name,
            startTime: span.startTime,
            durationMs,
        });

        trace.activeSpanIds.delete(span.spanContext().spanId);

        if (trace.activeSpanIds.size === 0) {
            this.schedulePrint(traceId, trace, 500);
        }
    }

    async shutdown(): Promise<void> {
        await this.forceFlush();

        for (const trace of this.traces.values()) {
            clearTimeout(trace.timeout);
        }

        this.traces.clear();
    }

    async forceFlush(): Promise<void> {
        for (const [traceId, trace] of this.traces) {
            this.printTrace(traceId);
            trace.spans = [];

            if (trace.activeSpanIds.size === 0) {
                clearTimeout(trace.timeout);
                this.traces.delete(traceId);
            }
        }
    }

    private getTrace(traceId: string): StoredTrace {
        let trace = this.traces.get(traceId);

        if (!trace) {
            trace = { spans: [], activeSpanIds: new Set() };
            this.traces.set(traceId, trace);
        }

        return trace;
    }

    private schedulePrint(
        traceId: string,
        trace: StoredTrace,
        delayMs: number,
    ): void {
        clearTimeout(trace.timeout);
        trace.timeout = setTimeout(() => {
            this.printTrace(traceId);
            this.traces.delete(traceId);
        }, delayMs);
        trace.timeout.unref();
    }

    private printTrace(traceId: string): void {
        const spans = this.traces.get(traceId)?.spans;

        if (!spans?.length) {
            return;
        }

        spans.sort(
            (a, b) =>
                a.startTime[0] - b.startTime[0] ||
                a.startTime[1] - b.startTime[1],
        );

        const byParent = new Map<string | undefined, StoredSpan[]>();

        for (const span of spans) {
            const children = byParent.get(span.parentSpanId) ?? [];
            children.push(span);
            byParent.set(span.parentSpanId, children);
        }

        const spanIds = new Set(spans.map((span) => span.spanId));
        const roots = spans.filter(
            (span) => !span.parentSpanId || !spanIds.has(span.parentSpanId),
        );

        console.log("");
        console.log(`Trace ${traceId}`);

        for (const root of roots) {
            this.printNode(root, byParent, "", true, true);
        }

        console.log("");
    }

    private printNode(
        node: StoredSpan,
        byParent: Map<string | undefined, StoredSpan[]>,
        prefix: string,
        isLast: boolean,
        isRoot = false,
    ): void {
        const connector =
            isRoot
                ? ""
                : isLast
                    ? "└─ "
                    : "├─ ";

        console.log(
            `${prefix}${connector}${node.name} (${Math.round(
                node.durationMs,
            )}ms)`,
        );

        const children = byParent.get(node.spanId) ?? [];

        const nextPrefix =
            isRoot
                ? ""
                : prefix + (isLast ? "   " : "│  ");

        children.forEach((child, index) => {
            this.printNode(
                child,
                byParent,
                nextPrefix,
                index === children.length - 1,
            );
        });
    }
}