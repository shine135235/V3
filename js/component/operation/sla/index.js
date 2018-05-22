import React,{Component} from 'react';
import {Button,Input,Icon, Table,LocaleProvider, Pagination,Modal,message} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $axios from 'axios'
import AddSla from './addSla'
import EditSla from './editSla'
import AuditSla from './auditSla'
import DetailSla from './detailSla'
import './index.less';

const Search = Input.Search;
const confirm = Modal.confirm;
export default class Sla extends Component {
    state = {
        showBetchDel:"none",
        delIdsLength:0,
        delIds:"",
        selectedRowKeys:[],
        totalRecord:0,
        visibleEdit:false,
        visibleAudit:false,
        visibleDetail:false,
        data:[],
        detailData:{},
    }
    onSelectedChange = (selectedRowKeys, selectedRows) => {
      let selectedRowIds = [];
      for( let i = 0;i<selectedRows.length;i++){
          let item = selectedRows[i];
          selectedRowIds.push(item.id);
      }
      selectedRowIds = selectedRowIds.join(",");
      if(selectedRows.length > 0){
          this.setState({
            showBetchDel:"block",
          })
      }else{
          this.setState({
            showBetchDel:"none",
          })
      }
      this.setState({
        selectedRowKeys,
        delIdsLength:selectedRows.length,
        delIds:selectedRowIds,
      })
    }
    columns = [{
        title: 'sla名称',
        dataIndex: 'name',
      },{
        title: '状态',
        render: (text,row) => {
            let content = "";
            if(row.slaStatus == "0"){
                content = '待审核';
            }else if(row.slaStatus == "1"){
                content = '审核未通过';
            }else if(row.slaStatus == "2"){
                content = '已发布';
            }
            return(
                <span>
                    {content}
                </span>
            )
        }
      },{
        title: '操作',
        key: 'action',
        render: (text,row) => {
            let a = []
            if(row.slaStatus == "0"){
                a.push(
                    <a href="javascript:void 0" key="1" onClick={this.showAudit.bind(this,row)}>审核</a>
                )
                a.push(
                    <span className="ant-divider"  key="2"/>
                )
            }else if(row.slaStatus == "1"){
                a.push(
                    <a href="javascript:void 0" key="1" onClick={this.showEdit.bind(this,row)}>编辑</a>
                )
                a.push(
                    <span className="ant-divider" key="2"/>
                )
            }
            return(
                <span>
                    {a}
                    <a href="javascript:void 0" onClick={this.delData.bind(this,row.id)}>删除</a>
                </span>
            )
        }
          
      }];
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    delData = (rowId,e) => {
        e.stopPropagation();
        confirm({
            title: '删除SLA',
            content: '确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:this.confirmOK.bind(this,rowId),
            onCancel() {
                
            },
          });
    }
    confirmOK = (rowIds) => {
        this.delSLAData(rowIds);
    }
    delSLAData = (idString) => {  
        // eslint-disable-next-line
        console.log(idString);
        let ids = idString.split(",");
        $axios.post(`http://172.16.6.11:9090/ops/sla/destroy`,{
            "listStr":ids
        }).then((json) => {
            if(json.data.success == true){
                this.success("删除成功");
                this.setState({selectedRowKeys:[],showBetchDel:"none"})
            }else{
                this.error('删除失败');
            }
            this.getListData({});
        })
      
    }
    success = (con) => {
        message.success(con);
    }
    error = (con) => {
        message.error(con);
    }
    showEdit = (rId,e) => {
        e.stopPropagation();
        let rowId = rId.id;
        this.getDetailData({rowId,checkType:"edit"});
    }
    showAudit = (rId,e) => {
        e.stopPropagation();
        let rowId = rId.id;
        this.getDetailData({rowId,checkType:"audit"});
    }
    showDetail = (rowId) => {
        this.getDetailData({rowId,checkType:"detail"});
    }
    changeVisibleType = ({visibleEdit = false,visibleAudit = false,visibleDetail = false}) => {
        this.setState({
            visibleEdit,
            visibleAudit,
            visibleDetail,
        })
    }
    onChange = (page, pageSize) => {
        this.getListData({pageNum:page,pageSize:pageSize});
    }
    onShowSizeChange = (current, size) =>{
        this.getListData({pageNum:current,pageSize:size});
    }
    checkDetail = (record) => {
        return{
            onClick:this.checkDetailRealy.bind(this,record)
        }
    }
    checkDetailRealy = (record,e) => {
        e.stopPropagation();
        let rowId = record.id;
        this.showDetail(rowId);
    }
    getListData = ({pageNum = 1,pageSize = 10,searchVal = ""}) => {
        $axios.get(`http://172.16.6.11:9090/ops/sla/list?pageNum=${pageNum}&pageSize=${pageSize}&param=${searchVal}`).then((json) => {
            // eslint-disable-next-line
            console.log("liebiao",json);
            let data =  json.data.page.datas;
            let totalRecord =  json.data.page.totalRecord;
            this.setState({
                data,
                totalRecord,
            })
        })
    }
    componentDidMount(){
        this.getListData({});
    }
    refreshData = () => {
        this.getListData({});
    }
    searchFunc = (val) => {
        this.getListData({searchVal:val})
    }
    getDetailData = ({rowId="",checkType = ""}) => {
        $axios.get(`http://172.16.6.11:9090/ops/sla/id/${rowId}`).then((json) => {
            
        // eslint-disable-next-line
        console.log("this.props.detailData",json);
            let name = json.data.data.name;
            let rId = json.data.data.id;
            let list = json.data.data.list;
            let slaBadResponseHour = "";
            let slaBadResponseMin = "";
            let slaBadSolutionHour = "";
            let slaBadSolutionMin = "";
            let slaCommonResponseHour = "";
            let slaCommonResponseMin = "";
            let slaCommonSolutionHour = "";
            let slaCommonSolutionMin = "";
            let slaGreatResponseHour = "";
            let slaGreatResponseMin = "";
            let slaGreatSolutionHour = "";
            let slaGreatSolutionMin = "";
            let commonId = "";
            let badId = "";
            let greatId = "";
            for(let i =0;i<list.length;i++){
                let itemName = list[i].serviceLevelName;
                let responseHour = parseInt(list[i].responseTime/60);
                let responseMin = list[i].responseTime%60;
                let solutionHour = parseInt(list[i].solutionTime/60);
                let solutionMin = list[i].solutionTime%60;
                let id = list[i].id;
                if(itemName == "一般故障"){
                    commonId = id;
                    slaCommonResponseHour = responseHour.toString();
                    slaCommonResponseMin = responseMin.toString();
                    slaCommonSolutionHour = solutionHour.toString();
                    slaCommonSolutionMin = solutionMin.toString();
                }else if(itemName == "严重故障"){
                    badId = id;
                    slaBadResponseHour = responseHour.toString();
                    slaBadResponseMin = responseMin.toString();
                    slaBadSolutionHour = solutionHour.toString();
                    slaBadSolutionMin = solutionMin.toString();
                }else if(itemName == "重大故障"){
                    greatId = id;
                    slaGreatResponseHour = responseHour.toString();
                    slaGreatResponseMin = responseMin.toString();
                    slaGreatSolutionHour = solutionHour.toString();
                    slaGreatSolutionMin = solutionMin.toString();
                }
            }
            let detailData = {
                name,
                rId,
                slaBadResponseHour,
                slaBadResponseMin,
                slaBadSolutionHour,
                slaBadSolutionMin, 
                slaCommonResponseHour,
                slaCommonResponseMin,
                slaCommonSolutionHour,
                slaCommonSolutionMin,
                slaGreatResponseHour,
                slaGreatResponseMin,
                slaGreatSolutionHour,
                slaGreatSolutionMin,
                commonId,
                badId,
                greatId,      
            }
            if(checkType == "detail"){
                this.setState({
                    detailData,
                    visibleDetail:true,
                })
            }else if(checkType == "edit"){
                this.setState({
                    detailData,
                    visibleEdit:true,
                })
            }else if(checkType == "audit"){
                this.setState({
                    detailData,
                    visibleAudit:true,
                })
            }
        })
    }
    render(){
        const { selectedRowKeys,visibleEdit,visibleAudit,visibleDetail,detailData } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        };
        return(
            <div className='slaManagement'>
                <div className = 'slaManagement_topBtns'>
                    <AddSla getListData = {this.getListData}/>
                    {/* <Button className='slaManagement_topBtns_secBtn'>导入</Button> */}
                    {/* <Button className='slaManagement_topBtns_secBtn'>导出</Button> */}
                    <Button className='slaManagement_topBtns_secBtn' onClick={this.refreshData}><Icon type="reload" /></Button>
                    <Search
                        placeholder="请输入..."
                        style={{ 'width': '20%' }}
                        onSearch={this.searchFunc}
                    />
                    <div className="slaManagement_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                        <Icon type="check-circle" />
                        <span className="slaManagement_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                        <span className='slaManagement_Betch_Delete_btn' onClick={this.delData.bind(this,this.state.delIds)}>删除</span>
                    </div>
                </div> 
                <div className='slaManagement_Table'>
                    <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} pagination={false} onRow={this.checkDetail.bind(this)}/>
                </div>
                <div className='slaManagement_Pagination'>
                    <LocaleProvider  locale={zhCN}>
                        <Pagination
                            size="small" 
                            showSizeChanger 
                            showQuickJumper
                            total={this.state.totalRecord}
                            showTotal={this.showTotal}
                            onChange={this.onChange}
                            onShowSizeChange={this.onShowSizeChange}
                        />
                    </LocaleProvider>
                </div>
                <EditSla visibleEdit={visibleEdit} detailData = {detailData} changeVisibleType={this.changeVisibleType} getListData={this.getListData}/>
                <AuditSla visibleAudit={visibleAudit} detailData = {detailData} changeVisibleType={this.changeVisibleType} getListData={this.getListData}/>
                <DetailSla visibleDetail={visibleDetail} detailData = {detailData} changeVisibleType={this.changeVisibleType} getListData={this.getListData}/>
            </div>
        )
    }
}