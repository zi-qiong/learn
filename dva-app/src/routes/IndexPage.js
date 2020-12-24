import React from 'react';
import { connect } from 'dva';
import { Tree, Input, message } from 'antd';
const { TreeNode } = Tree;

class IndexPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			treeData: [
				{
					title: '0-0',
					key: '0-0',
					children: [
						{
							title: '0-0-0',
							key: '0-0-0',
							children: [
								{ title: '0-0-0-0', key: '0-0-0-0' },
								{ title: '0-0-0-1', key: '0-0-0-1' },
								{ title: '0-0-0-2', key: '0-0-0-2' },
							],
						},
						{
							title: '0-0-1',
							key: '0-0-1',
							children: [
								{ title: '0-0-1-0', key: '0-0-1-0' },
								{ title: '0-0-1-1', key: '0-0-1-1' },
								{ title: '0-0-1-2', key: '0-0-1-2' },
							],
						},
						{
							title: '0-0-2',
							key: '0-0-2',
						},
					],
				},
				{
					title: '0-1',
					key: '0-1',
					children: [
						{ title: '0-1-0-0', key: '0-1-0-0' },
						{ title: '0-1-0-1', key: '0-1-0-1' },
						{ title: '0-1-0-2', key: '0-1-0-2' },
					],
				},
				{
					title: '0-2',
					key: '0-2',
				},
			]
		}
		
	}

	componentWillMount() {
		let initData = this.initData(this.state.treeData)
		this.setState({
			treeData: initData
		})
	}

	initData = (data) => {
		return data.map(item => {
			item.defaultValue = item.title
			if(item.children) {
				this.initData(item.children)
			}
			return item
		})
	}

	// 渲染tree子节点
	renderTreeNodes = data => {
		return data.map((item) => {
			if (item.isEditable) {
				item.title = (
					<Input defaultValue={item.defaultValue} onPressEnter={(e) => this.submit(e, item.key)} />
				);
			} else {
				item.title = (
					<div onClick={() => this.edit(item.key)}>{item.defaultValue}</div>
				);
			}
			if (item.children) {
				return (
					<TreeNode title={item.title} key={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode {...item} />;
		});
	}


	edit = key => {
		let treeData = this.state.treeData
		let newData = this.editNode(treeData, key)
		console.log(newData)
		this.setState({
			treeData: newData
		})
	}

	//递归查找编辑节点
	editNode = (data, key) => {
		return data.map(item => {
			item.isEditable = item.key === key ? true : false
			if (item.children) {
				this.editNode(item.children, key)
			}
			return item
		})
	}

	// 保存数据
	submit(e, key) {
		let value = e.target.value
		if (!value) {
			message.info('input框不能为空');
			return
		}
		let treeData = this.state.treeData
		let newData = this.submitNode(treeData, key, value)
		this.setState({
			treeData: newData
		})
	}

	// 递归改变数据
	submitNode = (data, key, value) => {
		return data.map(item => {
			if (item.key === key) {
				item.isEditable = false
				item.defaultValue = value
			}

			if (item.children) {
				this.submitNode(item.children, key, value)
			}
			return item
		})
	}

	render() {
		return (
			<Tree>
				{this.renderTreeNodes(this.state.treeData)}
			</Tree>
		)
	}
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
