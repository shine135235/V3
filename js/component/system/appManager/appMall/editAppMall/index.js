import React , {Component} from "react";
import { Form, Input, Icon , Button, InputNumber, Upload, Modal ,Radio,message} from 'antd';
import $axios from "axios";
import config from '../../../../../config';
import './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class EditAppMall extends Component {
    state = {
        confirmDirty: false,
        previewVisibleMain: false,
        previewVisible: false,
        previewImageMain: '',
        previewImage: '',
        fileListMain: [],
        fileList: [],
        id:'',
      };
    handleCancelMain = () => {
        this.setState({ previewVisibleMain: false })
    }
    getMallDetailData = (rowId) => {
        $axios.get(`${config.api_server}/app/goods?id=${rowId}`).then((json) => {
            // eslint-disable-next-line
            console.log(json);
            let result = json.data.data;
            let fileList = [];
            if(result.detailresource !== null){
                let fileListArr = result.detailresource.split(",");
                for(let i = 0;i<fileListArr.length;i++){
                    let obj = {};
                    obj.url = `${config.api_server}/`+fileListArr[i];
                    obj.response = fileListArr[i];
                    obj.uid = i;
                    obj.size = 102400;
                    fileList.push(obj);
                }
            }
            let fileListMain = [];
            if(result.resource !== null){
                let fileListMainArr = result.resource.split(",");
                for(let i = 0;i<fileListMainArr.length;i++){
                    let obj = {};
                    obj.url = `${config.api_server}/`+fileListMainArr[i]; 
                    obj.response = fileListMainArr[i]; 
                    obj.uid = i;
                    obj.size = 102400;
                    fileListMain.push(obj);
                }
            }
            // eslint-disable-next-line
            console.log(fileList);
            // eslint-disable-next-line
            console.log(fileListMain);
            this.setState({fileList});
            this.setState({fileListMain});
            let name = result.name;
            let count = result.count;
            let vcoin = result.vcoin;
            let status = result.status;
            
            // eslint-disable-next-line
            console.log(status.toString(),"status");
            let id = result.id;
            this.setState({
                id,
            });
            this.props.form.setFieldsValue(
                {
                    merchandiseNameEdit:name,
                    merchandiseNumEdit:count,
                    merchandiseCoinEdit:vcoin,
                    merchandiseIsPublishEdit:status.toString(),
                    merchandiseMainPicEdit:result.resource,
                    merchandisePicEdit:result.detailresource,
                }
            )
        })
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log("woshicongnalai",this.props.rowId);
        this.getMallDetailData(this.props.rowId);
    }
    handleCancel = () => {
        this.setState({ previewVisible: false })
    }
    
    handlePreviewMain = (file) => {
        //eslint-disable-next-line
        console.log('file',file);
        this.setState({
            previewImageMain: file.url || file.thumbUrl,
            previewVisibleMain: true,
        });
    }
    
    handlePreview = (file) => {
        //eslint-disable-next-line
        console.log('file',file);
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    
    handleChangeMain = ({ fileList }) => {
        //eslint-disable-next-line
        console.log('fileListMain',fileList);
        fileList = fileList.filter((file) => {
            let fileSize = file.size/1024;
            // if(fileSize <= 200){
            //     this.error("图片过大，请删除重新上传！");
            //     return false;
            // }
        //eslint-disable-next-line
        console.log('filefilefilefilefile',file);
        return fileSize <= 200;
        })
        this.setState({ fileListMain:fileList });
    }
    handleChange = ({ fileList }) => {
        //eslint-disable-next-line
        console.log('fileList',fileList);
        fileList = fileList.filter((file) => {
            let fileSize = file.size/1024;
            // if(fileSize <= 200){
            //     this.error("图片过大，请删除重新上传！");
            //     return false;
            // }
        //eslint-disable-next-line
        console.log('filefilefilefilefile',file);
        return fileSize <= 200;
        })
        this.setState({ fileList });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            
            // eslint-disable-next-line
            console.log(this.state.fileList);
            // eslint-disable-next-line
            console.log(this.state.fileListMain);
            if (err) {
                //eslint-disable-next-line
                console.log('err: ', err);
                return;
            }
            let resource = [];
            let resourcePath = this.state.fileListMain;
            if(resourcePath.length == 0){
                this.props.form.setFields({
                    merchandiseMainPicEdit:{
                        errors:[new Error("请上传商品主图！")],
                    }
                })
                return;
            }else{
                for (let i = 0;i<resourcePath.length;i++){
                    if(resourcePath[i].response !== undefined){
                        resource.push(resourcePath[i].response);
                    }
                }
            }
            resource = resource.join(",");
            let detailresource = [];
            let detailresourcePath = this.state.fileList;
            if(detailresourcePath.length == 0){
                this.props.form.setFields({
                    merchandisePicEdit:{
                        errors:[new Error("请上传商品图！")],
                    }
                })
                return;
            }
            for (let i = 0;i<detailresourcePath.length;i++){
                if(detailresourcePath[i].response !== undefined){
                    detailresource.push(detailresourcePath[i].response);
                }
            }
            detailresource = detailresource.join(",");
            let name = values.merchandiseNameEdit;
            let count = values.merchandiseNumEdit;
            let vcoin = values.merchandiseCoinEdit;
            let status = values.merchandiseIsPublishEdit;
            let id = this.state.id;
            this.editAppMallData({name,count,vcoin,resource,detailresource,status,id});
        });
    }
    editAppMallData = ({name = '',count = '',vcoin = '',resource = '',detailresource = '',status = '',id = ''}) => {
        $axios.put(`${config.api_server}/app/goods`,{
            "id":id,
            "name": name,
            "count":count,
            "vcoin":vcoin,
            "resource":resource,
            "detailresource":detailresource,
            "status":status,
        }).then((json) => {
            if(json.data.success == true){
                this.success('编辑成功');
                setTimeout(() => {
                    this.props.changeShowPage({pageNumber:1})
                    this.props.getListData({});
                },1000);
            }else{
                this.error('编辑失败');
            }
        })
    }
    success = (msg) => {
        message.success(msg);
    };
    error = (msg) => {
        message.error(msg);
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    beforeUploadMain=(file) => {
        //eslint-disable-next-line
        console.log(file);
        let fileSize = file.size/1024;
        
        //eslint-disable-next-line
        console.log(fileSize);
        if(fileSize > 200){
            
        //eslint-disable-next-line
        console.log("超出范围啦");
        this.error("图片过大，请重新上传！");
        return false;
        }
    }
    beforeUpload=(file) => {
        //eslint-disable-next-line
        console.log(file);
        let fileSize = file.size/1024;
        
        //eslint-disable-next-line
        console.log(fileSize);
        if(fileSize > 200){
            
        //eslint-disable-next-line
        console.log("超出范围啦");
        this.error("图片过大，请重新上传！");
        return false;
        }
    }
    goBack = () =>{
        this.props.changeShowPage({pageType:"list"})
    }
    render(){
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
        };
        const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 14,
            offset: 6,
            },
        },
        };
        const { previewVisibleMain,previewVisible, previewImageMain,previewImage, fileListMain, fileList,} = this.state;
        const uploadButtonMain = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className='editAppMall'>
                <div className='editAppMall_Title'>编辑商品</div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                            label="商品名称"
                            hasFeedback
                        >
                        {getFieldDecorator('merchandiseNameEdit', {
                            rules: [ 
                                {
                                    required: true, message: '请输入商品名称!',
                                },
                                {
                                    max:30,message:"超出最大字符长度30！"
                                }
                            ],
                        })(
                            <Input  style={{"width":"40%"}}/>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                        label="商品数量"
                        hasFeedback
                    >
                        {getFieldDecorator('merchandiseNumEdit', {
                            rules: [
                                {
                                    required: true, message: '请填写商品数量!',
                                }
                            ],
                            // initialValue: 1,
                        })(
                            <InputNumber min={1} max={9999999999} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="兑换所需维币"
                        hasFeedback
                    >
                        {getFieldDecorator('merchandiseCoinEdit', {
                            rules: [
                                {
                                    required: true, message: '请填写兑换所需维币数量!',
                                }
                            ],
                            // initialValue: 1200,
                        })(
                            <InputNumber min={1} max={99999999999} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传商品主图'
                    >
                    <div className='clearfix'>
                        {getFieldDecorator('merchandiseMainPicEdit', {
                            rules: [{ required: true, message: '请上传商品主图!'}],
                        })(
                                <Upload
                                    action={`${config.api_server}/upload/resource/goods`}
                                    listType="picture-card"
                                    fileList={fileListMain}
                                    onPreview={this.handlePreviewMain}
                                    onChange={this.handleChangeMain}
                                    beforeUpload={this.beforeUploadMain}
                                >
                                {fileListMain.length >= 4 ? null : uploadButtonMain}
                                </Upload>
                        )}
                        
                        </div>
                        <Modal visible={previewVisibleMain} footer={null} onCancel={this.handleCancelMain}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImageMain} />
                                </Modal>  
                        <div>图片分辨率建议：750*750，图片大小不超过200k</div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传商品图"
                    >
                    <div className="clearfix">
                        {getFieldDecorator('merchandisePicEdit', {
                            rules: [{ required: true, message: '请上传商品图!' }],
                        })(
                                <Upload
                                    action={`${config.api_server}/upload/resource/goods`}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    beforeUpload={this.beforeUpload}
                                >
                                {fileList.length >= 4 ? null : uploadButton}
                                </Upload> 
                        )}
                        </div>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal> 
                        
                        <div>图片分辨率建议：750*450，图片大小不超过200k</div>
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                        label="是否发布"
                    >
                        {getFieldDecorator('merchandiseIsPublishEdit', {
                            rules: [{ required: true, message: '请选择是否发布!' }],
                        })(
                            <RadioGroup>
                                <Radio value="true">发布</Radio>
                                <Radio value="false">暂不发布</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button  onClick = {this.goBack} style={{"marginLeft":"6%"}}>取消</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const editAppMall = Form.create()(EditAppMall);
export default editAppMall;
