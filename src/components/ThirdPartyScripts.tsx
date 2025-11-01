'use client'

import Script from 'next/script'

interface ThirdPartyScriptsProps {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  customHeadScripts?: string
}

// Helper function to extract script content from HTML
function extractScriptContent(html: string): Array<{ content: string; attrs?: Record<string, string>; type?: 'inline' | 'external' }> {
  const scripts: Array<{ content: string; attrs?: Record<string, string>; type?: 'inline' | 'external' }> = []
  
  if (!html || !html.trim()) {
    return scripts
  }
  
  // Regex to find script tags (both self-closing and with content)
  const scriptRegex = /<script([^>]*)(?:\/>|>([\s\S]*?)<\/script>)/gi
  
  let match
  let foundScripts = false
  
  while ((match = scriptRegex.exec(html)) !== null) {
    foundScripts = true
    const attrsString = match[1] || ''
    const content = match[2] || ''
    
    // Parse attributes
    const attrObj: Record<string, string> = {}
    const srcMatch = attrsString.match(/src=["']([^"']+)["']/i)
    const asyncMatch = attrsString.match(/async/i)
    const deferMatch = attrsString.match(/defer/i)
    const typeMatch = attrsString.match(/type=["']([^"']+)["']/i)
    
    if (srcMatch) {
      attrObj.src = srcMatch[1]
    }
    if (asyncMatch) {
      attrObj.async = 'true'
    }
    if (deferMatch) {
      attrObj.defer = 'true'
    }
    if (typeMatch) {
      attrObj.type = typeMatch[1]
    }
    
    // Determine if external or inline
    const scriptType = attrObj.src ? 'external' : 'inline'
    
    scripts.push({ 
      content: content.trim(), 
      attrs: attrObj,
      type: scriptType
    })
  }
  
  // If no script tags found, treat entire content as pure JavaScript
  if (!foundScripts && html.trim()) {
    // Remove any HTML tags and keep only the JavaScript
    const cleanContent = html
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .trim()
    
    if (cleanContent) {
      scripts.push({ 
        content: cleanContent,
        type: 'inline'
      })
    }
  }
  
  return scripts
}

// Component to safely inject custom head scripts
function CustomHeadScriptsInjector({ scripts }: { scripts: string }) {
  const extractedScripts = extractScriptContent(scripts)
  
  if (extractedScripts.length === 0) return null
  
  return (
    <>
      {extractedScripts.map((script, index) => {
        // External script with src
        if (script.type === 'external' && script.attrs?.src) {
          return (
            <Script
              key={`custom-head-${index}`}
              id={`custom-head-${index}`}
              src={script.attrs.src}
              strategy="afterInteractive"
              {...(script.attrs.async === 'true' && { async: true })}
              {...(script.attrs.defer === 'true' && { defer: true })}
            />
          )
        }
        
        // Inline script - must be pure JavaScript (no HTML tags)
        if (script.type === 'inline' && script.content) {
          // Double check: remove any remaining HTML tags
          const pureJS = script.content.replace(/<[^>]*>/g, '').trim()
          
          if (!pureJS) return null
          
          return (
            <Script
              key={`custom-head-${index}`}
              id={`custom-head-${index}`}
              strategy="afterInteractive"
            >
              {pureJS}
            </Script>
          )
        }
        
        return null
      })}
    </>
  )
}

export function ThirdPartyScripts({
  googleAnalyticsId,
  googleTagManagerId,
  facebookPixelId,
  customHeadScripts
}: ThirdPartyScriptsProps) {
  return (
    <>
      {/* Google Analytics GA4 */}
      {googleAnalyticsId && googleAnalyticsId.startsWith('G-') && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Google Analytics Universal Analytics */}
      {googleAnalyticsId && googleAnalyticsId.startsWith('UA-') && (
        <>
          <Script
            src={`https://www.google-analytics.com/analytics.js`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-ua" strategy="afterInteractive">
            {`
              window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
              ga('create', '${googleAnalyticsId}', 'auto');
              ga('send', 'pageview');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {googleTagManagerId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
        </Script>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Custom Head Scripts - safely parse and inject */}
      {customHeadScripts && <CustomHeadScriptsInjector scripts={customHeadScripts} />}
    </>
  )
}

// Custom Body Scripts component (separate from head scripts)
export function CustomBodyScripts({ customBodyScripts }: { customBodyScripts?: string }) {
  if (!customBodyScripts) return null
  
  const extractedScripts = extractScriptContent(customBodyScripts)
  
  if (extractedScripts.length === 0) return null
  
  return (
    <>
      {extractedScripts.map((script, index) => {
        // External script with src
        if (script.type === 'external' && script.attrs?.src) {
          return (
            <Script
              key={`custom-body-${index}`}
              id={`custom-body-${index}`}
              src={script.attrs.src}
              strategy="lazyOnload"
              {...(script.attrs.async === 'true' && { async: true })}
              {...(script.attrs.defer === 'true' && { defer: true })}
            />
          )
        }
        
        // Inline script - must be pure JavaScript (no HTML tags)
        if (script.type === 'inline' && script.content) {
          // Double check: remove any remaining HTML tags
          const pureJS = script.content.replace(/<[^>]*>/g, '').trim()
          
          if (!pureJS) return null
          
          return (
            <Script
              key={`custom-body-${index}`}
              id={`custom-body-${index}`}
              strategy="lazyOnload"
            >
              {pureJS}
            </Script>
          )
        }
        
        return null
      })}
    </>
  )
}

// GTM noscript component for body
export function GTMNoScript({ googleTagManagerId }: { googleTagManagerId?: string }) {
  if (!googleTagManagerId) return null
  
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

