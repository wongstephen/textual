export async function GET() {
  console.log("GET request received");
  return new Response(
    JSON.stringify({ message: "Hello from the sample API!" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
