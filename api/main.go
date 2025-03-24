package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/niels-demeyer/gofeed/api/router"
)

// Create a custom ResponseWriter to capture status codes
type loggingResponseWriter struct {
    http.ResponseWriter
    statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
    lrw.statusCode = code
    lrw.ResponseWriter.WriteHeader(code)
}

// CORS middleware using standard library
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Allowed origins
        allowedOrigins := []string{
            "http://localhost:3000",  // React default
            "http://localhost:5173",  // Vite default
            "http://localhost:4173",  // Vite preview
            "http://127.0.0.1:5173",  // Alternative localhost
            "http://localhost:8000",  // Another common dev port
        }

        // Get the origin from the request
        origin := r.Header.Get("Origin")
        
        // Check if the origin is allowed
        allowOrigin := false
        for _, allowed := range allowedOrigins {
            if origin == allowed {
                allowOrigin = true
                break
            }
        }

        // Set CORS headers
        if allowOrigin {
            w.Header().Set("Access-Control-Allow-Origin", origin)
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, X-CSRF-Token")
            w.Header().Set("Access-Control-Allow-Credentials", "true")
        }

        // Handle preflight requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        // Call the next handler
        next.ServeHTTP(w, r)
    })
}

func main() {
    // Configure logger
    // Comment out file logging setup
    /*
    logFile, err := os.OpenFile("api.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    if err != nil {
        log.Fatalf("Error opening log file: %v", err)
    }
    defer logFile.Close()
    */

    // Log only to console
    logger := log.New(os.Stdout, "", log.LstdFlags)
    // fileLogger := log.New(logFile, "", log.LstdFlags)

    // Create and configure router with all routes registered
    r := router.NewWithRoutes()

    // Create a custom logging middleware
    loggingMiddleware := func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            start := time.Now()
            
            // Log request
            requestLog := fmt.Sprintf("REQUEST: %s %s %s", r.RemoteAddr, r.Method, r.URL.Path)
            logger.Println(requestLog)
            // fileLogger.Println(requestLog)
            
            // Create a wrapper for the response writer to capture status code
            lrw := &loggingResponseWriter{
                ResponseWriter: w,
                statusCode:     http.StatusOK, // Default status code
            }
            
            // Call the actual handler
            next.ServeHTTP(lrw, r)
            
            // Log response
            duration := time.Since(start)
            responseLog := fmt.Sprintf("RESPONSE: %s %s %s - status: %d - duration: %v", 
                r.RemoteAddr, r.Method, r.URL.Path, lrw.statusCode, duration)
            logger.Println(responseLog)
            // fileLogger.Println(responseLog)
        })
    }
    
    // Apply middleware to the router - chain the CORS and logging middleware
    handler := corsMiddleware(loggingMiddleware(r.Handler()))
    
    // Start HTTP server
    logger.Println("Starting server on :8080")
    // fileLogger.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", handler))
}