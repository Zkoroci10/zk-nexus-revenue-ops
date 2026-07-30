const modules = ['puppeteer', 'canvas', 'sharp', 'jsdom', 'html-to-image', 'express'];
for (const m of modules) {
  try {
    require(m);
    console.log(m + ': AVAILABLE');
  } catch (e) {
    console.log(m + ': NOT available (' + e.message + ')');
  }
}
