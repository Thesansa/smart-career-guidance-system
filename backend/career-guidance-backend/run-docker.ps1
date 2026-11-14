# ==========================================
# Smart Career Guidance - Backend Docker Run
# ==========================================

$ContainerName = "smart-career-backend"
$ImageName = "smart-career-backend:local"

# Database configuration
$DatabaseUrl = "jdbc:mysql://host.docker.internal:3306/career_guidance_db"
$DatabaseUsername =

# Prompt for password without displaying it
$SecurePassword = Read-Host "Enter MySQL password" -AsSecureString
$DatabasePassword = [System.Net.NetworkCredential]::new("", $SecurePassword).Password

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
    $ImageName

# Check result
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend container started successfully!" -ForegroundColor Green
    docker ps --filter "name=$ContainerName"
} else {
    Write-Host "Failed to start backend container." -ForegroundColor Red
}

# Clear password variable
$DatabasePassword = $null
$SecurePassword = $null