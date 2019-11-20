import tracer from "tracer";
export const log = tracer.console({ format: "{{message}}  - {{file}}:{{line}}" }).log;
