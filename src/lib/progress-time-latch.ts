/** 遅延時間のデフォルト値 */
export const DELAY_MS_DEFAULT = 750;

/** 最低表示時間のデフォルト値 */
export const MIN_SHOW_TIME_DEFAULT = 500;

/**
 * A class which acts as a time latch for show progress bars UIs. It waits a minimum time to be
 * dismissed before showing. Once visible, the progress bar will be visible for
 * a minimum amount of time to avoid "flashes" in the UI when an event could take
 * a largely variable time to complete (from none, to a user perceivable amount).
 *
 * Works with an view through the lambda API.
 */
export class ProgressTimeLatch {
  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------
  private readonly viewRefreshingToggle: (showProgress: boolean) => void;
  private readonly delayMs: number;
  private readonly minShowTime: number;

  private showTime = 0;
  private loadingValue = false;

  private readonly delayedShow = () => this.show();
  private readonly delayedHide = () => this.hideAndReset();

  private delayedShowTimeoutId?: number;
  private delayedHideTimeoutId?: number;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  constructor(
    viewRefreshingToggle: (showProgress: boolean) => void,
    delayMs: number = DELAY_MS_DEFAULT,
    minShowTime: number = MIN_SHOW_TIME_DEFAULT
  ) {
    this.viewRefreshingToggle = viewRefreshingToggle;
    this.delayMs = delayMs;
    this.minShowTime = minShowTime;
  }

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------
  get loading(): boolean {
    return this.loadingValue;
  }

  set loading(value: boolean) {
    if (this.loadingValue === value) return;

    this.loadingValue = value;
    window.clearTimeout(this.delayedShowTimeoutId);
    window.clearTimeout(this.delayedHideTimeoutId);

    if (value) {
      this.delayedShowTimeoutId = window.setTimeout(
        this.delayedShow,
        this.delayMs
      );
    } else if (this.showTime >= 0) {
      // We're already showing, lets check if we need to delay the hide
      const showTime = Date.now() - this.showTime;
      if (showTime < this.minShowTime) {
        this.delayedHideTimeoutId = window.setTimeout(
          this.delayedHide,
          this.minShowTime - showTime
        );
      } else {
        // We've been showing longer than the min, so hide and clean up
        this.hideAndReset();
      }
    } else {
      // We're not currently show so just hide and clean up
      this.hideAndReset();
    }
  }

  private show() {
    this.viewRefreshingToggle(true);
    this.showTime = Date.now();
  }

  private hideAndReset() {
    this.viewRefreshingToggle(false);
    this.showTime = 0;
  }
}
