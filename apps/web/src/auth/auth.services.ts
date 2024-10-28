import ky from "ky";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const API_URL = "http://localhost:8080";

const api = ky.create({ prefixUrl: `${API_URL}/api` });
const URL_REFRESH_TOKEN = "";

export const getAccessToken = () => cookies.get("user_token");

export const getRefreshToken = () => cookies.get("user_refresh_token");

export const login = async ({email}: {email: string}) => {
  try {
    const response = await api
        .post("auth/login", {
          json: { identity: email },
        })
        .json();

    if (!response.status) {
      throw new Error(response.message);
    }

    cookies.set("user_token", response.data);
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

//TODO refresh token mechanics need to be implemented, while this step achieves integration in authorization flows
export const refreshAccessToken = async () => {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (!accessToken || !refreshToken) {
      // await forcedLogout();
      return;
    }

    //TODO there is no refresh token endpoint in our api
    const response = await api
      .post(URL_REFRESH_TOKEN, {
        json: { AccessToken: accessToken, RefreshToken: refreshToken },
      })
      .json();

    // const validData = signInResponseSuccessSchema.parse(responseData);
    //
    // await saveAccessToken(validData.resource.token);
    // await saveRefreshToken(validData.resource.refreshToken);
    //
    // return validData.resource.token;
  } catch (error: unknown) {
    if (error.name === "HTTPError") {
      // const errorJson = await error.response.json();
      // const errorMessage = getErrorMessage(errorJson);
      // logError(errorMessage);
    }

    // await forcedLogout();

    throw new Error("Failed to refresh token");
  }
};
