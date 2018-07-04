import React,{Component} from 'react';
import { Form, Button, Table, Input, Row, Col, Select, Upload, Icon, Modal,Switch,message } from 'antd';
import axios from 'axios';
import AssetsMsg from './AssetsMsg'
import config from '../../../../../config';
import './index.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
// const RadioGroup = Radio.Group;
class ProcessWorkOrder extends Component {
    state = {
        previewVisible: false,
        sfAssets:false,
        previewImage: '',
        fileList: [],
        showAssets:"none",
        switchType:1,
        closeData:{},
        assetsData:[],
        selectedRowKeys:'',
        disabled:false,
        loading:false,
        Assetsvisible:false,
        faultPic:[]
    }
    goBack = () => { 
        this.props.changeShowType('list')
    }
    columns = [
        {
            title: '单号',
            dataIndex: 'FILECODE',
        },{
            title: '经办人',
            dataIndex: 'MANAGER',
        },{
            title: '经办时间',
            dataIndex: 'MANAGERTIME',
        },{
            title: '出库类型',
            dataIndex: 'STORAGETYPE',
        },{
            title: '状态',
            dataIndex: 'REVIEWNAME',
        },{
            title: '操作',
            key: 'action',
            render: (text,record) => {
                return(
                    this.props.only==0?<span>
                    <a href="javascript:void 0" onClick={this.deleteAeets.bind(this,record)}>删除</a>
                </span>:null
                )
            }
        }
      ]
      deleteAeets=(record) =>{
          let deleteItem='';
          if(this.state.selectedRowKeys.length>0){
            this.state.selectedRowKeys.map(item =>{
                deleteItem+=item+','
            })
          }else{
             deleteItem=record.PROCESSID
          }
            axios.delete(`${config.api_server}/ops/workorder/removeProcess`,{
                params:{
                    DATAIDS:deleteItem
                }
              }).then(res =>{
                  if(res.data.success){
                      message.success('资产删除成功!');
                      this.getOrderData();
                  }
              })
      }
      onChange = (e) => {
        this.setState({
          value: e.target.value,
        });
      }
      handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (e) => {
        switch(e.target.parentNode.childNodes.length){
            case 1:
            this.setState({
                previewVisible: true,
                imgSrc:e.target.parentNode.parentNode.childNodes[0].currentSrc
            })
            break;
            case 2:
            this.setState({
                previewVisible: true,
                imgSrc:e.target.parentNode.childNodes[0].currentSrc
            })
            break;
        }
    }

    handleChange = ({ fileList }) => this.setState({ fileList })
    showAssetsTable = () => {
        //let showAssets = this.state.showAssets=="none"?"block":"none";
        //this.setState({showAssets})
        this.setState({
            Assetsvisible:true
        })
    }
    onChangeSwitch = (checked) => {
        this.setState({switchType:checked?1:0});
    }
    getOrderData=() =>{
        axios.get(`${config.api_server}/ops/workorder/solveWorkOrderLog/${this.props.rowData}?view=${this.props.orderStatus>5?true:false}`).then(res =>{
            this.setState({
                closeData:res.data.data,
                assetsData:res.data.data.assetsList!=""?JSON.parse(res.data.data.assetsList):[],
                faultPic:res.data.data.faultHandlePicture
            })
            console.log(res.data.data.assetsList)
            if(res.data.data.assetsList!=""){
                this.setState({
                    showAssets:'table'
                })
            }else{
                this.setState({
                    showAssets:'none'
                })
            }
        })
    }
    componentWillMount(){
        this.getOrderData()   
    }
    componentDidMount(){
            if(this.props.orderStatus>5){
                this.setState({
                    disabled:true
                })
            }
    }
    submitFunc=() =>{
        this.props.form.validateFields((err,values) =>{
            if(!err){
                this.setState({
                    loading:true
                })
                let faultPicture=[]
                let pic = this.state.fileList;
                if(pic.length > 0){
                    for(let i = 0;i<pic.length;i++){
                        faultPicture.push(pic[i].response.path);
                    }
                }
                axios.post(`${config.api_server}/ops/workorder/solve`,{
                    id:this.props.rowData,
                    status:this.props.orderStatus,
                    isSolve:this.state.switchType,
                    quality:values.quality,
                    resultsDesc:values.processDesc,
                    solution:values.processSolutionType,
                    faultHandlePicture:faultPicture
                }).then(res =>{
                    if(res.data.success){
                        message.success('工单处理成功!');
                        this.props.changeShowType('list');
                        this.props.refreshData(1);
                        this.setState({
                            loading:false
                        })
                    }else{
                        message.error(res.data.message);
                        this.setState({
                            loading:false
                        })
                    }
                })
            }
        })
    }
    handleCancel =() =>{
        this.setState({
            previewVisible:false,
            Assetsvisible:false
        })
    }
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        const {getFieldDecorator} = this.props.form;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
            );
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
            // span:20
            },
        };
        // const formItemLayoutPeo = {
        //     labelCol: {
        //       xs: { span: 24 },
        //       sm: { span: 4 },
        //     // span:4,
        //     },
        //     wrapperCol: {
        //       xs: { span: 24 },
        //       sm: { span: 7 },
        //     // span:20
        //     },
        // };
        const formItemLayout1 = {
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
        const formItemLayout2 = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            // span:4,
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
            // span:20
            },
        };
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                })
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled:this.props.only==0?false:true,
                name: record.name,
              }),
          };
        return(
            <div className='processWorkOrder'>
                <Form>
                    <FormItem
                        wrapperCol={{ span: 19, offset: 2 }}
                    >
                        <TextArea rows={4} disabled={true} value={this.state.closeData?this.state.closeData.faultDesc:''} />
                    </FormItem>  
                    <FormItem
                        wrapperCol={{ span: 20, offset: 1 }}
                    >
                    <Button type='primary' style={{"marginLeft":"5%"}} onClick={this.showAssetsTable} disabled={this.props.orderStatus=='5'?false:true}>领取资产</Button>
                        <div  className='processWorkOrder_table' style={{"marginLeft":"5%","display":this.state.showAssets}}>
                            <Table title={() => '资产领取信息'} rowKey='PROCESSID' rowSelection={rowSelection} bordered  columns={this.columns} dataSource={this.state.assetsData} pagination={false} style={{width:'100%',"marginTop":"12px"}}/>
                        </div>
                        <AssetsMsg cannel={this.handleCancel} show={this.state.Assetsvisible} reloadData={this.getOrderData} orderId={this.props.rowData} />
                    </FormItem>
                    <Row style={{"marginTop":"12px"}}>
                        <Col span={10} style={{"marginLeft":"6%"}}>
                            <FormItem
                                {...formItemLayout1}
                                label="上级处理人"
                            >
                                {getFieldDecorator('processUpPeople', {
                                    rules: [{
                                        // required: true,
                                        // message: '请选择报障单位',
                                    }],
                                    initialValue:this.state.closeData.fromName
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={10}>
                        <FormItem
                                {...formItemLayout2}
                                label="当前处理人"
                            >
                                {getFieldDecorator('processNowPeople', {
                                    rules: [{
                                        // required: true,
                                        // message: '请填写报障人',
                                    }],
                                    initialValue:JSON.parse(sessionStorage.getItem('user')).userName
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <Row style={{"marginTop":"12px"}}>
                        <Col span={10} style={{"marginLeft":"6%"}}>
                            <FormItem
                                {...formItemLayout1}
                                label="派工时间"
                            >
                                {getFieldDecorator('processUpTime', {
                                    rules: [{
                                        // required: true,
                                        // message: '请选择报障单位',
                                    }],
                                    initialValue:this.state.closeData.dispatchTime
                                })(
                                    <Input disabled={true}/>
                                )}
                            </FormItem>
                            
                        </Col>
                        <Col span={10}>
                        <FormItem
                                {...formItemLayout2}
                                label="解决方式"
                            >
                                {getFieldDecorator('processSolutionType', {
                                    rules: [{
                                        required: true,
                                        message: '请选择解决方式',
                                    }],
                                    initialValue:this.state.closeData.solution
                                })(
                                    <Select placeholder="请选择解决方式..." disabled={this.state.disabled}>
                                        <Option key='1' value="远程解决">远程解决</Option>
                                        <Option key='2' value="现场解决">现场解决</Option>
                                    </Select>
                                )}
                            </FormItem>
                            
                        </Col>
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label='是否解决'
                    >
                        {getFieldDecorator("processSolutionRadio",{
                            rules:[
                                {
                                    required:false,
                                },
                            ],
                        })(
                            <Switch defaultChecked={this.state.closeData.isSolve==0?false:true} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} onChange={this.onChangeSwitch} disabled={this.state.disabled} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='质保期限'
                    >
                        {getFieldDecorator("quality",{
                            rules:[
                                {
                                    required:false,
                                },
                            ],
                            initialValue:`${this.state.closeData.quality}`
                        })(
                            <Select placeholder="请选择解决方式..." disabled={this.state.disabled}>
                                        <Option key='0' value='0'>保内</Option>
                                        <Option key='1' value='1'>保外</Option>
                                        <Option key='2' value='2'>不确定</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='处理描述'
                    >
                        {getFieldDecorator("processDesc",{
                            rules:[
                                {
                                    required:true,
                                    message:'请填写处理描述!'
                                },
                            ],
                            initialValue:this.state.closeData.resultsDesc
                        })(
                            <TextArea rows={4} disabled={this.state.disabled} placeholder='请填写处理描述...'/>
                        )}
                    </FormItem>
                    {/* <FormItem
                        {...formItemLayoutPeo}
                        label='人员流转'
                    >
                        {getFieldDecorator("faultDispPerson",{
                            rules:[{
                                required:true,
                            }]
                        })(
                            <Select placeholder="请选择流转人..." showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                <Option key='1' value="22">22</Option>
                                <Option key='2' value="22qw">22qw</Option>
                                <Option key='3' value="22aa">22aa</Option>
                                <Option key='4' value="22ffew">22ffew</Option>
                            </Select>
                        )}
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label='上传图片'
                    >
                        {getFieldDecorator("faultPicture")(
                            <div className="clearfix">
                                <Upload
                                    action={`${config.api_server}/upload/resource/commonupload`}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    disabled={this.state.disabled}
                                    data={{
                                        type:'workorder'
                                    }}
                                >
                                    {fileList.length >= 3 ? null : uploadButton}
                                </Upload>
                                {
                                this.state.faultPic.length>0?this.state.faultPic.split(',').map((item,key) =>(
                                    <div key={key} className='ant-upload ant-upload-select ant-upload-select-picture-card imgshow' onClick={this.handlePreview}>
                                        <span className='imgmask'>
                                        <img src={config.api_server+item} />
                                        <div className='maskview'><Icon type='eye' style={{fontSize:'22px'}} /></div>
                                        </span>
                                    </div>
                                    )):null
                                }
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                          </div>
                        )}
                        <div>可以上传3张图片，单张小于5M。图片支持的格式有：jpg,bmp,png,gif</div>
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 20, offset: 4 }}
                    >

                        <Button type="primary" loading={this.state.loading} htmlType="submit" onClick={this.submitFunc} style={{display:this.state.disabled?'none':'inline-block'}}>提交</Button>
                        <Button onClick={this.goBack} style={{"marginLeft":"1%"}}>返回</Button>
                    </FormItem>
                </Form>

            </div>
            
        )
    }
}

const processWorkOrder = Form.create()(ProcessWorkOrder);
export default processWorkOrder;

