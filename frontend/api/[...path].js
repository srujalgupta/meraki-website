const stripTrailingSlashes = (value = "") => value.replace(/\/+$/, "");

const getUpstreamUrl = (req, apiOrigin) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const upstreamPath = requestUrl.pathname.replace(/^\/api\/?/, "");
  const upstreamUrl = new URL(upstreamPath, `${stripTrailingSlashes(apiOrigin)}/`);

  upstreamUrl.search = requestUrl.search;
  return upstreamUrl;
};

const getRequestBody = async (req) => {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length ? Buffer.concat(chunks) : undefined;
};

const copyResponseHeaders = (sourceHeaders, res) => {
  const blockedHeaders = new Set(["connection", "content-encoding", "content-length", "transfer-encoding"]);

  sourceHeaders.forEach((value, key) => {
    if (!blockedHeaders.has(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });
};

export default async function handler(req, res) {
  const apiOrigin = stripTrailingSlashes(process.env.API_ORIGIN || process.env.VITE_API_URL || "");

  if (!apiOrigin) {
    return res.status(500).json({
      success: false,
      message: "API_ORIGIN is not configured for the Vercel proxy.",
    });
  }

  try {
    const upstreamUrl = getUpstreamUrl(req, apiOrigin);
    const response = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
      },
      body: await getRequestBody(req),
      redirect: "manual",
    });

    copyResponseHeaders(response.headers, res);
    res.status(response.status);

    const payload = Buffer.from(await response.arrayBuffer());
    return res.send(payload);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Unable to reach the backend service.",
      details:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message,
    });
  }
}
