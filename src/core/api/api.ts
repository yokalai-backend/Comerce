import axios, { isAxiosError } from "axios";
import env from "../config/env";
import axiosRetry from "axios-retry";
import { InternalError } from "../errors/internal.error";

const servicesUrl = {
  users: "http://users-service:5003/internal",
};

type ServicesUrl = keyof typeof servicesUrl;

type ServiceSuccessResponse<T> = {
  data: T;
};

type ServicesErrorResponse = {
  message: string;
  code: string;
  statusCode: number;
};

const api = axios.create({
  timeout: 10000,
  headers: { "X-Internal-Key": env.INTERNAL_KEY },
});

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (err) => {
    return axiosRetry.isRetryableError(err) || axiosRetry.isNetworkError(err);
  },
});

function axiosErrorHandler(error: unknown): never {
  if (isAxiosError(error)) {
    if (!error.response) {
      throw new InternalError(
        error.message,
        "NETWORK_ERROR",
        error.config?.url ?? "AXIOS",
        503,
      );
    }
    const data = error.response.data as ServicesErrorResponse;

    throw new InternalError(
      data.message,
      data.code,
      error.config?.url ?? "AXIOS",
      data.statusCode,
    );
  }

  throw new InternalError("Unknown error", "UNKNOWN_ERROR", "AXIOS", 500);
}

export async function getData<T>(
  endroute: string,
  services: ServicesUrl,
): Promise<ServiceSuccessResponse<T>> {
  try {
    const fetch = await api.get(`${servicesUrl[services]}${endroute}`);

    return fetch.data;
  } catch (error) {
    axiosErrorHandler(error);
  }
}

export async function postData<T>(
  endroute: string,
  payload: object,
  services: ServicesUrl,
): Promise<ServiceSuccessResponse<T>> {
  try {
    const fetch = await api.post(
      `${servicesUrl[services]}${endroute}`,
      payload,
    );

    return fetch.data;
  } catch (error) {
    axiosErrorHandler(error);
  }
}
