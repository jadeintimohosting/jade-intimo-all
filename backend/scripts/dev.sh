echo "Starting Jade-intimo backend in Development Mode (Detached)"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "Error: .env.development file not found!"
    echo "Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running!"
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "Added .neon_local/ to .gitignore"
fi

echo "Building and starting development containers (detached)..."
echo ""

# Run migrations with Drizzle (runs locally, not in Docker)
echo "Applying latest schema with Drizzle..."
npm run db:migrate

# Start development environment in detached mode
docker compose -f docker-compose.dev.yml up --build -d

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
docker compose exec -T neon-local psql -U neon -d neondb -c 'SELECT 1' >/dev/null 2>&1

echo ""
echo "Development environment started in background!"
echo "Backend: http://localhost:3000"
echo "Database: postgres://neon:npg@localhost:5432/neondb"
