import _ from 'lodash'
import * as d3 from 'd3';
import * as topojson from 'topojson'
import china from './data/china.map.json'
// import kbn from 'grafana/app/core/utils/kbn'
export default class MapRender{
  constructor(scope, elem, attrs, ctrl){
    this.scope = scope;
    this.ctrl = ctrl;
    ctrl.events.on('render',()=>{
      this.renderMap()
      this.ctrl.renderingCompleted();
    });
  }
  addChinaMap(){
    const viewId = `#panel-${this.ctrl.panel.id} #chinamap`;
    const projection = d3.geoMercator()
      .translate([-420, 480])
      .scale(400);
    const path = d3.geoPath(projection)
    const svg = d3.select(viewId)
            .classed("svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 600 400")
            .classed("svg-content-responsive", true)
    const provinces = topojson.feature(china, china.objects.china).features;
    svg.selectAll(".province")
        .data(provinces)
        .enter()
        .append("path")
        .attr("class", "province")
        .attr("d", path)
        .attr("id", function(d,i) { return d.id; })
        .attr("title", function(d,i) { return d.properties.name; })
    this.ctrl.panel.svgObject = svg;
  }
  renderMap(){
    const viewId = `#panel-${this.ctrl.panel.id} #chinamap`;
    if(!this.ctrl.panel.svgObject){
      this.addChinaMap()
    }
    this.updateMapData()
  }
  updateMapData(){
    const viewId = `#panel-${this.ctrl.panel.id} #chinamap`;
    const maxRange = 1000
    const data = this.ctrl.data
    _.map(data,(item)=>{
      const color = d3.interpolateOranges(item.value[0]/maxRange)
      const target = viewId+" path[title=" + item.target +"]"
      $(target).css("fill",color);
    })
  }
}
