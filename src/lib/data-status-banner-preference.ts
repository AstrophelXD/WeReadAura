export const DATA_STATUS_BANNER_STORAGE_KEY = "wereadaura.showDataStatusBanner";
export const DATA_STATUS_BANNER_CHANGE_EVENT = "wereadaura:data-status-banner-change";

export function readDataStatusBannerVisible(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return localStorage.getItem(DATA_STATUS_BANNER_STORAGE_KEY) !== "false";
}

export function writeDataStatusBannerVisible(visible: boolean): void {
  localStorage.setItem(DATA_STATUS_BANNER_STORAGE_KEY, visible ? "true" : "false");
  window.dispatchEvent(
    new CustomEvent(DATA_STATUS_BANNER_CHANGE_EVENT, { detail: { visible } }),
  );
}
