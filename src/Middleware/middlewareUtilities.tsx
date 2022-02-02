export const returnAPI: (params: string) => string = (params: string) =>
  `https://api.github.com/${params}`;
export const AUTH_TOKEN = " token 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";
export const returnHeaders: (
  method?: string,
  body?: string,
  headers?: Headers
) => {
  method: string;
  headers: Headers;
  body: string | null;
} = (
  method = "GET",
  body = "",
  headers = new Headers({ Authorization: AUTH_TOKEN })
) => ({
  method,
  headers,
  body: method === "GET" ? null : body,
});
