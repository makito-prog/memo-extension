export type PageMemo = {
  url: string;
  title?: string;
  memo: string;
  updatedAt: number;
};

const keyFromUrl = (url: string) => `memo:${url}`;

export const loadMemoByUrl = async (url: string): Promise<PageMemo | null> => {
  const key = keyFromUrl(url);
  const res = await chrome.storage.local.get(key);
  return (res[key] as PageMemo) ?? null;
};

export const saveMemoByUrl = async (data: PageMemo): Promise<void> => {
  const key = keyFromUrl(data.url);
  await chrome.storage.local.set({ [key]: data });
};

export const deleteMemoByUrl = async (url: string): Promise<void> => {
  const key = keyFromUrl(url);
  await chrome.storage.local.remove(key);
};