import React,{Component} from 'react';
import {Button,Icon,Input, Table,LocaleProvider, Pagination,message,Popconfirm} from 'antd'
import $axios from 'axios'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddWorkOrder from './addWorkOrder'
import FaultTab from './faultTab'
import config from '../../../../config'
import './index.less'

const Search = Input.Search;
let that=0;
let CancelToken = $axios.CancelToken;
let source = CancelToken.source();
export default class WorkOrder extends Component {
    state = {
        showBetchDel:"none",
        delIdsLength:0,
        delIds:[],
        selectedRowKeys:[],
        totalRecord:0,
        visibleEdit:false,
        visibleAudit:false,
        visibleDetail:false,
        isWith:false,
        nowPage:1,
        data:[],
        detailData:{},
        showType:"list",
        rowData:{},
        onlyView:0,
        withOffice:0,
        withIds:'',
        faultUnit:'',
        tableLoading:false,
        searchKey:''
    }
    onSelectedChange = (selectedRowKeys, selectedRows) => {
        let selectedRowIds = [];
        selectedRows.map(item =>{
            selectedRowIds.push(item.id)
        })
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
      columns = [
        {
            title: '项目名称',
            dataIndex: 'projectName',
            render:(text) =>(
                <span title={text===null?'':text}>{text===null?'':text.length<=18?text:text.substring(0,17)+'...'}</span>
            )
        },{
            title: '故障主题',
            dataIndex: 'faultTheme',
            render:(text) =>(
                <span title={text===null?'':text}>{text===null?'':text.length<=18?text:text.substring(0,17)+'...'}</span>
            )
        },{
            title: '级别',
            render: (text,row) => {
                let level = row.slaTimeLevelName;
                let text1 = "";
                if(level != "" &&level != null &&level != undefined ){
                    if(level == "一般故障" ){
                        text1 = "一般"
                    }else if(level == "严重故障" ){
                        text1 = "严重"

                    }else if(level == "重大故障" ){
                        text1 = "重大"

                    }
                    return(
                        <span>
                            {text1}
                        </span>
                    )
                }
                
            }
        },{
            title: '学校名称',
            dataIndex: 'faultSourceUnit',
            render:(text) =>(
                <span title={text===null?'':text}>{text===null?'':text.length<=18?text:text.substring(0,17)+'...'}</span>
            )
        },{
            title: '创建人',
            dataIndex: 'createByName',
        },{
            title: '创建时间',
            dataIndex: 'createDateTime',
        },{
            title: '剩余响应',
            dataIndex: 'residueResponseTime',
        },{
            title: '剩余解决',
            dataIndex: 'residueSolveTime',
        },{
            title: '处理人',
            dataIndex: 'currentHandle',
        },{
            title: '状态',
            render: (text,row) => {
                let con = "";
                switch(parseInt(row.status)){
                    case 1:
                    con = "新建"
                    break;
                    case 2:
                    con = "待分派"
                    break;
                    case 3:
                    con = "待响应"
                    break;
                    case 4:
                    con = "待处理"
                    break;
                    case 5:
                    con = "处理中"
                    break;
                    case 6:
                    con = "已完成"
                    break;
                    case 7:
                    con = "已关闭"
                    break;
                }
                return(
                    <span>
                        {con}
                    </span>
                )
            }
        },{
            title: '操作',
            key: 'action',
            render: (text,record) => {
                let con = "";
                switch(parseInt(record.status)){
                    case 1:
                    con = "分发"
                    break;
                    case 2:
                    con = "分派"
                    break;
                    case 3:
                    con = "响应"
                    break;
                    case 4:
                    con = "处理"
                    break;
                    case 5:
                    con = "完成"
                    break;
                    case 6:
                    con = "评价"
                    break;
                    case 7:
                    con = "评价"
                    break;
                }
                if(record.status==7){
                    return(
                        <span>
                            <a href="javascript:void 0" onClick={this.showEdit.bind(this,record)} className={!record.canOpearte?'non-event':''}>{con}</a>
                            <span className="ant-divider"/>
                            <a href="javascript:void 0" onClick={this.showEdit.bind(this,record)} id='1'>查看</a>
                        </span>
                    )
                }else{
                    return(
                        <span>
                            <a href="javascript:void 0" onClick={this.showEdit.bind(this,record)} className={!record.canOpearte?'non-event':''}>{con}</a>
                            <span className="ant-divider"/>
                            <a href="javascript:void 0" onClick={this.showEdit.bind(this,record)} id='3'>查看</a>
                        </span>
                    )
                }
                
            }
        }
      ]
      showTotal = (total) => {
        return `共 ${total} 条记录`
    }
    batchDelete=() =>{
        $axios({
            url:`${config.api_server}/ops/workorder`,
            method:'delete',
            data:{
                list:this.state.delIds
            }
        }).then(res=>{
            if(res.data.success){
                message.success('删除成功!');
                this.setState({selectedRowKeys:[]})
                this.getListData(1)
            }else{
                message.error(res.data.message)
            }
        })
    }
    changeShowType = (type) => {
        this.setState({
            showType:type
        });
    }
    showEdit = (record,view) => {
        if(view.target.getAttribute('id')!==null){
            this.setState({
                onlyView:view.target.getAttribute('id')
            })
        }else{
            this.setState({
                onlyView:0
            })
        }
        console.log(this.state.isWith)
        if(view.target.getAttribute('id')!=3){
            if(record.status==3 || record.status==4){
                that=that+1;
                if(that===1){
                    $axios.put(`${config.api_server}/ops/workorder`,{
                        id:record.id,
                        status:record.status
                    }).then(res =>{
                        if(res.data.success){
                            this.getListData(this.state.nowPage,!this.state.isWith);
                            setTimeout(() =>{
                                that=0
                            },2000)
                        }else{
                            setTimeout(() =>{
                                that=0
                            },2000)
                        }                        
                    })
                }
                
            }else{
                this.setState({
                    rowData:record.id,
                    orderStatus:record.status,
                    faultUnit:record.faultSourceUnitId
                })
                this.changeShowType('edit');
            }
        }else{
            this.setState({
                rowData:record.id,
                orderStatus:record.status,
                faultUnit:record.faultSourceUnitId
            })
            this.changeShowType('edit');
        }
        
    }
    getListData = (pn,re,sc) => {
        let withIds=this.state.withIds
        if(re==undefined || re==true){
            withIds=''
        }
        this.setState({
            tableLoading:true
        })
        $axios.post(`${config.api_server}/ops/workorder/list`,{
                pageNum:pn?pn:1,
                pageSize:10,
                searchparam:sc,
                ids:withIds
        }).then((json) => {
            this.setState({
                data:json.data.page.datas,
                totalRecord:json.data.page.totalRecord,
                withOffice:json.data.page.backLogInfo.num,
                withIds:json.data.page.backLogInfo.ids?json.data.page.backLogInfo.ids:'',
                tableLoading:false
            })
        })
    }
    loop=setInterval(this.getListData,300000)
    componentDidMount(){
        this.getListData(1)
    }
    componentWillUnmount(){
        source.cancel();
    }
    refreshData = () => {
        this.getListData(1,true);
        this.setState({
            isWith:false,
            nowPage:1,
            searchKey:''
        })
    }
    onChange=(v) =>{
        this.setState({
            nowPage:v
        })
        this.getListData(v,!this.state.isWith)
    }
    searchFunc=(value) =>{
        this.setState({
            searchKey:value
        })
        this.getListData(1,true,value)
    }
    withOffice=() =>{
        this.setState({
            isWith:true,
            nowPage:1
        })
        this.getListData(1,false)
    }
    render(){
        const { selectedRowKeys,rowData,orderStatus } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        };
        if(this.state.showType == "list"){
            return(
                <div className='workOrder'>
                    <div className = 'workOrder_topBtns'>
                        <Button type="primary" icon="plus" onClick={this.changeShowType.bind(this,'add')}>新建</Button>
                        <Button className='workOrder_topBtns_secBtn' onClick={this.refreshData}><Icon type="reload" /></Button>
                        <Icon type="edit" style={{marginRight:'10px',marginLeft:'10px'}} /><a href='javascript:void(0)' onClick={this.withOffice}>待办（{this.state.withOffice}）</a> 
                        <Search
                            placeholder="请输入..."
                            style={{ 'width': '20%' }}
                            onSearch={this.searchFunc}
                        />
                        <div className="workOrder_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                            <Icon type="check-circle" />
                            <span className="workOrder_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                            <Popconfirm title="确定删除选择的工单吗?" placement='bottom' onConfirm={this.batchDelete} okText="删除" cancelText="取消">
                            <span className='workOrder_Betch_Delete_btn'>删除</span>
                            </Popconfirm>
                        </div>
                    </div> 
                    <div className='workOrder_Table'>
                    <LocaleProvider  locale={zhCN}>
                        <Table rowSelection={rowSelection} loading={this.state.tableLoading} columns={this.columns} dataSource={this.state.data} pagination={false}/>
                    </LocaleProvider>
                    </div>
                    <div className='workOrder_Pagination'>
                        <LocaleProvider  locale={zhCN}>
                            <Pagination
                                size="small"
                                current={this.state.nowPage}
                                showQuickJumper 
                                total={this.state.totalRecord}
                                showTotal={this.showTotal}
                                onChange={this.onChange}
                            />
                        </LocaleProvider>
                    </div>
                </div>
            )
        }else if(this.state.showType == "add"){
            return(
                <AddWorkOrder changeShowType = {this.changeShowType} refreshData={this.getListData} />
            )
        }else if(this.state.showType == "edit"){
            return(
                <FaultTab changeShowType = {this.changeShowType} rowData={rowData} orderStatus={orderStatus} refreshData={this.getListData} only={this.state.onlyView} faultunit={this.state.faultUnit} />
            )
        }
    }
}
