package server

import (
	"log/slog"
	"net/http"

	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/config"
	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/middleware"
	"benjaminapetersen.me/kube-hacks-testgrid-prow/internal/proxy"
)

type Server struct {
	handler http.Handler
	cfg     *config.Config
	logger  *slog.Logger
}

func New(cfg *config.Config, logger *slog.Logger) *Server {
	s := &Server{
		cfg:    cfg,
		logger: logger,
	}

	mux := http.NewServeMux()
	p := proxy.New()

	registerRoutes(mux, cfg, p)

	// Apply middleware: logging wraps CORS wraps the mux
	var handler http.Handler = mux
	handler = middleware.CORS(cfg.CORSAllowedOrigins)(handler)
	handler = middleware.Logging(logger)(handler)

	s.handler = handler
	return s
}

func (s *Server) Handler() http.Handler {
	return s.handler
}
