
# ==========================================
# Smart Career Guidance - Backend Docker Run
# ==========================================

$ContainerName = "smart-career-backend"
$ImageName = "smart-career-backend:local"

# Database configuration
$DatabaseUrl = "jdbc:mysql://host.docker.internal:3306/career_guidance_db"
$DatabaseUsername = "root"

$SecurePassword = Read-Host "Enter MySQL password" -AsSecureString
$DatabasePassword = [System.Net.NetworkCredential]::new(
    "",
    $SecurePassword
).Password

# JWT configuration
$SecureJwtSecret = Read-Host "Enter Base64 JWT secret" -AsSecureString
$JwtSecret = [System.Net.NetworkCredential]::new(
    "",
    $SecureJwtSecret
).Password

if ([string]::IsNullOrWhiteSpace($JwtSecret)) {
    Write-Host "JWT secret is required." -ForegroundColor Red
    exit 1
}

# Remove existing container if present
$ExistingContainer = docker ps -aq -f "name=^${ContainerName}$"

if ($ExistingContainer) {
    Write-Host "Removing existing container..."
    docker rm -f $ContainerName
}

# Start backend container
Write-Host "Starting Smart Career Guidance Backend..."

docker run -d `
    --name $ContainerName `
    -p 8080:8080 `
    -e DB_URL="$DatabaseUrl" `
    -e DB_USERNAME="$DatabaseUsername" `
    -e DB_PASSWORD="$DatabasePassword" `
    -e JWT_SECRET="$JwtSecret" `
    $ImageName

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend container started successfully!" -ForegroundColor Green
    docker ps --filter "name=$ContainerName"
} else {
    Write-Host "Failed to start backend container." -ForegroundColor Red
}

# Clear sensitive variables
$DatabasePassword = $null
$SecurePassword = $null
$JwtSecret = $null
$SecureJwtSecret = $null
