exports.DOMContentLoadedPromise = new Promise((resolve, reject) => {
  document.addEventListener(
    "DOMContentLoaded",
    (event) => {
      resolve();
    },
    false
  );
});
