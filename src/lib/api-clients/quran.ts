export type QuranSearchMatch = {
  number: number; // global ayah number
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
  };
  numberInSurah: number;
};

export type QuranSearchResult = {
  count: number;
  matches: QuranSearchMatch[];
};

export async function searchQuran(
  keyword: string,
  edition: string,
  signal?: AbortSignal,
): Promise<QuranSearchResult> {
  const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(keyword)}/all/${edition}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Search failed: ${response.status}`);
  const data = (await response.json()) as { code: number; data: QuranSearchResult };
  return data.data;
}
