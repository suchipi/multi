type Env = "client" | "server";

let env: Env | null = null;

export function setEnv(nextEnv: Env) {
  env = nextEnv;
}

export function getEnv(): Env {
  if (env == null) {
    throw new Error("Tried to read env before it was set");
  } else {
    return env;
  }
}
