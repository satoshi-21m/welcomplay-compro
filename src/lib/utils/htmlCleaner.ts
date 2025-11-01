/**
 * Utility functions untuk membersihkan HTML content
 * 
 * Test cases:
 * - cleanHtmlContent('<p>tes</p>') -> 'tes'
 * - cleanHtmlContent('<p>Hello World</p>') -> 'Hello World'
 * - cleanHtmlContent('<p><strong>Bold</strong></p>') -> '<p><strong>Bold</strong></p>'
 * - cleanHtmlContent('<p></p>') -> ''
 * - cleanHtmlContent('<p>   </p>') -> ''
 * - cleanHtmlContent('') -> ''
 */

/**
 * Mengekstrak teks murni dari HTML content
 * @param htmlContent - HTML content yang akan diekstrak
 * @returns Teks murni tanpa HTML tags
 */
export function extractPlainText(htmlContent: string): string {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return ''
  }

  // Hapus semua HTML tags
  let plainText = htmlContent.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities
  plainText = plainText
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
  
  // Hapus whitespace berlebih dan trim
  plainText = plainText.replace(/\s+/g, ' ').trim()
  
  return plainText
}

/**
 * Membersihkan HTML content dari tag yang tidak perlu
 * @param htmlContent - HTML content yang akan dibersihkan
 * @returns HTML content yang sudah dibersihkan
 */
export function cleanHtmlContent(htmlContent: string): string {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return ''
  }

  let cleaned = htmlContent.trim()

  // Jika content kosong, return string kosong
  if (cleaned === '') {
    return ''
  }

  // Jika content hanya berisi tag <p> dengan teks sederhana, ekstrak teksnya saja
  // Contoh: <p>tes</p> -> tes
  // Contoh: <p>Hello World</p> -> Hello World
  if (cleaned.match(/^<p>([^<]*?)<\/p>$/s)) {
    const innerText = cleaned.replace(/^<p>/, '').replace(/<\/p>$/, '').trim()
    // Jika teks di dalam p tidak mengandung HTML tags lain dan tidak kosong, return teks saja
    if (!/<[^>]*>/.test(innerText) && innerText.length > 0) {
      return innerText
    }
  }

  // Jika content hanya berisi tag <p> dengan whitespace, ekstrak teksnya
  // Contoh: <p>   tes   </p> -> tes
  if (cleaned.match(/^<p>\s*([^<]*?)\s*<\/p>$/s)) {
    const innerText = cleaned.replace(/^<p>/, '').replace(/<\/p>$/, '').trim()
    // Jika teks di dalam p tidak mengandung HTML tags lain dan tidak kosong, return teks saja
    if (!/<[^>]*>/.test(innerText) && innerText.length > 0) {
      return innerText
    }
  }

  // Hapus tag kosong yang tidak perlu
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '')
  cleaned = cleaned.replace(/<div>\s*<\/div>/g, '')
  cleaned = cleaned.replace(/<span>\s*<\/span>/g, '')
  
  // Hapus whitespace berlebih
  cleaned = cleaned.trim()
  
  // Jika setelah dibersihkan kosong, return string kosong
  if (cleaned === '') {
    return ''
  }

  return cleaned
}

/**
 * Mengecek apakah HTML content hanya berisi tag kosong
 * @param htmlContent - HTML content yang akan dicek
 * @returns true jika content kosong atau hanya tag kosong
 */
export function isEmptyHtmlContent(htmlContent: string): boolean {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return true
  }

  const cleaned = cleanHtmlContent(htmlContent)
  return cleaned === '' || cleaned === '<p></p>' || cleaned === '<div></div>'
}

/**
 * Membersihkan dan memformat HTML content untuk display
 * @param htmlContent - HTML content yang akan diformat
 * @returns HTML content yang sudah diformat
 */
export function formatHtmlContent(htmlContent: string): string {
  const cleaned = cleanHtmlContent(htmlContent)
  
  if (!cleaned) {
    return ''
  }

  // Jika content tidak dimulai dengan tag, wrap dengan <p>
  if (!cleaned.startsWith('<')) {
    return `<p>${cleaned}</p>`
  }

  return cleaned
}
