export async function GET(req: Request) {
 
    console.log("hello")
    return new Response(
    JSON.stringify({
        message: "Token exchanged successfully"
    }),
    { status: 200 },
    );

  }
  