import React from "react";
import {del, get} from "../../utils/ajax";
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
import EditBannerModal from "./EditBannerModal";
import CreateBannerModal from "./CreateBannerModal";

class Banners extends React.Component{
    state = {
        projects: [],
        projectsLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        project: {},
        selectedRowKeys: [],
        isShowCreateModal: false
    };

    componentDidMount() {
        this.getProjects()
    }
    getProjects = async (page = 1) => {
        const { pagination } = this.state;
        this.setState({
            usersLoading: true,
        });
        const res = await get('/project/queryProject', {
            page: page,
            pageSize: this.state.pagination.pageSize
        });
        if (res.code !== 0) {
            this.setState({
                usersLoading: false,
            });
            return
        }
        console.log("res.data==="+JSON.stringify(res.data))
        this.setState({
            usersLoading: false,
            projects: res.data.entity,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: page
            }
        })
    };
    /**
     * table分页
     */
    onTableChange = async (page) => {
        await this.setState({
            pagination: page
        });
        this.getProjects(page.current)
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await get('/project/deletes', {
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
                    this.getProjects()
                }
            }
        })
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await get(`/project/delById`,{
            projectId:record.id
        });
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getProjects()
        }
    };


    /**
     * 开关
     * */
    switch = async (record) =>{
        const res = await get('/project/updateValid',{
            projectId: record.id,
            valid: record.valid
        });
        if (res.code === 0) {
            notification.success({
                message: '修改成功',
                description: res.message,
            });
            this.getProjects()
        }
    };
    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getProjects();
    };
    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            project: visible,
        })
    };
    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            project: {}
        });
        this.getProjects()
    };
    render() {
        const { projects, usersLoading, pagination, project, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
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
                title: '项目名称',
                dataIndex: 'projectName',
                align: 'center',
            },
            {
                title: '项目描述',
                dataIndex: 'projectDescription',
                align: 'center',
            },
            {
                title: '项目模块',
                dataIndex: 'projectModule',
                align: 'center',
            },
            {
                title: '测试负责人',
                dataIndex: 'tester',
                align: 'center',
            },
            {
                title: '项目是否启用',
                dataIndex: 'valid',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="启用" unCheckedChildren="废弃" checked={record.valid}  />
                )
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
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
        ];

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };

        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>新增</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    <Table
                    bordered
                    rowKey='id'
                    columns={columns}
                    dataSource={projects}
                    loading={usersLoading}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    onChange={this.onTableChange}
                    />
                </Card>
                <EditBannerModal onCancel={this.closeEditModal} visible={isShowEditModal}  project={project} getProjects={this.getProjects}/>
                <CreateBannerModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }


}

export default Banners;
