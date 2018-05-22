import React , { Component } from "react";
import { Modal , Button , Form, DatePicker ,LocaleProvider} from "antd";
import zhCN from 'antd/lib/locale-provider/zh_CN';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class FilterModal extends Component {
    state = { 
        filterVisible: false,
        filterLoading: false, 
    }
    // static getDerivedStateFromProps(nextProps,prevState){
    //     //eslint-disable-next-line
    //     console.log("nextProps",nextProps);
    //     //eslint-disable-next-line
    //     console.log("prevState",prevState);
    //     if(nextProps.filterVisible === prevState.filterVisible){
    //         return null;
    //     }
    //     return {
    //         filterVisible:true, 
    //     }
    // }
    hideModal = () => {
        // this.props.form.setFields({'range-time-picker':""});
        this.setState({
            filterVisible: false,
        });
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields(
            (err,fieldsValue) => {
                if(err){
                    return;
                }
                this.setState({
                    filterLoading: true,
                });
                const rangeTimeValue = fieldsValue['range-time-picker'];
                const startTime = rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss");
                const endTime = rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss");
       
                Promise.resolve(this.props.getData({startTime:startTime,endTime:endTime}));
                setTimeout(() => {
                    this.props.form.setFields({'range-time-picker':""});
                    this.setState({
                        filterLoading: false,
                        filterVisible: false,
                    });
                },1000);
            }
        );
    }
    
    componentWillUnmount(){
        
    }
    // closeModal = () =>{
    //     //eslint-disable-next-line
    //     console.log("1111111111111");
    //     this.setState({
    //         filterLoading: false,
    //         filterVisible: false,
    //     });
    // }
    showFilterModal = () => {
        this.setState({
            filterVisible:true,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择时间段!' }],
        };
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
      return (
        <div>
            <Button className="appCensusTopBtn_right" onClick={this.showFilterModal}>筛选</Button>
          <Modal
            title="筛选"
            visible={this.state.filterVisible}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            afterClose={this.closeModal}
            footer={[
                <Button key="back" size="large" onClick={this.hideModal}>取消</Button>,
                <Button key="submit" type="primary" htmlType="submit" size="large" loading={this.state.filterLoading} onClick={this.handleOk}>确定</Button>,
              ]}
              
        >
        
        <LocaleProvider locale={zhCN}>
            <FormItem
                {...formItemLayout}
                label="时间段" >
                    {getFieldDecorator('range-time-picker', rangeConfig)(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
            </FormItem>
        </LocaleProvider>
          </Modal>
        </div>
      );
    }
  }

const filterModal = Form.create()(FilterModal);
export default filterModal;
