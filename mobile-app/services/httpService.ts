type HttpResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
};

class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:9393') {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<HttpResponse<T>> {
    console.log(`Making GET request to: ${this.baseUrl}${path}`);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
