import _ from 'lodash'
import * as d3 from 'd3';
import * as topojson from 'topojson'
import china from './data/china.map.json'
// import kbn from 'grafana/app/core/utils/kbn'
export default class MapRender{
  constructor(scope, elem, attrs, ctrl){
    this.scope = scope;
    this.ctrl = ctrl;
    ctrl.events.on('render',this.renderMap.bind(this));
    this.RENDER_CHINA_MAP_ID = '#chinamap';
    return this.printChinaMap(this.RENDER_CHINA_MAP_ID)
  }
  printChinaMap(viewId){
    const projection = d3.geoMercator()
      .translate([-420, 500])
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
  }
  renderMap(){
    const data = this.ctrl.data;
    if(!data){
      return
    }
    this.updateMapData()
  }
  updateMapData(){
    console.log(this.ctrl.data)
  }
}
