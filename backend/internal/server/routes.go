package server

import (
	"encoding/json"
	"net/http"

	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/config"
	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/proxy"
)

func registerRoutes(mux *http.ServeMux, cfg *config.Config, p *proxy.Proxy) {
	// Health
	mux.HandleFunc("GET /healthz", handleHealthz)
	mux.HandleFunc("GET /readyz", handleReadyz)

	// Prow proxy: /api/prow/* → cfg.ProwUpstream/*
	mux.HandleFunc("/api/prow/", p.Forward(cfg.ProwUpstream, "/api/prow"))

	// TestGrid proxy: /api/testgrid/* → cfg.TestGridUpstream/*
	mux.HandleFunc("/api/testgrid/", p.Forward(cfg.TestGridUpstream, "/api/testgrid"))
}

func handleHealthz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func handleReadyz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
