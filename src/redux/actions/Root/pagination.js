export const set_page = (params,res)=>{
	let { page, perPage } = params
	let totalPages = Math.ceil(res.length / perPage)
	let fdata = []
	let newparams = {}
	if (page !== undefined && perPage !== undefined) {
		let calculatedPage = (page - 1) * perPage
		let calculatedPerPage = page * perPage
	  	if(calculatedPage > res.length){
			totalPages = Math.ceil(res.length / perPage)
			fdata = res.slice(0, perPage)
			newparams['page'] = 0
			newparams['perPage'] = perPage
		}else{
			fdata = res.slice(calculatedPage, calculatedPerPage)
			newparams = params
		}
	}else {
		totalPages = Math.ceil(res.length / 10)
		fdata = res.slice(0, 10)
		newparams = params
	}
	if(fdata.length === 0){
		newparams['page'] = 0
		newparams['perPage'] = 10
		fdata = res.slice(0, 10)
	}
	return {fdata : fdata,totalPages : totalPages,params : newparams}
}