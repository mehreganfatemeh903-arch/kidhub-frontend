export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    const origin = request.headers.get("Origin");

    const allowedOrigin =
      (origin === "https://kidhub-frontend.mehreganfatemeh903.workers.dev" || origin === "http://localhost:3000" || origin === "http://127.0.0.1:3000")
        ? origin
        : "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods":
            "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin",
        },
      });
    }

    const pathname = url.pathname;

    let targetPath = "";

    if (pathname.startsWith("/api-proxy/")) {
      targetPath = pathname.replace(/^\/api-proxy/, "");
    } else {
      return new Response("not found", { status: 404 });
    }

    const targetUrl =
      `https://kidhub-backend-9kleeb.cranl.net${targetPath.startsWith("/media/") ? targetPath : `/api${targetPath}`}${url.search}`;

    const headers = new Headers();

    for (const name of [
      "Content-Type",
      "Accept",
      "Authorization",
    ]) {
      const value = request.headers.get(name);
      if (value) {
        headers.set(name, value);
      }
    }

    console.log("PROXY_TARGET", targetUrl);

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : request.body,
      redirect: "manual",
    });

    console.log("PROXY_STATUS", response.status, response.statusText, response.url);

      const responseHeaders = new Headers(response.headers);

    if (allowedOrigin) {
      responseHeaders.set(
        "Access-Control-Allow-Origin",
        allowedOrigin
      );
      responseHeaders.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      );
      responseHeaders.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      responseHeaders.set("Vary", "Origin");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};







