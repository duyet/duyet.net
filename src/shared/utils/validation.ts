export const getSlug = (url: string): string => {
  try {
    const normalizedUrl = ("" + url).replace(/^\/+/, "");
    const parsedUrl = new URL(normalizedUrl, "http://localhost");
    const pathname = parsedUrl.pathname;
    return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  } catch {
    return "/";
  }
};

export const isBot = (ua?: string | null): boolean => {
  const pattern = /bot|crawl|http|lighthouse|scan|search|spider|upptime/i;
  return Boolean(ua) && pattern.test(ua || "");
};

export const validateSlug = (slug: string): boolean => {
  return /^[a-zA-Z0-9\-_/.]+$/.test(slug);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};
