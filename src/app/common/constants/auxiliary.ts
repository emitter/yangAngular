import $ from "jquery";
import ConstantsList from './config';

export class Auxiliary {

  public ControlHeight(id: string = "#content"): void {
    $(id).css("min-height", $(window).height() - ConstantsList.pageHeight);
  }

  public emptyMessage(css: string = ".ui-datatable-emptymessage"): void {
    $(css).html('暂无数据');
  }

  public publicList(arr: any[], str: string) {
    let List = [];
    for (let i = 0; i < arr.length; i++) {
      let labelList = { label: '', value: '' };
      labelList.label = arr[i][str];
      labelList.value = arr[i];
      List.push(labelList)
    }
    return List;
  }

  public queryParamsList (obj: any): any[] {
    let list = [];
    let objList = {name: '', btn: ''}
    for (var key in obj) {
      objList = {name: '', btn: ''}
      if (obj.hasOwnProperty(key) && obj[key].indexOf('?') > -1) {
        let element = obj[key].split('?');
        objList.name = element[0];
        objList.btn = element[1];
        list.push(objList)
      }
    }
    return list;
  }

}
