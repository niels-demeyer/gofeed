package main

import (
	"log"
	"net/http"

	"github.com/niels-demeyer/gofeed/api/router"
)

func main() {
    // Create and configure router with all routes registered
    r := router.NewWithRoutes()
    
    // Start HTTP server
    log.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", r.Handler()))
}