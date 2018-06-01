## V3

V3版本


/**************   关于模拟数据 *****************/

menu.json 平台一级菜单(顶部导航)
sbumenu.json 平台二级菜单

/data/sjzd/dataClass.json   数据字典分类数据

/data/yhgl/depart.json      用户管理公司及角色分类数据
/data/yhgl/userlist.json    用户数据





已移除的备用路由

{/* 资产管理 */}
<AuthRoute path='/System/DataDictionary/assetsBrand' component={AssetsBrand} />
<AuthRoute path='/System/DataDictionary/assetsState' component={AssetsState} />
<AuthRoute path='/System/DataDictionary/physicalLocation' component={PhysicalLocation} />
<AuthRoute path='/System/DataDictionary/applicationLevel' component={ApplicationLevel} />
<AuthRoute path='/System/DataDictionary/OtherTest' component={OtherTest} />
<AuthRoute path='/System/DataDictionary/ParentArea' component={ParentArea} />
<AuthRoute path='/System/DataDictionary/EventCategory' component={EventCategory} />

{/* 系统-数据指点-工单来源 */}
<AuthRoute path='/System/DataDictionary/orderSource' component={OrderSource} />

{/* 系统-组织机构 */}
<AuthRoute path='/System/Mechanism' component={Mechanism} />
{/* 系统-角色和权限 */}
<AuthRoute path='/System/RoleAndPower' component={RoleAndpower} />








/***  页面遗留问题 ***/

用户管理 用户角色在选择完成后  无法重置
用户管理 左侧公司数据  只能打开一项功能没有加入