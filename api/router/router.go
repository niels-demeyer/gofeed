package router

import (
	"encoding/json"
	"net/http"
)

// SettingsHandler handles settings-related API routes
type SettingsHandler struct {
    // Add any dependencies here as needed (e.g., database client)
}

// NewSettingsHandler creates a new settings handler
func NewSettingsHandler() *SettingsHandler {
    return &SettingsHandler{}
}

// RegisterRoutes registers all routes handled by this handler
func (h *SettingsHandler) RegisterRoutes(mux *http.ServeMux) {
    // Register GET and PUT handlers for settings
    mux.HandleFunc("GET /api/settings", h.GetSettings)
    mux.HandleFunc("PUT /api/settings", h.UpdateSettings)
}

// GetSettings handles retrieving user settings
func (h *SettingsHandler) GetSettings(w http.ResponseWriter, r *http.Request) {
    // Sample settings data - in a real app, this would come from a database
    settings := map[string]interface{}{
        "theme":           "light",
        "articlesPerPage": 20,
        "refreshInterval": 15,
        "notifications":   true,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(settings)
}

// UpdateSettings handles updating user settings
func (h *SettingsHandler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
    var settings map[string]interface{}
    
    if err := json.NewDecoder(r.Body).Decode(&settings); err != nil {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Invalid request format",
        })
        return
    }
    
    // In a real app, save settings to database here
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "status": "Settings updated successfully",
    })
}