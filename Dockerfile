FROM grafana/grafana
RUN mkdir /var/lib/grafana/plugins/grafana-chinamap-panel
COPY . /var/lib/grafana/plugins/grafana-chinamap-panel
