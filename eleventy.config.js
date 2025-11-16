const { DateTime } = require('luxon')
const fs = require('node:fs')
const path = require('node:path')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' })
  eleventyConfig.addPassthroughCopy({ public: '/' })
  eleventyConfig.addPassthroughCopy('CNAME')
  eleventyConfig.addPassthroughCopy('src/blog/posts/*.jpg')

  eleventyConfig.addWatchTarget('src/assets/css/styles.css')
  eleventyConfig.addWatchTarget('src/blog')

  eleventyConfig.addCollection('blog', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('src/blog/**/*.md')
      .sort((a, b) => b.date - a.date)
  })

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    if (!dateObj) return ''
    return DateTime.fromJSDate(dateObj).toFormat('LLL d, yyyy')
  })

  eleventyConfig.addFilter('assetExists', (filePath) => {
    if (!filePath) return false
    const normalized = filePath.startsWith('./') ? filePath.slice(2) : filePath
    const fullPath = path.join(process.cwd(), normalized)
    return fs.existsSync(fullPath)
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data',
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md'],
  }
}
