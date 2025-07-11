import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const query = searchParams.get('query');
    const country = searchParams.get('country') || 'GB';
    const apiKey = process.env.POSTCODER_API_KEY;

    if (!id || !query) {
        return NextResponse.json({ error: "Parameters 'id' and 'query' are required" }, { status: 400 });
    }
    if (!apiKey) {
        return NextResponse.json({ error: "Postcoder API key not configured" }, { status: 500 });
    }

    try {
        const apiurl = `https://ws.postcoder.com/pcw/autocomplete/retrieve?apikey=${apiKey}&Country=${country}&query=${encodeURIComponent(query)}&id=${encodeURIComponent(id)}&lines=2&exclude=organisation&identifier=Autocomplete%20Address%20Finder`;
        const response = await fetch(apiurl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        
        // Handle rate limiting specifically
        if (response.status === 429) {
            return NextResponse.json({ 
                error: "Too many requests. Please wait a moment and try again." 
            }, { status: 429 });
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Postcoder retrieve error:', response.status, response.statusText, errorText);
            return NextResponse.json({ 
                error: `Postcoder API error: ${response.status} ${response.statusText}` 
            }, { status: response.status });
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Postcode retrieve error:', error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
} 