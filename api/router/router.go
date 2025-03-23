package router

import (
	"net/http"

	"github.com/niels-demeyer/gofeed/api/settings"
)

// Router represents the application HTTP router
type Router struct {
    mux *http.ServeMux
}

// New creates a new router instance
func New() *Router {
    return &Router{
        mux: http.NewServeMux(),
    }
}

// NewWithRoutes creates a new router instance with all routes registered
func NewWithRoutes() *Router {
    r := New()
    
    // Create all handlers
    settingsHandler := settings.NewSettingsHandler()
    
    // Register all routes
    r.RegisterRoutes(settingsHandler)
    
    return r
}

// Handler returns the underlying http handler
func (r *Router) Handler() http.Handler {
    return r.mux
}

// SettingsHandler interface defines the methods needed for settings routes
type SettingsHandler interface {
    GetSettings(w http.ResponseWriter, r *http.Request)
    UpdateSettings(w http.ResponseWriter, r *http.Request)
}

// RegisterSettingsRoutes registers all settings related routes
func (r *Router) RegisterSettingsRoutes(sh SettingsHandler) {
    r.mux.HandleFunc("/api/settings", func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            sh.GetSettings(w, r)
        case http.MethodPut:
            sh.UpdateSettings(w, r)
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    })
}

// RegisterRoutes registers all application routes
func (r *Router) RegisterRoutes(settingsHandler SettingsHandler) {
    // Register settings routes
    r.RegisterSettingsRoutes(settingsHandler)
}