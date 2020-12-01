import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input,Empty, Form, Carousel, Descriptions, Tag, Modal, notification, Popconfirm, Icon,Switch,Tooltip
} from 'antd'
import {del, get, post,getDataUrl} from "../../utils/ajax";
import './style.css'
import CreateTransferIndex from "./CreateTransferIndex";
import EditTransferModal from "./EditTransferModal";
import SynDataModal from "./SynDataModal";
import EditStickModal from "./EditStickModal";
import {isAuthenticated} from "../../utils/session";
import jwt_decode from "jwt-decode";
import CreateSceneCase from "./CreateSceneCase";

@Form.create()
class Index extends React.Component{
    state = {
        cases: [],
        useCase:{},
        casesLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        assertionContent:{},
        isShowSceneCase:false,
        selectedRowKeys: [],
        transfer: {},
        isAddAndUpdate: false,
        isAdd: false,
        synDataModel: false,
        isShowStickModal: false
    };
    componentDidMount() {
        if (!this.state.isAddAndUpdate){
            this.getCaseExecuteRecord()
        }
    }
    getCaseExecuteRecord = async (pageNum = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        console.log("CaseName==="+JSON.stringify(fields.caseName))
        this.setState({
            casesLoading: true,
        });
        const res = await get('/single/case/queryPage', {
            pageNum: pageNum,
            pageSize: this.state.pagination.pageSize,
            caseName: fields.caseName || ''
        });

        console.log("ExecuteRecord==="+JSON.stringify(res))
        if (res.code !== 0) {
            this.setState({
                casesLoading: false,
            });
            return
        }
        this.setState({
            casesLoading: false,
            cases: res.data.entity,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: pageNum
            }
        })
    };

    executeCase=async(values)=>{
        console.log("运行时的values==="+JSON.stringify(values))
        let cook =isAuthenticated();
        var user = jwt_decode(cook)
        console.log("cook==="+JSON.stringify(cook))
        var email = JSON.stringify(user.sub)

        const interfaceRes = await get('/interface/findByName', {
            interfaceName: values.interfaceName,
        });
        console.log("interfaceRes==="+JSON.stringify(interfaceRes))

        values.method=interfaceRes.data.method
        values.signAttribute=interfaceRes.data.signAttribute
        values.sign=interfaceRes.data.sign
        let valuesArr=[]
        valuesArr.push(values)
        console.log("valuesArr==="+JSON.stringify(valuesArr))
        const res = await post('/single/case/execute', {
            // ...values,
            valuesArr,
            lastExecuteUser:email,
            add:false,
            valid:true
        });
        console.log("res==="+JSON.stringify(res))
        if (res.code === 0) {
            // this.setState({
            //     result: {
            //         success: res.success,
            //         errorCode: res.errorCode,
            //         execute: res.execute,
            //         message: res.message,
            //         lastExecuteTime:res.executeDate,
            //     }
            // }
            // )
            this.transferList();
        }
    }

    /**
     * 解析断言内容
     */
    resolve = (record,type)=>{
        let records=[]
        records.push(record);
        console.log("records==="+records)
        let par
        if(type==="assertionContent"){
        par = records.map((item)=>{return JSON.parse(item).map((item)=>{
            return item.parameter+"/"+item.except+"/"+item.rule})})}

            else if(type==="body"){
            par = records.map((item)=>{return JSON.parse(item).map((item)=>{
                return item.caseDescription+"---"+item.caseData
        })})}
        console.log("par=="+JSON.stringify(par))
        return par
    }
    /**
     * table分页
     */
    onTableChange = async (pageNum) => {
        await this.setState({
            pagination: pageNum
        });
        this.getCaseExecuteRecord(pageNum.current)
    };
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getCaseExecuteRecord()
    };
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getCaseExecuteRecord();
        this.setState({
            selectedRowKeys: []
        });
        message.success('重置成功')
    };
    /**
     * 显示发布信息
     * */
    transferList = ()=>{
       this.setState({
           isAddAndUpdate: false,
           isAdd: false
       });
        this.getCaseExecuteRecord();
    };
    /**
     * 新增发布信息页面
     * */
    pushTransferInfo = () =>{
        this.setState({
            isAddAndUpdate: true,
            isAdd: true
        })
    };

    /***
     * 新增用例集合页面
     */
    handleSceneCase =() => {
        this.setState({
            isShowSceneCase:true
        })
        console.log("isShowSceneCase==="+JSON.stringify(this.state.isShowSceneCase))
    };

    closeCreateSceneCase=()=>{
        this.setState({
            isShowSceneCase:false
        })
    }

    /**
     * 编辑发布信息页面
     * */
    editCaseInfo = (record)=>{
        console.log("record==="+JSON.stringify(record))
        this.setState({
            isAddAndUpdate: true,
            isAdd: false,
            // transfer: record
            useCase:record
        })
    };
    /**
     * 编辑置顶时间
     * */
    editStick = (record) =>{
        this.setState({
            isShowStickModal: true,
            transfer: record
        })
        console.log("isShowStickModal==="+JSON.stringify(this.state.isShowStickModal))
    };
    /**
     * 关闭编辑置顶框
     * */
    closeEditStickModal = () => {
        this.setState({
            isShowStickModal: false
        });
        this.getCaseExecuteRecord()
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await get('/execute/deletes', {
                    recordIds: this.state.selectedRowKeys
                });
                if (res.code === 0) {
                    notification.success({
                        message: '删除成功',
                        description: res.msg,
                    });
                    this.setState({
                        selectedRowKeys: []
                    });
                    this.getCaseExecuteRecord()
                }
            }
        })
    };
    /**
     * 同步数据
     * */
    synData = () =>{
        this.setState({
            synDataModel: true
        })
    };


    /**
     * 关闭修改模态框
     */
    closeSynDataModal = () => {
        this.setState({
            synDataModel: false
        });
        this.setState({
            selectedRowKeys: []
        });
        this.getCaseExecuteRecord()
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await getDataUrl('/execute/delSingleById',{
            recordId: record.id
        });
        console.log("单挑删除的res==="+JSON.stringify(res))
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getCaseExecuteRecord()
        }
    };

    render() {
        const {isAddAndUpdate,isAdd,isShowSceneCase} = this.state;
        const {cases,transfer,casesLoading, pagination,selectedRowKeys,synDataModel,isShowStickModal,useCase} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title: '用例名称',
                dataIndex: 'caseName',
                align: 'center',
            },
            {
                title: '所属项目',
                dataIndex: 'project',
                align: 'center',
            },
            {
                title: '用例描述',
                dataIndex: 'description',
                align: 'center',
                ellipsis: true,
            },
            {
                title: '是否有效',
                dataIndex: 'valid',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="有效" unCheckedChildren="无效" checked={record.valid}  />
                )
            },
            {
                title: '执行结果',
                dataIndex: 'caseExecuteResult',
                align: 'center'
            },
            {
                title: '上一次执行时间',
                dataIndex: 'lastExecuteTime',
                align: 'center'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '25%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.editCaseInfo(record)}>编辑</Button>
                        &emsp;
                        <Button type="primary" onClick={() => this.executeCase(record)}>运行</Button>
                        &emsp;
                        <Button type="default" onClick={() => this.editStick(record)}>用例详情</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前数据吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };
        return isAddAndUpdate ?
            isAdd ?
                <CreateTransferIndex transferList = {this.transferList}/>
                :
                <EditTransferModal transferList ={this.transferList} useCase={useCase}/>
                :
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="综合搜索">
                                {getFieldDecorator('caseName')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="综合搜索"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item style={{ marginRight: 0, width: '100%'}} wrapperCol={{ span: 24 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    <Button icon="reload" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Form>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={this.pushTransferInfo}>新增用例</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>&emsp;
                        <Button type='default' icon='copy' disabled={!selectedRowKeys.length} onClick={this.synData}>同步数据</Button>&emsp;
                        <Button type="primary" icon='export' onClick={this.handleSceneCase}>新增场景</Button>
                    </div>
                    <Table
                        rowKey='id'
                        bordered
                        expandedRowRender={record =>
                            <div >
                                <Descriptions
                                    bordered
                                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                >
                                    <Descriptions.Item label="关联接口">
                                        <div className={"ellipsis"}>
                                            <Tooltip placement="topLeft" title={record.interfaceName} color={'#f50'}>
                                        <Tag color="cyan">{record.interfaceName !=null? record.interfaceName:'用例关联接口'}
                                        </Tag>
                                            </Tooltip>
                                        </div>
                                    </Descriptions.Item>
                                    <Descriptions label="测试数据" >
                                        <div className={"ellipsis"}>
                                            <Tooltip placement="topLeft" title={this.resolve(record.body,"body")} color={'#f50'}>
                                            {this.resolve(record.body,"body")}
                                            </Tooltip>
                                        </div>
                                        </Descriptions>
                                    {/*<Descriptions.Item label="发布人头像">*/}
                                        {/*{*/}
                                            {/*record.avatar?*/}
                                                {/*<img style={{height:'50px',width:'50px'}} src={record.response} alt={''}/>*/}
                                                {/*:*/}
                                                {/*<Tag color="cyan">平台发布</Tag>*/}
                                        {/*}*/}
                                    {/*</Descriptions.Item>*/}
                                    <Descriptions label="接口返回实际结果" >
                                        <div className={"ellipsis"} >
                                            <Tooltip placement="topLeft" title={record.response} color={'#f50'}>
                                            {record.response}
                                            </Tooltip>
                                        </div>
                                        </Descriptions>
                                    <Descriptions.Item label="断言内容" >
                                        <div className={"ellipsis"} >
                                            <Tooltip placement="topLeft" title={this.resolve(record.assertionContent,"assertionContent")} color={'#f50'}>
                                            {record.assertionContent !=null ?
                                                this.resolve(record.assertionContent,"assertionContent"):
                                                // record.assertionContent.map((item)=>item.parameter):
                                                '该用例无断言内容'
                                            }
                                            </Tooltip>
                                        </div>
                                        </Descriptions.Item>
                                    <Descriptions label="用例创建时间">{record.createAt}</Descriptions>
                                    <Descriptions.Item label="上一次执行人">{record.lastExecuteUser}</Descriptions.Item>
                                    {/*<Descriptions.Item label="是否置顶"><Tag color="cyan">{record.isStick ? '已置顶':'未置顶'}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="置顶天数"><Tag color="cyan">{record.isStick ? record.order ? record.order.stickDay:'平台赠送' :'未置顶'}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="置顶到期时间"><Tag color="cyan">{record.isStick ? moment(record.stickEndTime).format('YYYY-MM-DD HH:mm:ss'):'未置顶'}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="是否推广"><Tag color="cyan">{record.isGeneralize ? '已推广':'未推广'}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="推广结束时间"><Tag color="cyan">{record.isGeneralize ? moment(record.generalizeEndTime).format('YYYY-MM-DD HH:mm:ss'):'未推广'}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="是否缴费"><Tag color="cyan">{record.isChargePublish ? '已缴费':'未缴费'}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="联系人"><Tag color="cyan">{record.linkman}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="联系电话"><Tag color="cyan">{record.phone}</Tag></Descriptions.Item>*/}
                                    {/*<Descriptions.Item label="用例创建时间"><Tag color="cyan">{moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</Tag></Descriptions.Item>*/}
                                    <Descriptions.Item label="描述">
                                        <div className={"ellipsis"}>
                                            <Tooltip placement="topLeft" title={record.description} color={'#ff4646'}>
                                        {record.description!=null ? record.description : '该用例无描述内容'}
                                            </Tooltip>
                                        </div>
                                    </Descriptions.Item>
                                    {/*<Descriptions.Item label="断言结果"><Tag color="red">*/}
                                        {/*<div className={"ellipsis"} title={record.assertResult}>*/}
                                            {/*{record.assertResult!=null ? record.assertResult : '无断言'}*/}
                                        {/*</div>*/}
                                    {/*</Tag>*/}
                                    {/*</Descriptions.Item>*/}
                                    <Descriptions.Item label="断言结果">
                                        <div className={"ellipsis"}>
                                            <Tag color="green">
                                                <Tooltip placement="topLeft" title={record.assertResult}
                                                         // color="red"
                                                >
                                            {record.assertResult!=null ? record.assertResult : '无断言'}
                                                </Tooltip>
                                            </Tag>
                                        </div>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        }
                        columns={columns}
                        dataSource={cases}
                        loading={casesLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <CreateSceneCase onClose={this.closeCreateSceneCase} visible={isShowSceneCase}/>
                <EditStickModal onCancel={this.closeEditStickModal} visible={isShowStickModal}  transfer={transfer}/>
                <SynDataModal onCancel={this.closeSynDataModal} visible={synDataModel}  ids={this.state.selectedRowKeys}/>
            </div>
    }
}



export default Index;
