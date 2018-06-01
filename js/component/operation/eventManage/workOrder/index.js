import React,{Component} from 'react';
import {Button,Icon,Input, Table,LocaleProvider, Pagination} from 'antd'
import $axios from 'axios'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddWorkOrder from './addWorkOrder'
import FaultTab from './faultTab'
import config from '../../../../config'
import './index.less'

const Search = Input.Search;
export default class WorkOrder extends Component {
    state = {
        showBetchDel:"block",
        delIdsLength:0,
        delIds:"",
        selectedRowKeys:[],
        totalRecord:0,
        visibleEdit:false,
        visibleAudit:false,
        visibleDetail:false,
        data:[],
        detailData:{},
        showType:"list",
        rowData:{}
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
      columns = [
        {
            title: '项目名称',
            dataIndex: 'projectName',
        },{
            title: '故障主题',
            dataIndex: 'faultTheme',
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
        },{
            title: '创建人',
            dataIndex: 'createBy',
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
                }
                console.log(con)
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
                    con = "关闭"
                    break;
                    case 6:
                    con = "评价"
                    break;
                }
                return(
                    <span>
                        <a href="javascript:void 0" onClick={this.showEdit.bind(this,record)}>{con}</a>
                        <span className="ant-divider"/>
                        <a href="javascript:void 0">删除</a>
                    </span>
                )
            }
        }
      ]
      showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    changeShowType = (type) => {
        this.setState({
            showType:type
        });
    }
    showEdit = (record) => {
        console.log(record)
        this.setState({
            rowData:record,
        })
        this.changeShowType('edit');
    }
    getListData = (pn,sc) => {
        $axios.get(`${config.api_server}/ops/workorder/list`,{
            params:{
                pageNum:pn,
                pageSize:10,
                Searchparam:sc
            }
        }).then((json) => {
            let data = json.data.page.datas;
            let totalRecord = json.data.page.totalRecord;
            this.setState({data,totalRecord})
        })
    }
    componentDidMount(){
        this.getListData(1)
    }
    refreshData = () => {
        this.getListData(1)
    }
    render(){
        const { selectedRowKeys,rowData } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        };
        if(this.state.showType == "list"){
            return(
                <div className='workOrder'>
                    <div className = 'workOrder_topBtns'>
                        <Button type="primary" icon="plus" onClick={this.changeShowType.bind(this,'add')}>新建</Button>
                        {/* <Button className='workOrder_topBtns_secBtn'>导入</Button> */}
                        {/* <Button className='workOrder_topBtns_secBtn'>导出</Button> */}
                        <Button className='workOrder_topBtns_secBtn' onClick={this.refreshData}><Icon type="reload" /></Button>
                        <Search
                            placeholder="请输入..."
                            style={{ 'width': '20%' }}
                            // onSearch={this.searchFunc}
                        />
                        <div className="workOrder_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                            <Icon type="check-circle" />
                            <span className="workOrder_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                            <span className='workOrder_Betch_Delete_btn'>删除</span>
                        </div>
                    </div> 
                    <div className='workOrder_Table'>
                        <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} pagination={false}/>
                    </div>
                    <div className='workOrder_Pagination'>
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
                </div>
            )
        }else if(this.state.showType == "add"){
            return(
                <AddWorkOrder changeShowType = {this.changeShowType}/>
            )
        }else if(this.state.showType == "edit"){
            return(
                <FaultTab changeShowType = {this.changeShowType} rowData={rowData}/>
            )
        }
    }
}