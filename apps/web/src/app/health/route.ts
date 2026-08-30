/** Public deployment probe used by Coolify and the release workflow. */
export function GET() {
  return Response.json({
    status: "ok",
    release: process.env.OPENDRAW_RELEASE ?? "development",
  });
}
