package proxy

import (
	"io"
	"net/http"
	"strings"
	"time"
)

type Proxy struct {
	client *http.Client
}

func New() *Proxy {
	return &Proxy{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// Forward proxies a request to the given upstream base URL.
// It strips the local prefix from the request path and appends the remainder
// to the upstream URL.
//
// Example: request path "/api/prow/prowjobs.js" with prefix "/api/prow"
// and upstream "https://prow.k8s.io" becomes "https://prow.k8s.io/prowjobs.js".
func (p *Proxy) Forward(upstream, stripPrefix string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Build the upstream URL
		path := strings.TrimPrefix(r.URL.Path, stripPrefix)
		targetURL := upstream + path
		if r.URL.RawQuery != "" {
			targetURL += "?" + r.URL.RawQuery
		}

		req, err := http.NewRequestWithContext(r.Context(), r.Method, targetURL, nil)
		if err != nil {
			http.Error(w, "failed to create upstream request", http.StatusInternalServerError)
			return
		}

		// Copy safe headers from the original request
		for _, h := range []string{"Accept", "Accept-Encoding", "Accept-Language"} {
			if v := r.Header.Get(h); v != "" {
				req.Header.Set(h, v)
			}
		}

		resp, err := p.client.Do(req)
		if err != nil {
			http.Error(w, "upstream request failed", http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		// Copy response headers
		for k, vals := range resp.Header {
			for _, v := range vals {
				w.Header().Add(k, v)
			}
		}
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
	}
}
