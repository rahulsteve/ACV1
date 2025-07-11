import { NextRequest, NextResponse } from "next/server";

interface PostcodeItem {
    id: string;
    summaryline: string;
    locationsummary: string;
    type: string;
    count: number;
    addressline1?: string;
    addressline2?: string;
    posttown?: string;
    county?: string;
    postcode?: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const country = searchParams.get('country') || 'GB';
    let postCode = searchParams.get('PF');

    if (!postCode) {
        postCode = ""
    }
    if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const apiKey = process.env.POSTCODER_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Postcoder API key not configured" }, { status: 500 });
    }

    try {
        const apiurl = `https://ws.postcoder.com/pcw/autocomplete/find?apikey=${apiKey}&Country=${country}&identifier=Autocomplete%20Address%20Finder&query=${encodeURIComponent(query.trim())}&postcode=${encodeURIComponent(query.trim())}`
        const response = await fetch(
            `${apiurl}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Handle rate limiting specifically
        if (response.status === 429) {
            return NextResponse.json({ 
                error: "Too many requests. Please wait a moment and try again." 
            }, { status: 429 });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Postcoder API error:', response.status, response.statusText, errorText);
            return NextResponse.json({ 
                error: `Postcoder API error: ${response.status} ${response.statusText}` 
            }, { status: response.status });
        }

        const data = await response.json();

        // Transform the data to match the expected format from the reference
        const transformedData = data.map((item: PostcodeItem) => ({
            id: item.id,
            summaryline: item.summaryline,
            locationsummary: item.locationsummary,
            type: item.type,
            count: item.count,
            // Additional fields for address details
            addressline1: item.addressline1 || '',
            addressline2: item.addressline2 || '',
            posttown: item.posttown || '',
            county: item.county || '',
            postcode: item.postcode || '',
            // For autocomplete display
            label: item.summaryline || item.locationsummary,
            location: item.locationsummary || '',
            value: item.id,
        }));

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('Postcode autocomplete error:', error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
} 