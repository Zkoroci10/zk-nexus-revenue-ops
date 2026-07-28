$text = Get-Content '05_Systems\Scripts\ClientPortal.html' -Raw
$openDiv = ([regex]::Matches($text, '(?i)<div\b[^>]*>')).Count
$closeDiv = ([regex]::Matches($text, '(?i)</div>')).Count
Write-Output "div: $openDiv open vs $closeDiv close"

$openSpan = ([regex]::Matches($text, '(?i)<span\b[^>]*>')).Count
$closeSpan = ([regex]::Matches($text, '(?i)</span>')).Count
Write-Output "span: $openSpan open vs $closeSpan close"

$openA = ([regex]::Matches($text, '(?i)<a\b[^>]*>')).Count
$closeA = ([regex]::Matches($text, '(?i)</a>')).Count
Write-Output "a: $openA open vs $closeA close"

$openScript = ([regex]::Matches($text, '(?i)<script\b[^>]*>')).Count
$closeScript = ([regex]::Matches($text, '(?i)</script>')).Count
Write-Output "script: $openScript open vs $closeScript close"

$openStyle = ([regex]::Matches($text, '(?i)<style\b[^>]*>')).Count
$closeStyle = ([regex]::Matches($text, '(?i)</style>')).Count
Write-Output "style: $openStyle open vs $closeStyle close"
