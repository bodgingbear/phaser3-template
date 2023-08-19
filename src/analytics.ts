const SITE_ID = "5";
if (SITE_ID != null && location.hostname.endsWith("bodgingbear.dev")) {
  const domainParts = location.hostname.split(".");
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (window as any)._paq = (window as any)._paq ?? [];
  const _paq = (window as any)._paq;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  if (domainParts.length > 2) {
    _paq.push(["setCustomUrl", "/" + domainParts[0]]);
  }

  _paq.push(["setCookieDomain", "*.bodgingbear.dev"]);
  _paq.push(["trackPageView"]);
  _paq.push(["enableLinkTracking"]);

  const analyticsDomain = "https://analytics.bodgingbear.dev/";
  _paq.push(["setTrackerUrl", analyticsDomain + "matomo.php"]);
  _paq.push(["setSiteId", SITE_ID]);

  const $script = document.createElement("script");
  $script.type = "text/javascript";
  $script.async = true;
  $script.src = analyticsDomain + "matomo.js";
  document.head.appendChild($script);
}
