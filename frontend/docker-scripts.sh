#!/bin/bash

# Docker scripts for Fitness Wala Frontend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Development commands
dev() {
    print_header "Starting Development Environment"
    docker-compose --profile dev up --build
}

dev_detached() {
    print_header "Starting Development Environment (Detached)"
    docker-compose --profile dev up --build -d
}

# Production commands
prod() {
    print_header "Building and Starting Production Environment"
    docker-compose --profile prod up --build
}

prod_detached() {
    print_header "Building and Starting Production Environment (Detached)"
    docker-compose --profile prod up --build -d
}

# Hot reload development
hot() {
    print_header "Starting Development with Hot Reload"
    docker-compose --profile hot up --build
}

# Cleanup commands
clean() {
    print_header "Cleaning up Docker resources"
    docker-compose down
    docker system prune -f
    print_status "Cleanup completed"
}

clean_all() {
    print_header "Cleaning up all Docker resources"
    docker-compose down --volumes --remove-orphans
    docker system prune -af
    print_status "Complete cleanup finished"
}

# Build commands
build_dev() {
    print_header "Building Development Image"
    docker build --target development -t fitness-wala-frontend:dev .
}

build_prod() {
    print_header "Building Production Image"
    docker build --target production -t fitness-wala-frontend:prod .
}

# Logs
logs() {
    docker-compose logs -f
}

logs_dev() {
    docker-compose --profile dev logs -f
}

logs_prod() {
    docker-compose --profile prod logs -f
}

# Shell access
shell() {
    print_header "Accessing Development Container Shell"
    docker-compose --profile dev exec frontend-dev sh
}

# Help
help() {
    print_header "Docker Scripts Help"
    echo "Available commands:"
    echo "  dev          - Start development environment"
    echo "  dev_detached - Start development environment in background"
    echo "  prod         - Start production environment"
    echo "  prod_detached- Start production environment in background"
    echo "  hot          - Start development with hot reload"
    echo "  clean        - Clean up Docker resources"
    echo "  clean_all    - Complete cleanup (removes volumes)"
    echo "  build_dev    - Build development image only"
    echo "  build_prod   - Build production image only"
    echo "  logs         - Show all logs"
    echo "  logs_dev     - Show development logs"
    echo "  logs_prod    - Show production logs"
    echo "  shell        - Access development container shell"
    echo "  help         - Show this help message"
}

# Main script logic
case "$1" in
    "dev")
        dev
        ;;
    "dev_detached")
        dev_detached
        ;;
    "prod")
        prod
        ;;
    "prod_detached")
        prod_detached
        ;;
    "hot")
        hot
        ;;
    "clean")
        clean
        ;;
    "clean_all")
        clean_all
        ;;
    "build_dev")
        build_dev
        ;;
    "build_prod")
        build_prod
        ;;
    "logs")
        logs
        ;;
    "logs_dev")
        logs_dev
        ;;
    "logs_prod")
        logs_prod
        ;;
    "shell")
        shell
        ;;
    "help"|"")
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use 'help' to see available commands"
        exit 1
        ;;
esac 