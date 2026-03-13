import { useEffect, useMemo, useState } from "react";
import { deleteMemoByUrl, loadMemoByUrl, saveMemoByUrl } from "../shared/storage";

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
};

export const Popup = () => {
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const canSave = useMemo(() => url.length > 0, [url]);

  useEffect(() => {
    const init = async () => {
      const tab = await getActiveTab();
      const tabUrl = tab?.url ?? "";
      const tabTitle = tab?.title ?? "";

      setUrl(tabUrl);
      setTitle(tabTitle);

      if (!tabUrl) return;
      const saved = await loadMemoByUrl(tabUrl);
      if (saved) setMemo(saved.memo);
    };

    init().catch((e) => setStatus(String(e)));
  }, []);

  const handleSave = async () => {
    if (!url) return;
    await saveMemoByUrl({ url, title, memo, updatedAt: Date.now() });
    setStatus("保存しました");
    setTimeout(() => setStatus(""), 1200);
  };

  const handleDelete = async () => {
    if (!url) return;
    await deleteMemoByUrl(url);
    setMemo("");
    setStatus("削除しました");
    setTimeout(() => setStatus(""), 1200);
  };

  return (
    <div style={{ width: 360, padding: 12, fontFamily: "system-ui" }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Page Memo</div>

      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>
        {title || "（タイトル取得中）"}
      </div>

      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8, wordBreak: "break-all" }}>
        {url || "（URL取得中）"}
      </div>

      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="このページ用のメモを書く"
        style={{
          width: "100%",
          height: 140,
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 10,
          resize: "none",
          outline: "none",
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: canSave ? "#111" : "#999",
            color: "#fff",
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          保存
        </button>

        <button
          onClick={handleDelete}
          disabled={!canSave}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          削除
        </button>
      </div>

      {status && <div style={{ marginTop: 8, fontSize: 12 }}>{status}</div>}
    </div>
  );
};