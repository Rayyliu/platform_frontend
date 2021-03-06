import EditableCell from "./EditableCell";
import {Button, Form,Table,Popconfirm,Select} from "antd";
import React from "react";
import { EditableContext } from './CreateContext';
import {createFormField} from "../../utils/util";

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.useCase)
    }
});

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

@form
class EditBodyTabs extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "caseDescription",
                dataIndex: "caseDescription",
                width: "30%",
                type: 'input',
                editable: true
            },
            {
                title: "caseData",
                dataIndex: "caseData",
                type: 'input',
                editable: true
            },
            {
                title: "operation",
                dataIndex: "operation",
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.key)}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null
            }
        ];

        this.state = {
            dataSource: [
                // {
                //     key: "0",
                //     caseDescription: "success",
                //     caseData: "32",
                // },
                // {
                //     key: "1",
                //     caseDescription: "executed",
                //     caseData: "true",
                // }
            ],
            count: 0
        };
    }


    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillMount(){
            this.setState({
                dataSource:this.props.body
            })
        console.log("dataSource==="+this.props.body)
        }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key)
        });
    };

    handleAdd = () => {
        console.log("进入add方法");
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            // name: `Edward King ${count}`,
            caseDescription: '',
            caseData: '',
        };
        console.log("Edit---newData==="+JSON.stringify(newData))
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row
        });
        console.log("newData=="+JSON.stringify(newData))
        this.setState({
            dataSource: newData
        },function () {
            console.log("EditBody-dataSource==="+JSON.stringify(this.state.dataSource))
        });
    };


    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    type: col.type,
                    handleSave: this.handleSave
                })
            };
        });
        return (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{ marginBottom: 16 }}
                >
                    Add a row
                </Button>
                {/*<Button onClick={this.props.bodySubmit}>确认</Button>*/}
                <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}

export default EditBodyTabs;