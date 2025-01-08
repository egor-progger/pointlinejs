export const DialogTemplate = `<div class="mdc-dialog">
        <div class="mdc-dialog__container">
          <div
            class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content"
            tabindex="-1"
          >
            <h2 class="mdc-dialog__title" id="dialog-title">[title]</h2>
            <div class="mdc-dialog__content" id="dialog-content">
              [content]
            </div>
            <div class="mdc-dialog__actions">
              <button
                type="button"
                class="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="accept"
              >
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Ok</span>
              </button>
              <button
                type="button"
                class="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="cancel"
              >
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancel</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>`;