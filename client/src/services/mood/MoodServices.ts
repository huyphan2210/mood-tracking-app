import {
  AnalyzeMoodRequestPOST,
  MoodResponse,
  MoodTrends,
} from "@/lib/api/data-contracts";
import { GETApi, POSTApi, ServiceError } from "../ServiceBase";
import { fillMissingDates } from "@/lib/mood/utility";

const API_URL = "/api/mood";

export const getTodayMood = async () => {
  const startOfDate = new Date();
  startOfDate.setHours(0, 0, 0, 0);
  const endOfDate = new Date(startOfDate);
  endOfDate.setHours(23, 59, 59, 999);

  try {
    const result = await GETApi<MoodResponse | null>(
      `${API_URL}/get-by-time?startDate=${startOfDate.toISOString()}&endDate=${endOfDate.toISOString()}`,
    );

    if (!result) {
      return;
    }

    return result;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError("Mood Service is temporarily unavailable");
  }
};

export const getMoodTrendsOfMonth = async (date: Date) => {
  const now = new Date();

  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const isFuture =
    targetYear > currentYear ||
    (targetYear === currentYear && targetMonth > currentMonth);

  if (isFuture) return;

  const startDate = new Date(targetYear, targetMonth, 1);
  startDate.setHours(0, 0, 0, 0);

  let endDate: Date;

  const isCurrentMonth =
    targetYear === currentYear && targetMonth === currentMonth;

  if (isCurrentMonth) {
    endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);
  } else {
    endDate = new Date(targetYear, targetMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  const trends = await getMoodTrendsByTime(startDate, endDate);

  trends.moodList = fillMissingDates(trends.moodList, startDate, endDate);

  return trends;
};

const getMoodTrendsByTime = async (startDate: Date, endDate: Date) => {
  try {
    const result = await GETApi<MoodTrends>(
      `${API_URL}/get-trends-by-time?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
    );
    return result;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError("Mood Service is temporarily unavailable");
  }
};

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
