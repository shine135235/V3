import React,{Component} from 'react';
import {Route,Redirect,withRouter} from 'react-router-dom';
import Login from '../login';
import Home from '../home';
import System from '../system';
import Census from '../census';
import UserManager from '../system/userManager';
import RoleManager from '../system/roleManage';
import DataDictionary from '../system/dataDictionary';
import AppUseTeacher from '../system/appManager/appUseTeacher';
import AppUseEngineer from '../system/appManager/appUseEngineer';
import AppCensus from '../system/appManager/appCensus';
import AppIntegrate from '../system/appManager/appIntegrate';
import AppSensitive from '../system/appManager/appSensitive';
import AppMall from '../system/appManager/appMall';
import UpdatePwd from '../system/updatePwd';
import ChildArea from '../system/dataDictionary/childArea';
import Unit from '../system/dataDictionary/unit';
import School from '../system/dataDictionary/school';
import FaultLevel from '../system/dataDictionary/faultLevel';
import OrderTemplate from '../system/dataDictionary/orderTemplate';
import OrderType from '../system/dataDictionary/orderType';
import ProjectAdministration from '../system/dataDictionary/projectAdministration';
import ServerAllClass from '../system/dataDictionary/serverAllClass';
import ServerDetailClass from '../system/dataDictionary/serverDetailClass';
import ProductAllType from '../system/dataDictionary/productAllType';
import ProductDetailType from '../system/dataDictionary/productDetailType';
import FaultAll from '../system/dataDictionary/faultAll';
import FaultDetail from '../system/dataDictionary/faultDetail';
import FaultType from '../system/dataDictionary/faultType';
import Remind from '../system/dataDictionary/remind';
import DictionaryAll from '../system/dataDictionary/dictionaryAll';
import DictionaryDetail from '../system/dataDictionary/dictionaryDetail';
import Operation from "../operation"
import KnowledgeManageMent from "../operation/knowledgeManageMent"
import Sla from "../operation/sla"
import AnnounceManage from "../operation/announceManage";
import PerformanceManage from "../operation/performanceManage";
import ReportManage from "../operation/reportManage";
import TaskManage from "../operation/eventManage/taskManage";
import WatchDutyManage from "../operation/watchDuty/watchDutyManage";
import DutyCalendarManage from "../operation/watchDuty/dutyCalendarManage";
import ComplaintManage from "../operation/eventManage/complaintManage";
import ResearchManage from "../operation/eventManage/researchManage";
import DutyTable from '../operation/dutyManage/dutyTable';
import DutyCalendar from '../operation/dutyManage/dutyCalendar';
import Assets from "../assets";
// import HardWareAssets from "../assets/hardWareAssets"
import HardCount from "../assets/hardWareAssets/hardCount";
// import SpareAssets from "../assets/spareAssets"
import SpareCount from "../assets/spareAssets/spareCount";
import WorkOrder from "../operation/eventManage/workOrder";
import SystemConfiguration from "../system/systemConfiguration";
import LicenseManager from "../system/licenseManager";

const AuthRoute = (props) => {
    const isLogin = sessionStorage.getItem('isLogin') === 'true';
    return isLogin ? <Route {...props} /> :location.href.indexOf('/login')==21?111:<Redirect to={//判断当前地址是否为登录,如果是,拦截redriect
      {
        pathname: '/login',
        state: {
          from: props.location,
        }
      }
    } />;
  };

class SiteRouter extends Component{
    render(){
        return (
                <span className='tmd'>
                {/* 首页 */}
                <AuthRoute exact path='/' component={Home} />
                {/* 登录 */}
                <Route exact path='/login' component={Login} /> 
                {/* 首页 */} 
                <AuthRoute path='/Home' component={Home} />
                {/* 系统 */}
                <AuthRoute path='/System'component={System} />
                {/* 数据统计(暂无法通过目录进入,但可以通过手动输入地址访问) */}
                <AuthRoute path='/Census'component={Census} />
                {/* 系统-用户管理 */}
                <AuthRoute path='/System/UserManager' component={UserManager} />
                <AuthRoute path='/System/RoleManager' component={RoleManager} />
                {/* 系统-数据字典 */}
                <AuthRoute path='/System/DataDictionary' component={DataDictionary} />
                {/* 系统-数据字典-片区管理 */}
                <AuthRoute path='/System/DataDictionary/ChildArea' component={ChildArea} />
                {/* 系统-数据字典-单位管理-服务单位 */}
                <AuthRoute path='/System/DataDictionary/unit' component={Unit} />
                {/* 系统-数据字典-单位管理-学校管理 */}
                <AuthRoute path='/System/DataDictionary/school' component={School} />
                {/* 系统-数据字典-工单管理-工单模版 */}
                <AuthRoute path='/System/DataDictionary/orderTemplate' component={OrderTemplate} />
                {/* 系统-数据字典-工单管理-工单类型 */}
                <AuthRoute path='/System/DataDictionary/orderType' component={OrderType} />
                {/* 系统-数据字典-项目管理 */}
                <AuthRoute path='/System/DataDictionary/projectAdministration' component={ProjectAdministration} />
                {/* 系统-数据字典-SLA管理-服务大类 */}
                <AuthRoute path='/System/DataDictionary/serverAllClass' component={ServerAllClass} />
                {/* 系统-数据字典-SLA管理-服务细类 */}
                <AuthRoute path='/System/DataDictionary/serverDetailClass' component={ServerDetailClass} />
                {/* 系统-数据字典-资产管理-产品类型 */}
                <AuthRoute path='/System/DataDictionary/productAllType' component={ProductAllType} />
                {/* 系统-数据字典-资产管理-产品子类型 */}
                <AuthRoute path='/System/DataDictionary/productDetailType' component={ProductDetailType} />
                {/* 系统-数据字典-故障管理-故障大类 */}
                <AuthRoute path='/System/DataDictionary/faultAll' component={FaultAll} />
                {/* 系统-数据字典-故障管理-故障细类 */}
                <AuthRoute path='/System/DataDictionary/faultDetail' component={FaultDetail} />
                {/* 系统-数据字典-故障管理-故障类型 */}
                <AuthRoute path='/System/DataDictionary/faultType' component={FaultType} />
                 {/* 系统-数据字典-故障管理-故障级别 */}
                <AuthRoute path='/System/DataDictionary/faultLevel' component={FaultLevel} />
                  {/* 系统-数据字典-通用数据字典-字典类型 */}
                <AuthRoute path='/System/DataDictionary/dictionaryAll' component={DictionaryAll} />
                {/* 系统-数据字典-通用数据字典-字典项 */}
                <AuthRoute path='/System/DataDictionary/dictionaryDetail' component={DictionaryDetail} />
                {/* 系统-App管理-装机量统计 */}
                <AuthRoute path='/System/AppCensus' component={AppCensus} />
                {/* 系统-App管理-老师使用情况 */}
                <AuthRoute path='/System/AppUseTeacher' component={AppUseTeacher} />
                {/* 系统-App管理-工程师使用情况 */}
                <AuthRoute path='/System/AppUseEngineer' component={AppUseEngineer} />
                {/* 系统-App管理-积分管理 */}
                <AuthRoute path='/System/AppIntegrate' component={AppIntegrate} />
                {/* 系统-App管理-敏感词管理 */}
                <AuthRoute path='/System/AppSensitive' component={AppSensitive} />
                {/* 系统-App管理-积分商城 */}
                <AuthRoute path='/System/AppMall' component={AppMall} />
                {/* 系统-修改密码 */}
                <AuthRoute path='/System/UpdatePwd' component={UpdatePwd} />
                {/* 提醒管理 */}
                <AuthRoute path='/System/DataDictionary/remind' component={Remind} />
                {/* 运维 */}
                <AuthRoute path='/Operation' component={Operation} />
                {/* 运维-知识库管理 */}
                <AuthRoute path='/Operation/knowledgeManageMent' component={KnowledgeManageMent} />
                {/* license管理 */}
                <AuthRoute path='/System/licenseManager' component={LicenseManager} />
                {/* 系统配置 */}
                <AuthRoute path='/System/systemConfiguration' component={SystemConfiguration} />
                {/* 运维-SLA管理 */}
                <AuthRoute path='/Operation/SLA' component={Sla} />
                {/* 运维-公告管理 */}
                <AuthRoute path='/Operation/AnnounceManageMent' component={AnnounceManage} />
                {/* 运维-绩效管理 */}
                <AuthRoute path='/Operation/PerformanceManageMent' component={PerformanceManage} />
                {/* 运维-报表管理 */}
                <AuthRoute path='/Operation/ReportManageMent' component={ReportManage} />
                {/* 运维-值班表管理*/}
                <AuthRoute path='/Operation/WatchDutyManageMent' component={WatchDutyManage} />
                {/* 运维-值班表管理*/}
                <AuthRoute path='/Operation/DutyCalendarManageMent' component={DutyCalendarManage} />
                {/* 运维-故障管理 */}
                <AuthRoute path='/Operation/WorkOrder' component={WorkOrder} />
                {/* 运维-任务管理 */}
                <AuthRoute path='/Operation/TaskManagement' component={TaskManage} />
                {/* 运维-投诉管理 */}
                <AuthRoute path='/Operation/ComplaintManagement' component={ComplaintManage} />
                {/* 运维-调研管理 */}
                <AuthRoute path='/Operation/ResearchManagement' component={ResearchManage} />
                {/* 运维-值班表管理 */}
                <AuthRoute path='/Operation/dutyTable' component={DutyTable} />
                {/* 运维-值班日历管理 */}
                <AuthRoute path='/Operation/dutyCalendar' component={DutyCalendar} />
                {/* 资产 */}
                <AuthRoute path='/Assets' component={Assets} />
                {/* 资产-硬件资产管理 */}
                {/* <AuthRoute path='/Assets/HardWareAssets' component={HardWareAssets} /> */}
                 {/* 资产-硬件资产统计*/}
                <AuthRoute path='/Assets/HardCount' component={HardCount} />
                {/* 资产-备品备件管理 */}
                {/* <AuthRoute path='/Assets/SpareAssets' component={SpareAssets} /> */}
                {/* 资产-备品备件统计 */}
                <AuthRoute path='/Assets/SpareCount' component={SpareCount} />
                </span>
        )
    }
}

export default withRouter(SiteRouter)