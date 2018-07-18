import React,{Component} from 'react';
import { LocaleProvider,Form,  Modal,Row,Col, Input,Table,Select,Button,InputNumber,Popconfirm,message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import axios from 'axios';
import moment from 'moment';
import config from '../../../../../config';

const FormItem = Form.Item;
const Option=Select.Option;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  getInput = () => {
      return <InputNumber min={0} max={this.props.record.ASSETSAMOUNT} style={{width:'90%'}} onChange={this.onChange} />;
  };
  onChange=(value) =>{
      if(value>this.props.record.ASSETSAMOUNT){
          let news={}
          news[this.props.record[this.props.dataIndex]]={
              value:this.props.record.ASSETSAMOUNT
          };
          this.props.form.setFields(news)
      }
  }
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入 ${title}!`
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
class AssetsList extends Component{
    state={
        selectedRows:[],
        pageNum:1,
        pageSize:10
    }
    componentWillMount(){
        this.getAssetsData(1);
    }
    getAssetsData=(pn,ps) =>{
        axios.get(`${config.api_server}/ops/workorder/assets`,{
            params:{
                pageNum:pn,
                pageSize:ps
            }
        }).then(res =>{
            this.setState({
                data:res.data.page.datas,
                total:res.data.page.totalRecord
            })
        })
    }
    pageChange=(v) =>{
        this.setState({
            pageNum:v
        })
        this.getAssetsData(v,this.state.pageSize)
    }
    sizeChange=(s,v) =>{
        this.setState({
            pageSize:v
        })
        this.getAssetsData(this.state.pageNum,v)
    }
    render(){
        const pagination={
            showSizeChanger:true,
            total:this.state.total,
            onChange:this.pageChange,
            onShowSizeChange:this.sizeChange
        }
        const columns = [{
            title: '编码',
            dataIndex: 'ASSETSCODE',
            width:'12%'
          }, {
            title: '资产名称',
            dataIndex: 'ASSETSNAME',
            width:'19%'
          }, {
            title: '序列号',
            dataIndex: 'SERIALNUMBER',
            width:'5%'
          }, {
            title: '项目名称',
            dataIndex: 'PNAME',
            width:'20%'
          }, {
            title: '品牌名称',
            dataIndex: 'BRANDNAME',
            width:'9%'
          }, {
            title: '产品类型',
            dataIndex: 'TYPENAME',
            width:'10%'
          }, {
            title: '产品型号',
            dataIndex: 'PRODUCTMODEL',
            width:'10%'
          }, {
            title: '剩余数量',
            dataIndex:'ASSETSAMOUNT',
            width:'6%'
          }, {
            title: '单位',
            dataIndex: 'ASSETSUNIT',
            width:'4%'
          }, {
            title: '状态',
            dataIndex: 'STATUSNAME',
            width:'5%'
          }];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows
                })
                this.props.selectRow(selectedRows)
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
        return(
            <LocaleProvider locale={zhCN}>
            <Table size='small' loading={this.state.loading} rowSelection={rowSelection} pagination={pagination} columns={columns} dataSource={this.state.data} scroll={{ y: 380 }}></Table>
            </LocaleProvider>
        )
    }
}

class AssetsFrom extends Component{
    constructor(props){
        super(props)
        this.state={
            selectData:[],
            total:1,
            show:false,
            showTable:false,
            loading:true,
            btnLoading:false,
            userUnitdata:[],
            unitPeople:'',
            unitPeoplePhone:'',
            dowhat:[],
            pageNum:1,
            pageSize:10,
            editingKey:''
        }
        this.columns = [{
            key:'1',
            title: '编码',
            dataIndex: 'ASSETSCODE',
            width:'12%'
          }, {
            key:'2',
            title: '资产名称',
            dataIndex: 'ASSETSNAME',
            width:'14%'
          }, {
            key:'3',
            title: '项目名称',
            dataIndex: 'PNAME',
            width:'15%'
          }, {
            key:'4',
            title: '品牌名称',
            dataIndex: 'BRANDNAME',
            width:'9%'
          }, {
            key:'5',
            title: '产品类型',
            dataIndex: 'TYPENAME',
            width:'10%'
          }, {
            key:'6',
            title: '产品型号',
            dataIndex: 'PRODUCTMODEL',
            width:'9%'
          }, {
            key:'7',
            title: '剩余数量',
            dataIndex:'ASSETSAMOUNT',
            width:'6%',
          },{
            key:'9',
            title: '单位',
            dataIndex: 'ASSETSUNIT',
            width:'4%'
          }, {
            key:'10',
            title: '状态',
            dataIndex: 'STATUSNAME',
            width:'5%'
          },{
            key:'12',
            title: '领取数量',
            dataIndex: 'USENUMBER',
            width:'5%',
            editable:true,
          },{
            key:'11',
            title: '领取',
            width:'10%',
            render: (text, record) => {
                const editable = this.isEditing(record);
                return (
                  <div>
                    {editable ? (
                      <span>
                        <EditableContext.Consumer>
                          {form => (
                            <a
                              href="javascript:;"
                              onClick={() => this.save(form, record.key)}
                              style={{ marginRight: 8 }}
                            >
                              确定
                            </a>
                          )}
                        </EditableContext.Consumer>
                        <Popconfirm
                          title="确定放弃领取吗??"
                          onConfirm={() => this.cancel(record.key)}
                        >
                          <a>取消</a>
                        </Popconfirm>
                      </span>
                    ) : (
                      <a onClick={() => this.edit(record.key)}>领取</a>
                    )}
                  </div>
                );
              },  
          }];
    }
    
    componentWillMount(){
        console.log(this.props.unit)
        this.getUserUnit();
        //this.unitPeople(this.props.unit);
        this.getDoWhat()
    }
    AssetsList=() =>{
        this.setState({
            show:true,
            showTable:false
        })
    }
    getSelectAssets=(selectData) =>{
            this.setState({
                selectData
            })
    }
    getUserUnit = () => {
        axios.get(`${config.api_server}/sys/unit/userunit`).then((json) => {
            let userUnitdata = json.data.data;
            this.setState({userUnitdata});
            userUnitdata.map(item =>{
                if(item.unitId==this.props.unit){
                    this.setState({
                        unitPeople:item.principalname,
                        unitPeoplePhone:item.principalphone
                    })
                }
            })
        })
    }
    getDoWhat=() =>{
        axios.get(`${config.api_server}/assets/common/assetsuse`).then(res =>{
            let dowhat=res.data.page.datas;
            this.setState({dowhat})
        })
    }
    componentDidMount(){
        this.setState({
            loading:false
        })
    }
    ahandleOk=() =>{
        this.setState({
            show:false,
            showTable:true
        })
    }
    handleOk=() =>{
        this.props.form.validateFields((err,values)=>{
            if(!err){
                this.setState({
                    btnLoading:true
                })
                axios.post(`${config.api_server}/ops/workorder/recipients`,{
                    USEUNITID:values.doUnit,
                    USEPEOPLE:values.unitPeople,
                    USEPHONE:values.phone,
                    BORROWER:values.doPeople,
                    ASSETSUSE:values.dowhat,
                    ASSETSINFO:this.state.selectData,
                    APPLYTYPE:'BLC',
                    WORKORDERID:this.props.orderId,
                    NOTEINFO:values.desc
                }).then(res =>{
                    if(res.data.success){
                        message.success('资产领用成功!');
                        this.setState({
                            btnLoading:false,
                            selectData:[]
                        })
                        this.handleCancel()
                        this.props.reloadData();
                    }else{
                        message.error(res.data.message);
                        this.setState({
                            btnLoading:false
                        })
                    }
                })
            }
        })
    }
    ahandleCancel=() =>{
        this.setState({
            show:false,
            showTable:false,
            selectData:[]
        })
    }
    handleCancel = () => {
        this.props.cannel();
    }
    defaultselectedRowKeys=[];
    isEditing = (record) => {
        return record.key === this.state.editingKey;
      };
      edit(key) {
        this.setState({ editingKey: key });
      }
      save(form, key) {
        form.validateFields((error, row) => {
          if (error) {
            return;
          }
          const newData = [...this.state.selectData];
          const index = newData.findIndex(item => key === item.key);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            this.setState({ selectData: newData, editingKey: '' });
          } else {
            newData.push(this.state.selectData);
            this.setState({ selectData: newData, editingKey: '' });
          }
        });
      }
      cancel = () => {
        this.setState({ editingKey: '' });
      };
    render(){
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            // span:20
            },
        };
        const formItemAreaLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 3 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
            // span:20
            },
        };
        const {getFieldDecorator} = this.props.form;
          const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
          };
      
          const columns = this.columns.map((col) => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: this.isEditing(record),
              }),
            };
          });
        return(
            <Modal
            title="资产信息"
            destroyOnClose={true}
            visible={this.props.show}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width='90%'
            footer={[
                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.handleOk}>
                  提交
                </Button>
              ]}
            >
            <Form>
                <Row>
                    <Col span={10}>
                        <FormItem
                        {...formItemLayout}
                        label='经办时间'
                        >
                        {getFieldDecorator('time', {
                                initialValue:moment(new Date()).format('YYYY-MM-DD')
                            })(
                                <Input disabled={true}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                        {...formItemLayout}
                        label='经办人'
                        >
                        {getFieldDecorator('people', {
                                initialValue:JSON.parse(sessionStorage.getItem('user')).userName
                            })(
                                <Input disabled={true}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem
                        {...formItemLayout}
                        label='领用单位'
                        >
                        {getFieldDecorator('doUnit', {
                            rules: [{
                                required: true,
                                message:'请选择领用单位!'
                            }],
                            initialValue:this.props.unit
                            })(
                                <Select placeholder="请选择领用单位..." onChange={this.unitPeople} disabled={true}>
                                    {
                                        this.state.userUnitdata.map((item,index) => {
                                            return <Option key={index} value={item.unitId}>{item.unitName}</Option>
                                        })
                                    }
                               </Select>          
                        )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                        {...formItemLayout}
                        label='领用人'
                        >
                        {getFieldDecorator('doPeople', {
                                    rules: [{
                                        required: true,
                                        message:'请选填写领用人!'
                                    }]
                                })(
                                    <Input />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <FormItem
                        {...formItemLayout}
                        label='单位负责人'
                        >
                        {getFieldDecorator('unitPeople', {
                                initialValue:this.state.unitPeople
                            })(
                                <Input disabled={true}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem
                        {...formItemLayout}
                        label='负责人电话'
                        >
                        {getFieldDecorator('phone', {
                                initialValue:this.state.unitPeoplePhone
                                })(
                                    <Input disabled={true}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <FormItem
                        {...formItemAreaLayout}
                        label='资产用途'
                        >
                        {getFieldDecorator('dowhat', {
                                rules: [{
                                    required: true,
                                    message: '请选择资产用途!',
                                }],
                            })(
                                <Select placeholder="请选择资产用途..." style={{width:'30%'}}>
                                    {
                                        this.state.dowhat.map((item,index) => {
                                            return <Option key={index} value={item.id}>{item.name}</Option>
                                        })
                                    }
                               </Select>   
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <FormItem
                        {...formItemAreaLayout}
                        label='备注'
                        >
                        {getFieldDecorator('desc', {
                                rules: [{
                                    // required: true,
                                    // message: '请选择报障单位',
                                }],
                            // initialValue:this.state.closeData.fromName
                            })(
                                <TextArea style={{height:'80px'}}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span={20}>
                        <FormItem
                        {...formItemAreaLayout}
                        label=''
                        >
                         <Button type="primary" style={{marginLeft:'10%'}} onClick={this.AssetsList}>选择资产</Button>
                        </FormItem>
                </Col>
            </Row>
            <LocaleProvider locale={zhCN}>
            <Table
                size='small'
                components={components}
                dataSource={this.state.selectData}
                columns={columns}
                rowClassName="editable-row"
                style={{display:this.state.showTable?'block':'none'}}
                scroll={{ y: 270 }}
            />
            </LocaleProvider>
            <Modal
             title="资产信息"
             destroyOnClose={true}
             visible={this.state.show}
             onOk={this.ahandleOk}
             onCancel={this.ahandleCancel}
             width='90%'
             footer={[
                 <Button key="back" size="large" onClick={this.ahandleCancel}>取消</Button>,
                 <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.ahandleOk}>
                   提交
                 </Button>
               ]}
            >
            <AssetsList selectRow={this.getSelectAssets} />
            </Modal>
            
            </Modal>
        )
    }
}

const AssetsMsg = Form.create()(AssetsFrom);
export default AssetsMsg;
