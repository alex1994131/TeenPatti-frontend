
import React from "react"
import { ChevronDown, Trash, Edit, Plus } from "react-feather"
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Col, Row, Button } from "reactstrap"

export const selectedStyle = {
	rows: {
	  selectedHighlighStyle: {
		backgroundColor: "rgba(115,103,240,.05)",
		color: "#7367F0 !important",
		boxShadow: "0 0 1px 0 #7367F0 !important",
		"&:hover": {
		transform: "translateY(0px) !important"
		}
	  }
	}
}

export const ActionsComponent = props => {
	return (
	<div className="data-list-action">
		<Edit 
		className="cursor-pointer mr-1"
		size={20}
		onClick={()=>props.rowEdit(props.row)}
		/>
		<Trash
		className="cursor-pointer mr-1"
		size={20}
		onClick={()=>props.rowDelete(props.row.id,props.parsedFilter)}
		/>
	</div>
	)
}
  
export const CustomHeader = props => {
	return (
		<Row className="p-1">
			<Col xs="6" md="3">
			<UncontrolledDropdown className="data-list-rows-dropdown mt-1 d-block mb-1">
				<DropdownToggle color="" className="sort-dropdown">
				<span className="align-middle mx-50">
					{`${props.index[0]&&!props.index[0]>0 ? props.index[0] : 0} - ${props.index[1] ? props.index[1] : 0} of ${props.total}`}
				</span>
				<ChevronDown size={15} />
				</DropdownToggle>
				<DropdownMenu tag="div" right>
				<DropdownItem tag="a" onClick={() => props.handleRowsPerPage(10)}>
					10
				</DropdownItem>
				<DropdownItem tag="a" onClick={() => props.handleRowsPerPage(50)}>
					50
				</DropdownItem>
				<DropdownItem tag="a" onClick={() => props.handleRowsPerPage(100)}>
					100
				</DropdownItem>
				</DropdownMenu>
			</UncontrolledDropdown>
			</Col>
			<Col xs="6" md="9" className="mt-1 text-right d-flex justify-content-end">
			<Button
				className="add-new-btn"
				color="primary"
				onClick={() => props.handleSidebar(true)}
				outline>
				<Plus size={15} />
				<span className="align-middle">Add New</span>
			</Button>
			</Col>
		</Row>
	)
}