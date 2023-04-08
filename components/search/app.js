const template = `
<div class="app-box-main">
	<header-tab :orderType="orderType"/>
	<div>
		<div class="app-box">
			<span class="app-box-name">作品</span>
			<span class="app-total">{{page.total}}</span>
		</div>
		<ul class="krFoBL">
			<li v-for="item in data" key="item.id" class="gpVAva">
				<Item v-bind="item"/>
			</li>
		</ul>
	</div>
	<PageNavigation v-bind="page"/>
</div>
`;

import HeaderTab from "../header/tab.js";
import PageNavigation from "../page/page_navigation.js";
import Item from "./item.js";

const { defineComponent, toRefs, reactive } = Vue;

function parseURL( url ) {
	let urlParams = url.substring( 1 ).split( "&" );
	let result = {};
	for ( let p of urlParams ) {
		const [ key, value ] = p.split( "=" );
		result[key] = value;
	}
	return result;
}

function request( url ) {
	const Http = new XMLHttpRequest();
	Http.open( "GET", url, false );
	Http.send();
	return JSON.parse( Http.responseText );
}

export default defineComponent( {
	name: "App",
	template,
	components: {
		HeaderTab,
		PageNavigation,
		Item
	},
	setup() {
		// 每页60条数据
		const pageSize = 60;
		const { qq, orderType, currentPage } = parseURL( location.search );
		const current = parseInt( currentPage );
		const state = reactive( {
			orderType,
			page: {
				currentPage: current,
				hasPrevious: current > 1,
				hasNext: false,
				pages: 0,
				pageSize,
				total: 0
			},
			data: {}
		} );
		const data = request( `/api/search?qq=${ qq }` );
		console.log( data )
		state.page.total = data.total;
		state.page.pages = Math.ceil( data.total / pageSize );
		state.page.hasNext = current < state.page.pages;
		state.data = data.data;
		console.log( '--------state----------' )
		console.log( state );
		return {
			...toRefs( state )
		}
	}
} );