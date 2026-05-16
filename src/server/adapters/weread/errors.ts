export class WeReadApiError extends Error {
  readonly errcode: number;
  readonly upgradeInfo?: { message?: string };

  constructor(payload: { errcode?: number; errmsg?: string; upgrade_info?: { message?: string } }) {
    const code = payload.errcode ?? -1;
    const message =
      payload.upgrade_info?.message ??
      payload.errmsg ??
      `WeRead API returned error code ${code}`;
    super(message);
    this.name = "WeReadApiError";
    this.errcode = code;
    this.upgradeInfo = payload.upgrade_info;
  }
}
