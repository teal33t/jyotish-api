type HttpResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
};

class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.EXPO_PUBLIC_JYOTISH_URL ?? 'http://localhost:9393') {
    this.baseUrl = baseUrl;
  }

  async get<T>(
    path: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    
    console.log(`Making GET request to: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  }

  async post<T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse<T>> {
    const url = `${this.baseUrl}${path}`;

    console.log(`Making POST request to: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  }
}

export const httpService = new HttpService();
export const authHttpService = new HttpService(
  process.env.EXPO_PUBLIC_APP_BASE_URL ?? 'http://localhost:5656/api/v1'
);
export default HttpService;
