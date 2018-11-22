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
			mapData.WithLabelValues("山东").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("北京").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("新疆").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("河南").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("河北").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("四川").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("江西").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("山西").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("陕西").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("广州").Set(rand.Float64() * 1000)
			mapData.WithLabelValues("台湾").Set(rand.Float64() * 1000)
			time.Sleep(1000)
		}
	}()

	// Expose the registered metrics via HTTP.
	http.Handle("/metrics", promhttp.Handler())
	log.Fatal(http.ListenAndServe(*addr, nil))
}
