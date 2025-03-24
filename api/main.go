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
    
    // Apply middleware to the router
    handler := loggingMiddleware(r.Handler())
    
    // Start HTTP server
    logger.Println("Starting server on :8080")
    // fileLogger.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", handler))
}