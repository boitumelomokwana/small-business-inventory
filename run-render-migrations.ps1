$ErrorActionPreference = 'Stop'

$backendPath = Join-Path $PSScriptRoot 'backend'
if (-not (Test-Path (Join-Path $backendPath 'package.json'))) {
  throw "Backend package.json was not found at $backendPath"
}

$secureUrl = Read-Host 'Paste the ROTATED Render PostgreSQL External Database URL' -AsSecureString
$pointer = [IntPtr]::Zero
$databaseUrl = $null
$secretBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

try {
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureUrl)
  $databaseUrl = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)

  if ($databaseUrl -notmatch '^postgres(?:ql)?://') {
    throw 'The supplied value does not look like a PostgreSQL connection URL.'
  }

  $rng.GetBytes($secretBytes)
  $ephemeralJwtSecret = [BitConverter]::ToString($secretBytes).Replace('-', '').ToLowerInvariant()

  $env:DATABASE_URL = $databaseUrl
  $env:JWT_SECRET = $ephemeralJwtSecret
  $env:FRONTEND_URL = 'https://small-business-inventory-three.vercel.app'
  $env:NODE_ENV = 'production'

  Push-Location $backendPath
  try {
    Write-Host 'Installing the backend dependencies required for the migration...'
    & npm.cmd ci --include=dev
    if ($LASTEXITCODE -ne 0) {
      throw "Dependency installation failed with exit code $LASTEXITCODE"
    }

    Write-Host 'Running the database migrations...'
    $migrationOutput = & npm.cmd run db:migrate 2>&1
    $migrationExitCode = $LASTEXITCODE
    foreach ($line in $migrationOutput) {
      $text = [string]$line
      $text = $text.Replace($databaseUrl, '[DATABASE_URL REDACTED]')
      $databaseUri = [Uri]$databaseUrl
      if ($databaseUri.UserInfo) {
        $text = $text.Replace($databaseUri.UserInfo, '[DB_CREDENTIALS REDACTED]')
        $decodedUserInfo = [Uri]::UnescapeDataString($databaseUri.UserInfo)
        $text = $text.Replace($decodedUserInfo, '[DB_CREDENTIALS REDACTED]')
      }
      Write-Host $text
    }
    if ($migrationExitCode -ne 0) {
      throw "Database migration failed with exit code $migrationExitCode; see the error output above."
    }

    Write-Host 'Database migrations completed successfully.'
  }
  finally {
    Pop-Location
  }
}
finally {
  if ($pointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }
  $rng.Dispose()
  [Array]::Clear($secretBytes, 0, $secretBytes.Length)
  Remove-Item Env:DATABASE_URL, Env:JWT_SECRET, Env:FRONTEND_URL, Env:NODE_ENV -ErrorAction SilentlyContinue
  $databaseUrl = $null
  $ephemeralJwtSecret = $null
  $secureUrl.Dispose()
}
