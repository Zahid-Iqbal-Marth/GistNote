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
