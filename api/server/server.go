package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/niels-demeyer/gofeed/api/settings"
)

// Server represents the API server
type Server struct {
    port   int
    mux    *http.ServeMux
    server *http.Server
}

// NewServer creates a new API server
func NewServer(port int) *Server {
    mux := http.NewServeMux()
    
    return &Server{
        port: port,
        mux:  mux,
        server: &http.Server{
            Addr:    fmt.Sprintf(":%d", port),
            Handler: mux,
        },
    }
}

// RegisterRoutes sets up all API routes
func (s *Server) RegisterRoutes() {
    // Setup settings routes
    settingsHandler := settings.NewSettingsHandler()
    settingsHandler.RegisterRoutes(s.mux)
    
    // Add more route handlers here
}

// Start begins listening for requests
func (s *Server) Start() error {
    log.Printf("Server starting on port %d...", s.port)
    return s.server.ListenAndServe()
}