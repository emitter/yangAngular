import { Component, OnInit,ViewChild,Input,Inject,Output,EventEmitter } from '@angular/core';

import { ModalformComponent } from '../../../../common/component/modalform/modalform.component';
import { Message,ConfirmationService} from 'primeng/primeng';//右上角提示框组件，删除对话框

import * as Modal from 'ngx-bootstrap/modal';
import { ModalDirective,ModalModule,ModalOptions } from 'ngx-bootstrap/modal';

import { GetList } from '../../../services/getlist';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'mbwh-add',
  templateUrl: './mbwhadd.component.html',
  styleUrls: ['./mbwhadd.component.css']
})

export class mbwhaddComponent implements OnInit {
  @ViewChild('childModal') public childModal:ModalDirective;
  private GetList:GetList;
  private PostService: PostService;
  msgs: Message[] = [];
  optDepartmentList:any = [];
  optTypeList:any = [];
  postData:any = {
    departmentId:"",isBaned:"false",isPagenum:"",name:"",statement:"",type:"",workloads:""
  }
  isadSearch:number = 1;
  nodeList:any = [];

  constructor(@Inject(GetList) getList: GetList,@Inject(PostService) postService: PostService) {
    this.GetList = getList;this.PostService = postService;
  }
  ngOnInit() {

  }

  //=======================
  //修改部门时获取节点
  deptchange() {
    if(!this.postData.departmentId){
      this.msgs = [];
      this.msgs = [{severity:'error', summary:'错误提示', detail:"请选择所属部门"}];
      return;
    }
    this.GetList.mbwhAddNodeList(this.postData.departmentId).then(res=>{
      if(!res.code) {
        this.nodeList = res.nodeList;
        this.isadSearch = 0;
      }else{
        this.msgs = [];
        this.msgs = [{severity:'error', summary:'错误提示', detail:res.msg}];
        return;
      }
    });
  }

  public mbwhaddShow(data):void {
    this.childModal.show();
    console.log(data);
    this.optDepartmentList = data.optDepartment;
    this.optTypeList = data.optType;
  }

  public mbwhaddHide():void {
    this.childModal.hide();
    this.postData = {
      departmentId:"",isBaned:"false",isPagenum:"",name:"",statement:"",type:"",workloads:[]
    }
    this.nodeList = [];
    this.isadSearch = 1;
  }
  
  @Output()
  public mbwhChange=new EventEmitter<string>();

  public emitmbwhAdd(event):void {
    if(this.postData.name.trim().length === 0||!this.postData.isBaned||!this.postData.departmentId||!this.postData.type||!this.postData.isPagenum) {
      this.msgs = [];
      this.msgs = [{severity:'error', summary:'错误提示', detail:"带‘*’号为必填项，请填写完整后再提交"}];
      return;
    }
    let postWork = [];
    this.nodeList.forEach((x,i) => {
      let onceData = {};
      onceData["nodeId"] = x.nodeId;
      onceData["workload"] = x.workload;
      postWork.push(onceData);
    });
    this.postData.workloads = postWork;
    this.PostService.mbwhAdd(this.postData).then(res=>{
      this.mbwhChange.emit("mbwhChange");
      this.mbwhaddHide();
      this.msgs = [];
      this.msgs = [{severity:'success', summary:'成功提示', detail:"新增工作量模板成功"}];
    }).catch(res=>{
      // res = res.json();
      this.msgs = [];
      this.msgs = [{severity:'error', summary:'错误提示', detail:res.msg}];
      return;
    });
  }
}
