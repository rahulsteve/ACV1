import axios from "axios";

interface HlrRes { MCC: string; On: boolean; CountryName: string }
interface LandRes { IsActive: boolean; CountryName: string }
interface ApiResp  {
  DataSoapAPIResponse?: {
    HLRResult?:      HlrRes;
    LandlineResult?: LandRes;
    ErrorCode?:      string;      // -96 etc.
  };
}

const isLandline = (n: string) =>
  /^0(?:1|2|3)/.test(n.replace(/\D/g, "").replace(/^44/, ""));

export async function validateWithDataSoap(lookup: string) {
  /* 1️⃣  read + trim the key so no stray \r or \n can survive */
const apiKey = (process.env.DATASOAP_API_KEY || "").trim();
if (!apiKey) throw new Error("DATASOAP_API_KEY not set");

  const url =
    "https://api.datasoap.co.uk/?" +
    new URLSearchParams({
      output: "json",
      number: lookup.replace(/^0/, "44"),
      type:   isLandline(lookup) ? "Landline" : "HLR",
    });

  console.log("[DS] GET  ", url);

  let rawBody: string;
  try {
    const { data } = await axios.get<string>(url, {
      /* 2️⃣  identical headers to Postman */
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",   // so we see pure “-99” if that’s all we get
      timeout: 10000,
    });
    rawBody = data;
  } catch (err) {
    console.error("[DS] network error", err);
    throw new Error("Number Not Recognized. Please try another number");
  }

  console.log("[DS] RAW ↓↓↓\n" + rawBody);

  /* 3️⃣  plain “-99” means auth failure – bail early */
  if (rawBody.trim() === "-99") {
    throw new Error(
      "Number Not Recognized. Please try another number."
    );
  }

  /* 4️⃣  parse JSON safely */
  let api: ApiResp["DataSoapAPIResponse"];
  try {
    api = (JSON.parse(rawBody) as ApiResp).DataSoapAPIResponse;
  } catch {
    throw new Error("Number Not Recognized. Please try another number.");
  }
  if (!api) throw new Error("Number Not Recognized. Please try another number.");

  const { HLRResult: hlr, LandlineResult: land, ErrorCode } = api;
  if (ErrorCode === "-96") throw new Error("Invalid UK number. Please try another number");

  /* business rules */
  if (hlr) {
    if (hlr.MCC !== "234" && hlr.MCC !== "235")
      throw new Error("Mobile Number not valid - Please try another number.");
    if (!hlr.On) throw new Error("Mobile number is unreachable. Please try another number.");
  }
  if (land) {
    if (!/United Kingdom/i.test(land.CountryName))
      throw new Error("Non-UK land-line – rejected");
    if (!land.IsActive) throw new Error("Land-line not active");
  }

  
  return JSON.parse(rawBody);      // success ➜ callers get the result block
}
