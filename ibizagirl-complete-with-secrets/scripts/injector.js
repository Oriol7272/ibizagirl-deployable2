import { glob } from 'glob'
import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'

const ROOT = process.cwd()
const HEAD_SNIPPET = fs.readFileSync(path.join('public','snippets','head.html'),'utf8')
const FOOTER_SNIPPET = fs.readFileSync(path.join('public','snippets','footer.html'),'utf8')
const ADS_BODY = fs.readFileSync(path.join('public','snippets','ads-body.html'),'utf8')

const files = await glob('**/*.html', { ignore: ['node_modules/**','public/legal/**','public/snippets/**'] })
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8')
  const $ = cheerio.load(html, { decodeEntities:false })
  // Inject head snippet
  if ($('head').length) {
    $('head').append('\n' + HEAD_SNIPPET + '\n')
  } else {
    // wrap minimal structure
    const wrapped = `<html><head>${HEAD_SNIPPET}</head><body>${html}</body></html>`
    fs.writeFileSync(file, wrapped, 'utf8')
    continue
  }
  // Inject footer snippet right before </body>
  if ($('body').length) {
    $('body').append('\n' + ADS_BODY + '\n' + FOOTER_SNIPPET + '\n')
  } else {
    $('html').append('<body>\n' + ADS_BODY + '\n' + FOOTER_SNIPPET + '\n</body>')
  }
  fs.writeFileSync(file, $.html(), 'utf8')
  console.log('Injected:', file)
}
console.log('\nDone. Review CSP in vercel.json if your ads/analytics domains differ.')
