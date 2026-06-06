Add-Type -AssemblyName System.Drawing
$sizes = @(152, 167, 180, 192, 512, 1024)
$outDir = 'C:\Users\Ali\OneDrive\Desktop\shpion\icons'

foreach ($size in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::FromArgb(255, 0, 0, 0))

  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    [System.Drawing.Point]::new(0, 0),
    [System.Drawing.Point]::new($size, $size),
    [System.Drawing.Color]::FromArgb(255, 255, 55, 95),
    [System.Drawing.Color]::FromArgb(255, 191, 90, 242)
  )
  $margin = [int]($size * 0.18)
  $g.FillEllipse($brush, $margin, $margin, $size - 2 * $margin, $size - 2 * $margin)

  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([float]($size / 64))
  $cx = $size / 2
  $cy = $size / 2.2
  $r = $size / 5
  $g.DrawEllipse($pen, $cx - $r, $cy - $r * 1.2, $r * 2, $r * 2.4)
  $g.DrawEllipse($pen, $cx - $r * 0.35, $cy - $r * 0.5, $r * 0.7, $r * 0.7)
  $g.DrawLine($pen, $cx - $r * 0.8, $cy + $r * 0.9, $cx + $r * 0.8, $cy + $r * 0.9)

  $path = Join-Path $outDir "icon-$size.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "Created $path"
}
