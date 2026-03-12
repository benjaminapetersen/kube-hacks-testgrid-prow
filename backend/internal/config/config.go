package config

import (
	"bufio"
	"flag"
	"os"
	"strings"
)

type Config struct {
	ListenAddr         string
	ProwUpstream       string
	TestGridUpstream   string
	CORSAllowedOrigins string
}

func Load() *Config {
	// Load .env files: .env first (defaults), then .env.local (overrides).
	// Values only apply if not already set in the real environment.
	loadEnvFile(".env")
	loadEnvFile(".env.local")

	cfg := &Config{}

	flag.StringVar(&cfg.ListenAddr, "listen-addr", envOrDefault("LISTEN_ADDR", ":8080"), "Address to listen on")
	flag.StringVar(&cfg.ProwUpstream, "prow-upstream", envOrDefault("PROW_UPSTREAM", "https://prow.k8s.io"), "Prow upstream URL")
	flag.StringVar(&cfg.TestGridUpstream, "testgrid-upstream", envOrDefault("TESTGRID_UPSTREAM", "https://testgrid.k8s.io"), "TestGrid upstream URL")
	flag.StringVar(&cfg.CORSAllowedOrigins, "cors-origins", envOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173"), "Comma-separated allowed CORS origins")
	flag.Parse()

	return cfg
}

func envOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// loadEnvFile reads a KEY=VALUE file and sets env vars that are not already set.
func loadEnvFile(path string) {
	f, err := os.Open(path)
	if err != nil {
		return // file not found is fine
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, val, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		val = strings.TrimSpace(val)
		// Only set if not already present in the real environment
		if _, exists := os.LookupEnv(key); !exists {
			os.Setenv(key, val)
		}
	}
}
