import ky, {HTTPError} from "ky";

import {getAccessToken, refreshAccessToken} from "./auth.services";

//TODO
// const API_URL = process.env.API_URL;
const API_URL = 'http://localhost:8080';

const createHttpInstance = (optionOverrides = {}) =>
    ky.extend({
        prefixUrl: API_URL,
        hooks: {
            beforeRequest: [
                async (request) => {
                    const accessToken = await getAccessToken();
                    if (accessToken) {
                        request.headers.set("Authorization", `Bearer ${accessToken}`);
                        request.headers.set("Content-Type", "application/json");
                    }
                },
            ],
            beforeRetry: [
                async ({request, error, retryCount}) => {
                    if (
                        error instanceof HTTPError &&
                        error.response.status === 401 &&
                        retryCount === 1
                    ) {
                        try {
                            const newAccessToken = await refreshAccessToken();
                            request.headers.set("Authorization", `Bearer ${newAccessToken}`);
                        } catch (error) {
                            throw new Error("Failed to refresh token");
                        }
                    }
                },
            ],
        },
        retry: {
            methods: ["get", "post"],
            limit: 5,
            statusCodes: [401],
        },
        ...optionOverrides,
    });

export const httpClient = createHttpInstance();
export const apiClient = createHttpInstance({ prefixUrl: `${API_URL}/api` });
