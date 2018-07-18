import React,{Component} from 'react'
import { Button,Input,LocaleProvider,Table,Icon,Modal,message,Popover,Form,Row,Col,Select} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import $axios from 'axios';
import AuthPower from '../../../authpower';
import AddResearch from "./addResearch";
import EditResearch from "./editResearch";
import DetailResearch from "./detailResearch";
import config from '../../../../config'
import './index.less'

//  let data = [{"eventNane":"123456789","title":"调研测试","person":"忽忽","statue":"已关闭"}];
const Search = Input.Search;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
 class ResearchManage extends Component{
    constructor(props){
        super(props)
        this.state={
            selectedRowKeys:[],
            showBetchDel:"none",
            showType:"list",
            dataList:[],
            schoolList:[],
            unitList:[],
            unitData:[],
            visible: false,
            totalRecord:"",
            detailData:"",
            searchparam:""
        }
    }
    getDataList = ({pageNum=1,pageSize=10,searchparam = ""}) =>{
        $axios.get(`${config.api_server}/ops/researchList`,{
            params:{
                pageNum:pageNum,
                pageSize:pageSize,
                searchparam:searchparam
            }
        }).then((res) =>{
            if(res.data){
                console.log(res.data)
                if(res.data.length != 0){
                    this.setState({dataList:res.data.page.datas})
                    this.setState({totalRecord:res.data.page.totalRecord})
                }
                
            } 
        })
    }

    getUnit = () =>{
        $axios.get(`${config.api_server}/sys/unit/serviceunit`).then((res) =>{
            if(res.data){
                console.log(res.data)
                if(res.data.length != 0){
                     this.setState({unitList:res.data.data})
                }    
            } 
        })
    }
    getSchool = () =>{
        $axios.get(`${config.api_server}/sys/unit/userunit`).then((res) =>{
            if(res.data){
                if(res.data.length != 0){
                     this.setState({schoolList:res.data.data})
                }   
            } 
        })
    }
    getTyoeList=() =>{
        $axios.get(`${config.api_server}/sys/user/researchuserlist`).then((res) =>{
            this.setState({
                unitData:res.data
            })
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //eslint-disable-next-line
           console.log("adddddddddddddd",values)
           let orderNumber = ""
           let researchUnitCurrentPeople = ""
           let status = ""
           let theme = ""
          if(values.orderNumber){
            orderNumber = values.orderNumber
          }
          if(values.researchUnitCurrentPeople){
            researchUnitCurrentPeople = values.researchUnitCurrentPeople
          }
          if(values.status){
            status = values.status
          }
          if(values.theme){
            theme = values.theme
          }
          if (err) {
              return
          }
          $axios.get(`${config.api_server}/ops/researchList`,{
              params:{
                orderNumber:orderNumber,
                researchUnitCurrentPeople:researchUnitCurrentPeople,
                status:status,
                theme:theme
              }
          }).then((res) =>{
            let datas = res.data.success;
            if(datas){
                this.setState({ visible:false });
                this.setState({dataList:res.data.page.datas})
                this.setState({totalRecord:res.data.page.totalRecord})
            }
          })

        });
    } 
    componentDidMount(){
        this.getTyoeList()
        this.getDataList({});
    }
    refresh = () =>{
        this.setState({searchparam:"",selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({});
    }
    success = (success) => {
        message.success(success)
    };
    error = (error) => {
        message.error(error)
    }
    columns = [{
        title:"调研单号",
        dataIndex:"orderNumber",
        key:"orderNumber"
      },{
        title:"调研主题",
        dataIndex:"theme",
        key:"theme"
      },{
        title:"调研人",
        dataIndex:"currentPeopleNames",
        key:"currentPeopleNames"
      },{
        title:"状态",
        dataIndex:"statue",
        key:"statue",
        render: (text,row) => {
            let a = []
            if(row.status == "0"){
                a.push(
                    <span >已指派</span>
                )
            }else if(row.status == "1"){
                a.push(
                    <span >已关闭</span>
                )
            }else if(row.status == "2"){
                a.push(
                    <span >已逾期</span>
                )
            }
            return(
                <span>
                    {a}
                </span>
            )
        } 
      },{
        title:"操作",
        key:"action",
        className:'no-padding',
        render:(text,row) => {
            return(
                <span className='bigspan' onClick={this.stopEvent}>
                    <AuthPower><a god='bjdy' href="#" onClick = {this.edit.bind(this,row)} className={row.status<='1'?'gary':''} disabled = {row.status<='1'?true:false}>编辑</a></AuthPower>
                    <span className="ant-divider" />
                    <AuthPower><a god='scdy' href="#" onClick = {this.delData.bind(this,String(row.id))}>删除</a></AuthPower>
                    <span className="ant-divider" />
                    <AuthPower><a god='gbdy' href="javascript:void(0)"  onClick = {this.closeResearch.bind(this,row)} className={row.status=='1'?'gary':''} disabled = {row.status=='1'?true:false}>关闭</a></AuthPower>
                 </span>
            )
        }
    }];
    stopEvent=(e) =>{
        e.stopPropagation();
    }
    closeResearch = (row,e) =>{
        e.stopPropagation();
        if(row.status!='1'){
            $axios({
                url:`${config.api_server}/ops/researchInfo`,
                method:'PUT',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                data:{
                    "id":row.id,
                    "status":"1"
                }
            }).then((res) => {
                let datas = res.data.success;
                if(datas){
                    this.setState({selectedRowKeys:[],showBetchDel:"none"})
                    this.getDataList({});
                    setTimeout(() => {
                        let success = "关闭成功"
                        this.success(success);
                    }, 1000);
                }else{
                    setTimeout(() => {
                        let error = "关闭失败"
                        this.error(error);
                    }, 1000);
                }
            })
        }else{
            return;
        }
        
    }

    edit = (row,e) =>{
        console.log(row)
        e.stopPropagation();
        this.getDetail({recordId:row.id,checkType:"edit"})
    }
    delDatas = (record,e) =>{
        e.stopPropagation();
        record
        this.delData(record)
    }
    delData = (record,e) => {
        e.stopPropagation();
         //eslint-disable-next-line
           // console.log("iiiiiiiiiiiiii",record)
        confirm({
            title: `删除操作`,
            content:"确定要删除吗？",
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:() => {
              this.setDelet(record)
            },
            onCancel:() => {
                 //eslint-disable-next-line
            //   console.log('Cancel');
            },
        });
    }
    setDelet = (pid) =>{
         console.log(typeof(pid));
         let ids = pid.split(",");
        $axios({
            url:`${config.api_server}/ops/researchInfo`,
            method:'delete',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            data:{
                "researchBaseIds":ids
            }
        }).then((res) => {
            let datas = res.data.success;
            if(datas){
                this.setState({selectedRowKeys:[],showBetchDel:"none"})
                this.getDataList({});
                
                setTimeout(() => {
                    let success = "删除成功"
                    this.success(success);
                }, 1000);
            }else{
                setTimeout(() => {
                    let error = "删除失败"
                    this.error(error);
                }, 1000);
            }
        })
    }
    onSelectedChange = (selectedRowKeys, selectedRows) => {
        let selectedRowIds = [];
        //eslint-disable-next-line
        //console.log('selectedRowKeysselectedRowKeys',selectedRowKeys);
        //eslint-disable-next-line
        //console.log('selectedRowsselectedRows',selectedRows);
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
    changeShowType = ({showType = "list"}) => {
        this.setState({showType});
    }
    handleVisibleChange = (visible) => {
         this.setState({ visible });
    }
    moreNew = (e) =>{
        e.stopPropagation();
        this.props.form.resetFields();
        //console.log("this.state.visible",this.state.visible);
        this.getUnit();
        this.getSchool();   
        if(this.state.visible == false){
            this.setState({ visible:true });
        }else if(this.state.visible == true){
            this.setState({ visible:false });
        }
        // this.setState({ visible });
    }
    onSearch = (value) =>{
        this.setState({searchparam:value,selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({searchparam:value});
    }
    onClose = () =>{
        this.setState({ visible:false });
        this.props.form.resetFields();
    }

    handleReset = () =>{
        this.props.form.resetFields();
    }
    checkDetail = (record) => {
        return{
            onClick:this.checkDetailRealy.bind(this,record)
        }
    }
    checkDetailRealy = (record,e) => {
        e.stopPropagation();
        let recordId = record.id
        this.getDetail({recordId,checkType:"detail"})
    }
    getDetail = ({recordId="",checkType = ""}) =>{
        $axios.get(`${config.api_server}/ops/researchInfo/${recordId}`).then((res) =>{
                let id=res.data.data.id;
                let theme = res.data.data.theme;
                let target = res.data.data.target;
                let content = res.data.data.content;
                let organization = res.data.data.organization;
                let researchUnit = res.data.data.researchSchoolList;
                let researchList = res.data.data.researchList;
                let contactPeople = res.data.data.contactPeople;
                let contactPhone = res.data.data.contactPhone;
                let startDateTime = res.data.data.startDateTimeStr;
                let endDateTime = res.data.data.endDateTimeStr;
                let textContent = res.data.data.textContent;
                let excelData=res.data.data.excelData;
                let detailData = {
                    id,
                    target,
                    startDateTime,
                    endDateTime,
                    content,
                    theme,
                    textContent,
                    contactPhone,
                    contactPeople,
                    organization,
                    researchList,
                    researchUnit,
                    excelData
                }
                if(checkType == "detail"){
                    this.setState({detailData,showType:"detail"})
                }else if(checkType == "edit"){
                    this.setState({detailData,showType:"edit"})
                }
        })
    }
    pageChange=(page) =>{
        this.setState({pageNum:page,selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({pageNum:page,searchparam:this.state.searchparam})
    }
    onShowSizeChange = (current, size) =>{
        this.setState({pageNum:current,selectedRowKeys:[],showBetchDel:"none"})
        this.getDataList({pageNum:current,pageSize:size,searchparam:this.state.searchparam})
    }
    showTotal = (total) => {
        return `共 ${total} 条记录`
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        // let v2Ip = sessionStorage.getItem('v2IP').replace(/"/g,"");
        const pagination = {
            size:"small",
            showQuickJumper:true,
            current:this.state.pageNum,
            total:this.state.totalRecord,
            onChange:this.pageChange,
            showTotal:this.showTotal,
            onShowSizeChange:this.onShowSizeChange
        }
        const { selectedRowKeys } = this.state;
        const rowSelection =  {
            selectedRowKeys,
            onChange: this.onSelectedChange,
        }

        let unitOption = [];
        let unitList = this.state.unitList;
        if(unitList.length > 0){
            for(let i = 0;i<unitList.length;i++){
                unitOption.push(
                    <Option  key = {unitList[i].unitId} value = {unitList[i].unitId}>{unitList[i].unitName}</Option>
                )
            }

        }
        let schoolOption = [];
        let schoolList = this.state.schoolList;
        if(schoolList.length > 0){
            for(let i = 0;i<schoolList.length;i++){
                schoolOption.push(
                    <Option  key = {schoolList[i].unitId} value = {schoolList[i].unitId}>{schoolList[i].unitName}</Option>
                )
            }

        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        }; 
        let content = (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>
                <Col span={12}  >
                        <FormItem 
                         {...formItemLayout}
                            label={(
                                <span>
                                调研单号&nbsp;
                                </span>
                            )}
                        >
                            {getFieldDecorator('orderNumber', {
                            rules: [{
                                required: false,
                                message: '请输入调研单号!',
                            }],
                            })(
                               <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}  >
                        <FormItem 
                        {...formItemLayout}
                            label={(
                                <span>
                                调研主题&nbsp;
                                </span>
                            )}
                        >
                            {getFieldDecorator('theme', {
                            rules: [{
                                required: false,
                                message: '请输入调研主题!',
                            }],
                            })(
                            <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}  >
                    <FormItem 
                         {...formItemLayout}
                            label={(
                                <span>
                                调研人&nbsp;
                                </span>
                            )}
                        >
                            {getFieldDecorator('researchUnitCurrentPeople', {
                            rules: [{
                                required: false,
                                message: '请输入调研人!',
                            }],
                            })(
                            <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}  >
                        <FormItem 
                         {...formItemLayout}
                            label={(
                                <span>
                                 状态&nbsp;
                                </span>
                            )}
                        >
                            {getFieldDecorator('status', {
                            rules: [{
                                required: false,
                                message: '请输入状态!',
                            }],
                            })(
                                <Select
                                showSearch
                                // onChange={this.handleChange}
                                // onFocus={this.handleFocus}
                                // onBlur={this.handleBlur}
                            >
                                <Option  key = "0" value = "0" >已指派</Option>
                                <Option  key = "1" value = "1" >已关闭</Option>
                                <Option  key = "2" value = "2" >已逾期</Option>
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" onClick = {this.handleSubmit}>搜索</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.onClose} >取消</Button>
                </Col>
                </Row>
            </Form>
        )
        if(this.state.showType == "list"){
            return(
                <div className='researchManage'>
                    {/* <div className='researchManage_iframe'>
                        <iframe src={`${v2Ip}/iitsp/index.html#/operationManage/operationManagePage?ResearchManagement`} frameBorder='none' style={{"width":"100%","height":"109%"}}></iframe>
                    </div> */}
                    <div className = 'eventTitle'>
                        <AuthPower><Button god='xjdy' type="primary"   icon="plus" style = {{"marginRight":"10px"}} onClick={this.changeShowType.bind(this,{showType:"add"})}>新建</Button></AuthPower>
                        <Button onClick = {this.refresh}><Icon type="reload"/></Button>
                        <div className = "eventTitleSearch">
                            <Search placeholder="搜索"  style={{ width: "64%" }} onSearch={this.onSearch}/>     
                            <Popover placement="bottom"  
                                content={content}
                                trigger="click"
                                visible={this.state.visible}
                                // onVisibleChange={this.handleVisibleChange}
                            >
                                <Button type="primary" onClick = {this.moreNew}>更多条件</Button>    
                            </Popover>  
                                    
                        </div>
                    </div>
                    <div className="slaManagement_Betch_Delete" style={{"display":this.state.showBetchDel}}>
                            <Icon type="check-circle" />
                            <span className="slaManagement_Betch_WZ">已选择<span style={{"color":"#21adfc","margin":"0 5px"}}>{this.state.delIdsLength}</span>项</span>
                            <span className='slaManagement_Betch_Delete_btn' onClick = {this.delData.bind(this,this.state.delIds)}  style = {{"color":"red"}}>批量删除</span>
                        </div>
                    <div>
                        <LocaleProvider locale = {zhCN}>
                            <Table dataSource={this.state.dataList}  pagination = {pagination} columns={this.columns}  rowSelection = {rowSelection}  onRow={this.checkDetail.bind(this)} />          
                        </LocaleProvider>
                    </div>
                </div>
            )
        }else if(this.state.showType == "add"){
            return (
                <AddResearch  changeShowType = {this.changeShowType} reloadData={this.getDataList} />
            )
        }else if(this.state.showType == "edit"){
            return(
                <EditResearch  changeShowType = {this.changeShowType}  unitData={this.state.unitData} detailData = {this.state.detailData} reloadData={this.getDataList} />
            )
        }else if(this.state.showType == "detail"){
            return(
                <DetailResearch  changeShowType = {this.changeShowType} detailData = {this.state.detailData}/>
            )
        }        
    }
}
const WrappedRegistrationForm = Form.create()(ResearchManage);

export default WrappedRegistrationForm;
