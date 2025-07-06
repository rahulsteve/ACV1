import axios from "axios";
import { Content } from "next/font/google";

interface DataSoapOptions {
  lookup: string;
}

export async function validateWithDataSoap({ lookup }: DataSoapOptions) {
try {
    const token = process.env.DATASOAP_TOKEN;
    const url =process.env.DATASOAP_URL;

    
    const response = await axios.post(
    url,
    {
        lookup,                // same as { lookup: lookup }
        checks: ["Auto"],
    },
    {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        timeout: 10_000       // optional: fails fast on network stalls
    }
    );
    return response.data;
} catch (error: unknown) {
    console.error("DataSoap validation error:", error);
    throw new Error(error +"Validation failed");
}
}
