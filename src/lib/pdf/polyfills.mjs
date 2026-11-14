/*
 * Fallbacks for the few newer browser features PDF.js's legacy build uses
 * without fallbacks of its own. Without them, older phones and in-app
 * browsers (a link opened inside Facebook, WhatsApp or Messenger) could not
 * open any PDF ("Promise.withResolvers is not a function") or failed on PDFs
 * that need a standard font or a CJK character map (Response.bytes()).
 *
 * One file, used twice: imported by src/lib/pdf/pdfjs.ts before PDF.js loads,
 * and put at the top of the PDF.js worker by scripts/copy-pdfjs.mjs (the
 * worker is a separate thread, so it needs its own copy). Plain JavaScript,
 * no imports, safe to run more than once.
 */

const define = (target, name, value) => {
  if (target && typeof target[name] !== "function") {
    Object.defineProperty(target, name, { value, writable: true, configurable: true });
  }
};

// Chrome 119, Safari 17.4, Firefox 121.
define(Promise, "withResolvers", function withResolvers() {
  let resolve;
  let reject;
  const promise = new this((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
});

// Chrome 132, Safari 18. PDF.js reads fonts, character maps and decoders with it.
if (typeof Response !== "undefined") {
  define(Response.prototype, "bytes", async function bytes() {
    return new Uint8Array(await this.arrayBuffer());
  });
}
if (typeof Blob !== "undefined") {
  define(Blob.prototype, "bytes", async function bytes() {
    return new Uint8Array(await this.arrayBuffer());
  });
}

// Chrome 116, Safari 17.4.
if (typeof AbortSignal !== "undefined") {
  define(AbortSignal, "any", function any(signals) {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        break;
      }
      signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
    }
    return controller.signal;
  });
}
