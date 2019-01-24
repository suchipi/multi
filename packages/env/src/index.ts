export type Env = "not-yet-determined" | "server" | "client";
let env: Env = "not-yet-determined";

export function setEnv(newEnv: Env) {
  env = newEnv;
}

export function getEnv(): Env {
  return env;
}
