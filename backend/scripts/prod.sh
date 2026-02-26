echo "Starting jade-intimo backend in Production Mode"

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create .env with your production environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running!"
    exit 1
fi


echo "Building and starting production container..."
echo ""

# Start production environment
echo "Building and starting production container..."
docker compose -f docker-compose.prod.yml up --build -d

# IMPORTANT: Wait a few seconds for the DB to initialize if it's in Docker
echo "Waiting for database connectivity..."
sleep 5

echo "Applying latest schema with Drizzle..."
# This runs on your host, using drizzle.config.js
npm run db:migrate

echo ""
echo "Production environment started!"
echo "Application: http://localhost:3000"
echo "Logs: docker logs jade-intimo-app-prod"
