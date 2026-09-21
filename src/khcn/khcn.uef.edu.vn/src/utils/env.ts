import { domain } from "./domain";

const isDeployDemo = false;

export const SERVER_API_URL =
  import.meta.env.MODE == "production"
    ? isDeployDemo
      ? "https://apikhcn.codex.io.vn/api"
      : "https://apikhcn.uef.edu.vn/api"
    : "https://localhost:44364/api";
export const MAILER_API_URL = `${domain}/v1`;
export const JWT_SECRET_KEY = "ByYM000OLlMQG6VVVp1OH7Xzyr7gHuw1qvUC5dcGt3SNM";
export const KEKHAI_SYSTEM_URL =
  import.meta.env.MODE == "production"
    ? isDeployDemo
      ? "https://uef-kekhai.codex.io.vn"
      : "https://kekhaikhcn.uef.edu.vn"
    : "https://localhost:44370";
export const ASSETS_KHCN_URL = domain;
