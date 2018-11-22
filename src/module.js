import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import './css/panel.base.scss';
import './css/panel.dark.scss';
import './css/panel.light.scss';
import MapRender from './rendering';

class Ctrl extends MetricsPanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    this.dataType = 'timeseries';
    this.panelDefaults = {
      initialZoom:1,
      divID :"chinamap_div_"+this.panel.id,
      containerID:"chinamap_container_"+this.panel.id,
      panelContainer :null,
      svgContainer :null,
      svg : null,
      panelWidth :null,
      panelHeight :null,
      svgObject :null,
      showLegend: true,
    }
    _.defaults(this.panel,this.panelDefaults);
    this.events.on("data-received",this.onDataReceived.bind(this))
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on("data-snapshot-load",this.onDataReceived.bind(this))
    this.events.on("init-edit-mode",this.onInitEditMode.bind(this))
  }
  setContainer(container){
    this.panelContainer = container
    this.panel.svgContainer = container
  }
  onInitEditMode(){
    console.log("edit mode")
  }
  onDataError(){
    this.data = []
    this.render();
  }
  parseSeries(series){
    return _.map(series,(item)=>{
      const data = {}
      if(item.datapoints.length>0){
        data.value=item.datapoints.pop();
      }
      if (typeof item.target === 'string'){
        const reg =/provience=\"([\w\u4e00-\u9fa5]+)\"/
        if (item.target.match(reg)){
          data.target = item.target.match(reg)[1]
        }
      }
      return data
    })
  }
  onDataReceived(series){
      this.data = this.parseSeries(series)
      this.render(this.data);
  }
  link(scope, element,attrs,ctrl) {
    new MapRender(scope,element,attrs,ctrl)
    this.initStyles();
  }
  initStyles() {
    window.System.import(this.panelPath + 'css/panel.base.css!');
    // Remove next lines if you don't need separate styles for light and dark themes
    if (grafanaBootData.user.lightTheme) {
      window.System.import(this.panelPath + 'css/panel.light.css!');
    } else {
      window.System.import(this.panelPath + 'css/panel.dark.css!');
    }
  }

  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = `/public/plugins/${this.pluginId}/`;
    }
    return this._panelPath;
  }
  
}
Ctrl.templateUrl = 'partials/template.html';
Ctrl.scrollable = true;
export { Ctrl as PanelCtrl }
