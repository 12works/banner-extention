(async function () {
  const res = await fetch(chrome.runtime.getURL("rules.json"));
  const rules = await res.json();
  const rule = rules.find((r) => location.hostname.includes(r.keyword));
  if (!rule) return;

  const init = () => {
    if (document.getElementById("banner")) return;

    const banner = document.createElement("div");
    banner.id = "banner";
    banner.textContent = rule.text;

    Object.assign(banner.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      padding: "6px 0",
      textAlign: "center",
      fontWeight: "bold",
      zIndex: "999999",
      color: "white",
      ...(rule.style || {}),
    });

    document.body.appendChild(banner);

    const pushDown = () => {
      const h = banner.getBoundingClientRect().height || 32;
      document.body.style.marginTop = h + "px";
    };

    pushDown();
    window.addEventListener("resize", pushDown);
  };

  // bodyが無い場合に備える
  if (document.body) {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }
})();
