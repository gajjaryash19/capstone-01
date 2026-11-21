/**
 * One-off screenshot optimization script for Valora Phase 2 (Images).
 * Reads the 4 uncompressed desktop screenshots and emits AVIF and WebP
 * at 960w (960x540) and 1440w (1440x810) with exact 16:9 framing.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const SCREENSHOTS_DIR = path.resolve(__dirname, '../frontend/public/screenshots')

const TARGETS = [
  'audit-overview-1440.png',
  'screenshot-segments-desktop.png',
  'screenshot-predictions-desktop.png',
  'screenshot-insights-desktop.png',
]

const CONFIGS = [
  { width: 960, height: 540, suffix: '-960w' },
  { width: 1440, height: 810, suffix: '-1440w' },
]

async function optimize() {
  console.log('Optimizing showcase screenshots in:', SCREENSHOTS_DIR)

  const summary = []

  for (const filename of TARGETS) {
    const inputPath = path.join(SCREENSHOTS_DIR, filename)
    if (!fs.existsSync(inputPath)) {
      console.error(`Missing input screenshot: ${inputPath}`)
      continue
    }

    const baseName = path.basename(filename, '.png')
    const originalStat = fs.statSync(inputPath)
    const itemSummary = {
      base: baseName,
      originalBytes: originalStat.size,
      variants: {},
    }

    for (const cfg of CONFIGS) {
      // 1. Generate AVIF
      const avifName = `${baseName}${cfg.suffix}.avif`
      const avifPath = path.join(SCREENSHOTS_DIR, avifName)
      await sharp(inputPath)
        .resize(cfg.width, cfg.height, { position: 'top' })
        .avif({ quality: 65, effort: 5 })
        .toFile(avifPath)
      const avifStat = fs.statSync(avifPath)
      itemSummary.variants[`avif_${cfg.width}`] = avifStat.size

      // 2. Generate WebP
      const webpName = `${baseName}${cfg.suffix}.webp`
      const webpPath = path.join(SCREENSHOTS_DIR, webpName)
      await sharp(inputPath)
        .resize(cfg.width, cfg.height, { position: 'top' })
        .webp({ quality: 80, effort: 5 })
        .toFile(webpPath)
      const webpStat = fs.statSync(webpPath)
      itemSummary.variants[`webp_${cfg.width}`] = webpStat.size
    }

    summary.push(itemSummary)
  }

  console.log('\n=== Showcase Image Optimization Summary ===')
  for (const item of summary) {
    console.log(`\nImage: ${item.base}`)
    console.log(`  Original PNG: ${(item.originalBytes / 1024).toFixed(1)} kB (${item.originalBytes} B)`)
    console.log(`  AVIF 960w:   ${(item.variants.avif_960 / 1024).toFixed(1)} kB (${item.variants.avif_960} B)`)
    console.log(`  AVIF 1440w:  ${(item.variants.avif_1440 / 1024).toFixed(1)} kB (${item.variants.avif_1440} B)`)
    console.log(`  WebP 960w:   ${(item.variants.webp_960 / 1024).toFixed(1)} kB (${item.variants.webp_960} B)`)
    console.log(`  WebP 1440w:  ${(item.variants.webp_1440 / 1024).toFixed(1)} kB (${item.variants.webp_1440} B)`)
  }

  const totalOriginal = summary.reduce((acc, s) => acc + s.originalBytes, 0)
  const totalAvif1440 = summary.reduce((acc, s) => acc + s.variants.avif_1440, 0)
  const totalAvif960 = summary.reduce((acc, s) => acc + s.variants.avif_960, 0)
  const totalWebp1440 = summary.reduce((acc, s) => acc + s.variants.webp_1440, 0)
  const totalWebp960 = summary.reduce((acc, s) => acc + s.variants.webp_960, 0)

  console.log('\n=== Aggregate Totals Across All 4 Showcase Views ===')
  console.log(`Original PNGs:    ${(totalOriginal / 1024).toFixed(1)} kB (${totalOriginal} B)`)
  console.log(`AVIF 1440w Total: ${(totalAvif1440 / 1024).toFixed(1)} kB (${totalAvif1440} B)`)
  console.log(`AVIF 960w Total:  ${(totalAvif960 / 1024).toFixed(1)} kB (${totalAvif960} B)`)
  console.log(`WebP 1440w Total: ${(totalWebp1440 / 1024).toFixed(1)} kB (${totalWebp1440} B)`)
  console.log(`WebP 960w Total:  ${(totalWebp960 / 1024).toFixed(1)} kB (${totalWebp960} B)`)

  // Delete original PNGs now that modern formats are in place
  console.log('\nRemoving unreferenced original PNGs from public/screenshots...')
  for (const filename of TARGETS) {
    const p = path.join(SCREENSHOTS_DIR, filename)
    if (fs.existsSync(p)) {
      fs.unlinkSync(p)
      console.log(`  Deleted: ${filename}`)
    }
  }

  console.log('\nOptimization complete.')
}

optimize().catch((err) => {
  console.error('Optimization failed:', err)
  process.exit(1)
})
