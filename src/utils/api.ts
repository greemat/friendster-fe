// src/api.ts or wherever you keep API functions
export async function fetchApiKey(): Promise<string> {
  const res = await fetch('http://192.168.1.66:3000/api/getApiKey');
  if (!res.ok) {
    throw new Error('Failed to fetch API key');
  }

  const data = await res.json();
  return data.apiKey; // assuming your backend returns { apiKey: "..." }
}
