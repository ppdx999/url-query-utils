export type Struct = {
  path: string;
  params: {
    [key: string]: string;
  };
};

export const parse = (url: string): Struct => {
  const [path, query] = url.split("?");
  if (!query) return { path, params: {} };

  const params = query.split("&").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    return { ...acc, [key]: value };
  }, {});
  return { path, params };
};

export const get = (url: string, key: string): string | undefined => {
  const { params } = parse(url);
  return params[key];
};

export const set = (
  url: string,
  data: Record<string, string | number | boolean>,
): string => {
  const { path, params } = parse(url);
  const query = Object.entries({ ...params, ...data })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `${path}?${query}`;
};
