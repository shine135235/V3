import React,{Component} from "react";
// import {Card, Col, Row} from "antd";
import {Card,Modal ,message} from "antd";
import $axios from "axios";
import config from '../../../../config';
// import { url } from "inspector";
// import { wrap } from "module";


const confirm = Modal.confirm;
export default class CardGroups extends Component {
    changeShowPage = (rowId) => {
        this.props.changeShowPage({rowId,pageType:'edit',});
    }
    deleteMallData = (rowId) => {
        let rowIds = rowId.split(",");
        confirm({
            title: '删除商品',
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
        this.delMallData(rowIds);
    }
    delMallData = (idString) => {
        $axios.delete(`${config.api_server}/app/goods`,{
            data:{
                ids:idString
            }
        }).then((json) => {
            if(json.data.success == true){
                this.success();
                this.props.getListData({});
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
    render(){
        const { listData } = this.props;
        let listDataArray = [];
        if(listData.listData !== 0){
            for( let i = 0;i<listData.length;i++){
                let item = listData[i];
                let imgUrl = item.resource;
                if(imgUrl !== null)imgUrl = imgUrl.split(",")[0];
                let title = item.name;
                let topTitle = '';
                let topContent = '';
                if(item.status == false){
                    topTitle = 'appMall_Card_topTitle_unPushed';
                    topContent = '未发布';
                }else if(item.status == true){
                    topTitle = 'appMall_Card_topTitle_pushed';
                    topContent = '已发布';
                }
                listDataArray.push(
                    <Card style={{ width: '20%' }} key={item.id} bodyStyle={{ padding: 0 }}>
                        <div className="appMall_Card_image">
                            <div className={topTitle}>{topContent}</div>
                            <img alt="example" width="100%" src={imgUrl} />
                        </div>
                        <div className="appMall_Card_Bottom">
                            <h3>{title}</h3>
                            <div className="appMall_Card_Btn">
                                <div className="appMall_Card_BtnL" onClick={this.deleteMallData.bind(this,item.id)}>删除</div>
                                <div className="appMall_Card_MiddleLine"></div>
                                <div className="appMall_Card_BtnR" onClick={this.changeShowPage.bind(this,item.id)}>编辑</div>
                            </div>
                        </div>
                    </Card>
                )
            }
        }
        return(
            <div className='appMall_Card_Groups'>
                    {listDataArray}
            </div>
        )
    }
}