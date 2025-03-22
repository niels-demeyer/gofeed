package main

import (
	"log"
	"os"
	"strconv"

	"github.com/niels-demeyer/gofeed/api/server"
)

func main() {
    // Default port
    port := 8080
    
    // Check if port is provided via environment variable
    if envPort := os.Getenv("PORT"); envPort != "" {
        if p, err := strconv.Atoi(envPort); err == nil {
            port = p
        }
    }

    // Create and configure the server
    server := server.NewServer(port)
    server.RegisterRoutes()
    
    // Start the server
    if err := server.Start(); err != nil {
        log.Fatalf("Server failed to start: %v", err)
    }
}