type HttpResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
};

class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.EXPO_PUBLIC_BASE_URL ?? 'http://localhost:9393') {
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
}

export const httpService = new HttpService();
export default HttpService;
