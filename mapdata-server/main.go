package main

import (
	"flag"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	addr = flag.String("listen-address", ":8080", "The address to listen on for HTTP requests.")
)

var (
	mapData = prometheus.NewGaugeVec(prometheus.GaugeOpts{
		Name: "china_map_data",
		Help: "china map data for different proviences",
	}, []string{"provience"})
)

func init() {
	prometheus.MustRegister(mapData)
}

func main() {
	flag.Parse()
	go func() {
		for {
			mapData.WithLabelValues("shandong").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("beijing").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("zhejiang").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("henan").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("guangzhou").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("sichuan").Set(rand.Float64() * 1000)
			time.Sleep(1000)
		}
	}()

	// Expose the registered metrics via HTTP.
	http.Handle("/metrics", promhttp.Handler())
	log.Fatal(http.ListenAndServe(*addr, nil))
}
