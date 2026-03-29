// 即時実行関数（グローバル汚染を防ぐ）
(async function () {
  // 拡張機能内の rules.json を読み込む
  const res = await fetch(chrome.runtime.getURL("rules.json"));
  const rules = await res.json();

  // 現在のホスト名に一致するルールを探す
  // 例: "stg.example.com" に対して "example.com" がマッチする
  const rule = rules.find((r) => location.hostname.includes(r.keyword));

  // 対象外のURLなら何もしない
  if (!rule) return;

  // バナー生成＆配置処理
  const init = () => {
    // すでにバナーがある場合は二重生成を防ぐ
    if (document.getElementById("banner")) return;

    // バナー要素を作成
    const banner = document.createElement("div");
    banner.id = "banner";
    banner.textContent = rule.text; // 表示テキスト

    // スタイルを適用（rules.jsonのstyleで上書き可能）
    Object.assign(banner.style, {
      position: "fixed", // 画面上部に固定
      top: "0",
      left: "0",
      width: "100%",
      padding: "6px 0",
      textAlign: "center",
      fontWeight: "bold",
      zIndex: "999999", // 最前面に表示
      color: "white",
      ...(rule.style || {}),
    });

    // bodyに追加（画面に表示）
    document.body.appendChild(banner);

    // バナーの高さ分だけページ全体を下にずらす処理
    const pushDown = () => {
      // バナーの実際の高さを取得（取得できない場合は32px）
      const h = banner.getBoundingClientRect().height || 32;

      // bodyの上マージンを増やしてコンテンツと被らないようにする
      document.body.style.marginTop = h + "px";
    };

    // 初回実行（表示直後）
    pushDown();

    // 画面リサイズ時にも再計算（レスポンシブ対応）
    window.addEventListener("resize", pushDown);
  };

  // bodyがまだ存在しない場合に備える
  if (document.body) {
    // すでに読み込み済みなら即実行
    init();
  } else {
    // まだならDOM構築後に実行
    window.addEventListener("DOMContentLoaded", init);
  }
})();
