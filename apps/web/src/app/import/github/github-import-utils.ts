export type LoadState = "idle" | "loading" | "ready" | "error";
export type ImportState = "idle" | "importing" | "done";

export const GITHUB_CONNECTION_REQUIRED_ERROR = "Connect GitHub before importing repositories.";

export function getOAuthErrorMessage(code: string) {
  switch (code.toLowerCase()) {
    case "account_already_linked_to_different_user":
      return "This GitHub account is linked to another OpenDraw account. Sign in to that account, or connect a different GitHub account.";
    case "unable_to_link_account":
    case "account_not_linked":
      return "We could not connect that GitHub account. Please try again.";
    case "access_denied":
      return "GitHub authorization was cancelled. You can try again when ready.";
    case "provider_not_found":
      return "GitHub access is not configured yet. Add the GitHub OAuth client ID and secret to the server environment.";
    default:
      return "We could not connect to GitHub right now. Please try again.";
  }
}

export function normalizeRepoTarget(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/$/, "");
}
