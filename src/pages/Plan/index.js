import React from "react";
import {post,tokenGetData, get, getDataUrl} from "../../utils/ajax";
import {
    Table,
    Card,
    Button,
    Icon,
    Modal,
    Popconfirm,
    notification,
    Switch
} from 'antd'
import EditPlanModal from "./EditPlanModal";
import CreatePlanModal from "./CreatePlanModal";
import {Form} from "antd/lib/index";
import {isAuthenticated} from "../../utils/session";

@Form.create()
class Plan extends React.Component{
    state = {
        plans: [],
        plansLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        plan: {},
        selectedRowKeys: [],
        isShowCreateModal: false
    };

    componentDidMount() {
        sessionStorage.setItem("sessionId",this.getSessionId())
        this.getPlans()
    }
    getPlans = async (pageNum = 1) => {
        const fields = this.props.form.getFieldsValue();
        console.log("fields==="+JSON.stringify(fields))
        const { pagination } = this.state;
        this.setState({
            usersLoading: true,
        });

        var jsessionid = sessionStorage.getItem("sessionId")
        console.log("planjsessionid==="+JSON.stringify(jsessionid))

            // const res = await getDataUrl('/plan/queryPage', {
        const res = await tokenGetData('/plan/queryPage', {
            pageNum: pageNum,
            pageSize: this.state.pagination.pageSize,
            planName: fields.planName || '',
            // jsessionid: jsessionid

        });

        console.log("res=="+JSON.stringify(res))
        if (res.code !== 0) {
            this.setState({
                plans: res.data,
            });
            return
        }
        console.log("res.data==="+JSON.stringify(res.data))
        this.setState({
            usersLoading: false,
            plans: res.data,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: pageNum
            }
        })
    };


    //获取sessionId
    getSessionId=()=>{
        let cook =isAuthenticated();
        let sessionId = cook.replace("Bearer ","")
        console.log("sessionId==="+JSON.stringify(sessionId))
        return sessionId;
    }

    /**
     * 执行测试计划
     */
    executePlan=async(record)=>{
        var jsessionid = localStorage.getItem("sessionId")
        console.log("record==="+JSON.stringify(record))
        // record.planContent=JSON.stringify(record.planContent)
        const res = await post('/plan/execute',{
            jsessionid: jsessionid,
            ...record,
        })
    }
    /**
     * table分页
     */
    onTableChange = async (pageNum) => {
        await this.setState({
            pagination: pageNum
        });
        this.getPlans(pageNum.current)
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await get('/plan/deletes', {
                    ids: this.state.selectedRowKeys
                });
                if (res.code === 0) {
                    notification.success({
                        message: '删除成功',
                        description: res.msg,
                    });
                    this.setState({
                        selectedRowKeys: []
                    });
                    this.getPlans()
                }
            }
        })
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await get(`/plan/delById`,{
            planId:record.id
        });
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getPlans()
        }
    };


    /**
     * 开关
     * */
    switch = async (record) =>{
        const res = await get('/plan/updateValid',{
            planId: record.id,
            valid: record.valid
        });
        if (res.code === 0) {
            notification.success({
                message: '修改成功',
                description: res.message,
            });
            this.getPlans()
        }
    };
    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getPlans();
    };
    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            plan: visible,
        })
    };
    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            plan: {}
        });
        this.getPlans()
    };
    render() {
        const { plans, usersLoading, pagination, plan, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '序号',
                key: 'id',
                align: 'center',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * pagination.pageSize + index + 1;
                    if (num < pagination.pageSize) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '计划名称',
                dataIndex: 'planName',
                align: 'center',
            },
            {
                title: '计划描述',
                dataIndex: 'planDescription',
                align: 'center',
            },
            {
                title: '所属项目',
                dataIndex: 'project',
                align: 'center',
            },
            {
                title: '测试环境',
                dataIndex: 'env',
                align: 'center',
            },
            {
                title: '计划内容',
                dataIndex: 'planContent',
                align: 'center',
            },
            {
                title: '最近执行时间',
                dataIndex: 'executeTime',
                align: 'center',
            },
            {
                title: '执行人',
                dataIndex: 'tester',
                align: 'center',
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" icon="play-circle" onClick={() => this.executePlan(record)}>执行计划</Button>
                        &emsp;
                        <Button type="ghost"  icon="edit" onClick={() => this.showEditModal(record)}>编辑</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前项目吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
            {
                title: '结果报告',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" icon="file-protect" onClick={() => this.showEditModal(record)}>查看报告</Button>
                    </div>
                )
            },
        ];

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };

        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>添加测试计划</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    <Table
                    bordered
                    rowKey='id'
                    columns={columns}
                    dataSource={plans}
                    loading={usersLoading}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    onChange={this.onTableChange}
                    />
                </Card>
                <CreatePlanModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
                <EditPlanModal onCancel={this.closeEditModal} visible={isShowEditModal} plan={plan} getPlans={this.getPlans}/>
            </div>
        )
    }

}

export default Plan;
