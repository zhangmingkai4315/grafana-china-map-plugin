import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk
import $ from 'jquery';
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
      maxDataPoints:1,
      locationData: 'china',
      scroll:true,
      showLegend: true,
      colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
      mouseWheelZoom: false,
      fontSize:'100%',
    }
    _.defaults(this.panel,this.panelDefaults);
    this.events.on("data-received",this.onDataReceived.bind(this))
    this.events.on("data-snapshot-load",this.onDataReceived.bind(this))
    this.events.on("init-edit-mode",this.onInitEditMode.bind(this))
  }
  onInitEditMode(){
    console.log("edit mode")
  }
  onDataError(){
    this.data = []
    this.render();
  }
  setZoom(){
    this.map.setZoom(this.panel.initialZoom || 1)
  }

  onDataReceived(datalist){
    let latestDataSet = []
    if (datalist.length>0){
      latestDataSet = datalist.map((item)=>{
          const data = {}
          if(item.datapoints.length>0){
            data.value=item.datapoints.pop();
          }
          if (typeof item.target === 'string'){
            const reg =/provience=\"(\w+)\"/
            if (item.target.match(reg)){
              data.target = item.target.match(reg)[1]
            }
          }
          return data
      })
      this.data = latestDataSet
      this.render();
    }
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
