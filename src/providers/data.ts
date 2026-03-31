import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest"
import {BACKEND_BASE_URL} from "@/constants";
import {CreateResponse, ListResponse} from "@/types";
import {HttpError} from "@refinedev/core";

if (!BACKEND_BASE_URL) {
    throw new Error("VITE_BACKEND_BASE_URL is not defined. Check your .env file.");
}

const buildHttpError = async ( response: Response ):Promise<HttpError> => {
    let message = "Request Failed";

    try {
        const payload = (await response.json()) as { message?: string };

        if (payload?.message) message = payload.message;
    }catch{
    //igrnore errors
    }

    return {
        message,
        statusCode: response.status,
    }
}

const options: CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({ resource }) => resource,

        buildQueryParams: async ({ resource, pagination, filters }) => {
            const page = pagination?.currentPage ?? 1;
            const pageSize = pagination?.pageSize ?? 10;
            const params: Record<string, string | number> = { page, limit: pageSize };

            filters?.forEach((filter) => {
                const field = "field" in filter ? filter.field : "";
                const value = String(filter.value);

                if (resource === "subjects") {
                    if (field === "department") params.department = value;
                    if (field === "name" || field === "code") params.search = value;
                }

                if (resource === "classes") {
                    if (field === "search")   params.search  = value;
                    if (field === "subject")  params.subject  = value;
                    if (field === "teacher")  params.teacher  = value;
                    if (field === "status")   params.status   = value;
                }

                if (resource === "users") {
                    if (field === "search") params.search = value;
                    if (field === "role")   params.role   = value;
                }
            });

            return params;
        },

        mapResponse: async (response) => {
            if (!response.ok) throw await buildHttpError(response);

            const payload: ListResponse = await response.json();
            (response as any)._parsed = payload;
            return payload.data ?? [];
        },
        getTotalCount: async (response) => {
            if (!response.ok) throw await buildHttpError(response);

            const payload: ListResponse = (response as any)._parsed;
            return payload?.pagination?.total ?? payload?.data?.length ?? 0;
        }
    },

    create: {
        getEndpoint:({ resource }) => resource,
        buildBodyParams: async ({ variables }) => variables,
        mapResponse: async (response) => {
            const json: CreateResponse = await response.json();

            return json.data ?? [];
        }
    }
}


// Ensure the API base includes the /api prefix expected by the backend mounts
const API_BASE = BACKEND_BASE_URL.replace(/\/+$/, "") + "/api";

const { dataProvider } = createDataProvider(API_BASE, options);

export { dataProvider };