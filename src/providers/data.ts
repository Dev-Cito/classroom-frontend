import { DataProvider, GetListParams, GetListResponse, BaseRecord } from "@refinedev/core";
import { MOCK_SUBJECTS } from "@/constants/mock-data";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
                                                           resource
                                                         }: GetListParams): Promise<GetListResponse<TData>> => {

    if (resource.toLowerCase() !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },

  getOne: async () => { throw new Error("getOne is not implemented in mock data."); },
  create: async () => { throw new Error("create is not implemented in mock data."); },
  update: async () => { throw new Error("update is not implemented in mock data."); },
  deleteOne: async () => { throw new Error("deleteOne is not implemented in mock data."); },
  getApiUrl: () => "",
};