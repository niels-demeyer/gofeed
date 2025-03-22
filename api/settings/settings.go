package settings

import (
	"encoding/json"
	"net/http"
	"sync"
)

// Settings represents the application settings
type Settings struct {
    Theme         string `json:"theme"`
}

// SettingsHandler manages the settings endpoints
type SettingsHandler struct {
    settings Settings
    mutex    sync.RWMutex
}

// NewSettingsHandler creates a new settings handler with default values
func NewSettingsHandler() *SettingsHandler {
    return &SettingsHandler{
        settings: Settings{
            Theme:         "dark",
        },
    }
}

// GetSettings returns the current settings
func (h *SettingsHandler) GetSettings(w http.ResponseWriter, r *http.Request) {
    h.mutex.RLock()
    defer h.mutex.RUnlock()

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(h.settings)
}

// UpdateSettings updates the application settings
func (h *SettingsHandler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
    var updatedSettings Settings

    err := json.NewDecoder(r.Body).Decode(&updatedSettings)
    if err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    h.mutex.Lock()
    h.settings = updatedSettings
    h.mutex.Unlock()

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(h.settings)
}

// RegisterRoutes registers the settings routes to the given router
func (h *SettingsHandler) RegisterRoutes(mux *http.ServeMux) {
    mux.HandleFunc("GET /api/settings", h.GetSettings)
    mux.HandleFunc("PUT /api/settings", h.UpdateSettings)
}