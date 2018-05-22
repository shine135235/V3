import React,{ Component } from "react";
import { 
    // Button , 
    Input , Table ,LocaleProvider , Modal , Icon,message} from 'antd';
import $axios from "axios";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AddSensitive from "./addModal/index";
import './index.less'

const confirm = Modal.confirm;
const Search = Input.Search;
export default class AppSensitive extends Component {
    state = {
        data:[],
        totalRecord:0,
        delIds:"",
        delIdsLength:0,
        showBetchDel:"none",
        selectedRowKeys:[],
    }
    delData = (rowId) => {
        let rowIds = rowId.split(",");
        confirm({
            title: '删除敏感词',
            content: '确定要删除吗？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:this.confirmOK.bind(this,rowIds),
            onCancel() {
                
            },
          });
    }
    confirmOK = (rowIds) => {
        this.delSenSitiveData(rowIds);
    }
    columns = [{
        title: '敏感词',
        dataIndex: 'name',
        key: 'id',
      },{
        title: '操作',
        key: 'action',
        render: (text, row) => (
          <span>
            <a href="javascript:void 0" onClick={this.delData.bind(this,row.id)}>删除</a>
          </span>
        ),
      }];
      
      getListData = ({pageNum = 1,pageSize = 10,searchVal = ""}) => {
        $axios.get(`http://172.16.6.9:9090/app/sensitiveList?pageNum=${pageNum}&pageSize=${pageSize}&mohu=${searchVal}`).then((json) => {
              let data = json.data.page.datas;
              let totalRecord = json.data.page.totalRecord;
              this.setState({
                data,
                totalRecord,
            })
        })
      }
      delSenSitiveData = (idString) => {
        $axios.delete("http://172.16.6.9:9090/app/sensitive",{
            data:{
                ids:idString
            }
        }).then((json) => {
            if(json.data.success == true){
                this.success();
                this.getListData({});
                this.setState({
                    selectedRowKeys:[],
                    showBetchDel:"none",
                })
            }else{
                this.error();
            }
        })
      }
    success = () => {
        message.success('删除成功');
    };
    error = () => {
        message.error('删除失败');
    };
    componentDidMount(){
       this.getListData({});
    }
    searchFunc = (value) => {
        this.getListData({searchVal:value});
    }
    showTotal = (total, range) => {
        return `共 ${total} 条记录 第${range[0]}-${range[1]}条 `
    }
    onChange = (page, pageSize) => {
        this.getListData({pageNum:page,pageSize:pageSize});
    }
    onShowSizeChange = (current, size) =>{
        this.getListData({pageNum:current,pageSize:size});
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
    render(){
        const { selectedRowKeys } = this.state;
        const pagination = {
            size:'small',
            total:this.state.totalRecord,
            showSizeChanger:true,
            showQuickJumper:true,
            showTotal:this.showTotal,
            onChange:this.onChange,
            onShowSizeChange:this.onShowSizeChange,
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        };
        return(
            <div className="appSensitive">
                <div className='appSensitive_topBtns'>
                    <AddSensitive getListData = {this.getListData}/>
                    {/* <Button className='appSensitive_Betch_Upload'>批量导入</Button> */}
                    <Search
                        placeholder="请输入..."
                        style={{ 'width': '20%' }}
                        onSearch={this.searchFunc}
                    />
                    <div className="appSensitive_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                        <Icon type="check-circle" />
                        <span className="appSensitive_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                        <span className='appSensitive_Betch_Delete_btn' onClick={this.delData.bind(this,this.state.delIds)}>删除</span>
                    </div>
                </div>

                <div className='appSensitive_table'>
                    <LocaleProvider locale={zhCN}>
                        <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} pagination={pagination} />
                    </LocaleProvider>
                </div>
            </div>
        )
    }
}
