package server_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"log/slog"
	"os"

	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/config"
	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/server"
)

func TestHealthz(t *testing.T) {
	cfg := &config.Config{
		ListenAddr:         ":0",
		ProwUpstream:       "https://prow.k8s.io",
		TestGridUpstream:   "https://testgrid.k8s.io",
		CORSAllowedOrigins: "http://localhost:5173",
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))
	srv := server.New(cfg, logger)

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()

	srv.Handler().ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var body map[string]string
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if body["status"] != "ok" {
		t.Fatalf("expected status ok, got %q", body["status"])
	}
}

func TestReadyz(t *testing.T) {
	cfg := &config.Config{
		ListenAddr:         ":0",
		ProwUpstream:       "https://prow.k8s.io",
		TestGridUpstream:   "https://testgrid.k8s.io",
		CORSAllowedOrigins: "http://localhost:5173",
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))
	srv := server.New(cfg, logger)

	req := httptest.NewRequest(http.MethodGet, "/readyz", nil)
	w := httptest.NewRecorder()

	srv.Handler().ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestCORSHeaders(t *testing.T) {
	cfg := &config.Config{
		ListenAddr:         ":0",
		ProwUpstream:       "https://prow.k8s.io",
		TestGridUpstream:   "https://testgrid.k8s.io",
		CORSAllowedOrigins: "http://localhost:5173",
	}
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))
	srv := server.New(cfg, logger)

	req := httptest.NewRequest(http.MethodOptions, "/healthz", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	w := httptest.NewRecorder()

	srv.Handler().ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Fatalf("expected status 204 for preflight, got %d", w.Code)
	}

	origin := w.Header().Get("Access-Control-Allow-Origin")
	if origin != "http://localhost:5173" {
		t.Fatalf("expected CORS origin http://localhost:5173, got %q", origin)
	}
}
