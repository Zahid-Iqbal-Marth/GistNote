export const returnAPI : (params: string) => string = (params : string) => `https://api.github.com/${params}`
export const AUTH_TOKEN = ' token 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';
export const returnHeaders :  (method?: string, body?: string, headers?: Headers) => {
        method: string;
        headers: Headers;
        body: string | null;
    }
    = ( method = 'GET', 
        body = '',
        headers = new Headers({'Authorization': AUTH_TOKEN})) => (
    { 
        method, 
        headers,
        body : method === 'GET' ? null : body
  })
