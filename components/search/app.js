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
import request from "../../assets/js/http.js";
import { urlParamsGet } from "../../assets/js/url.js";

const { defineComponent, toRefs, reactive } = Vue;

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
		const { qq, orderType, currentPage } = urlParamsGet( location.href );
		const current = parseInt( currentPage ) || 1;
		const state = reactive( {
			orderType: orderType || "date_d",
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
		const data = request( `/search?qq=${ qq }` );
		state.page.total = data.total;
		state.page.pages = Math.ceil( data.total / pageSize );
		state.page.hasNext = current < state.page.pages;
		state.data = data.data;
		return {
			...toRefs( state )
		}
	}
} );