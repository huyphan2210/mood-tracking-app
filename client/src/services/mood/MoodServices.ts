import { AnalyzeMoodRequestPOST } from "@/lib/api/data-contracts";
import { POSTApi, ServiceError } from "../ServiceBase";

const API_URL = "/api/mood";

export const createMood = async (payload: AnalyzeMoodRequestPOST) => {
  try {
    return await POSTApi<AnalyzeMoodRequestPOST, void>(
      `${API_URL}/create`,
      payload,
    );
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError("Mood Service is temporarily unavailable");
  }
};
