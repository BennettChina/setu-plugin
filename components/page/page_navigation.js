const template = `
<div class="gCRmsl">
	<nav class="kYtoqc">
		<a aria-disabled="true" class="kKBslM" href="" v-show="hasPrevious">
			<svg viewBox="0 0 10 8" width="16" height="16"><polyline class="_2PQx_mZ _3mXeVRO" stroke-width="2" points="1,2 5,6 9,2" transform="rotate(90 5 4)"></polyline></svg>
		</a>
		<tmeplate v-for="page in showPages">
			<button type="button" disabled="" class="cQdtNS iiDpnk" v-if="page === 2 && currentPage >= 5"><svg viewBox="0 0 24 24" class="fivNSm"><path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"></path></svg></button>
			<button type="button" aria-current="true" class="cQdtNS" v-else-if="page === currentPage"><span>{{page}}</span></button>
			<a class="kHhIF" href="" v-else><span>{{page}}</span></a>
		</tmeplate>
		<a aria-disabled="false" class="kKBslM" href="" v-show="hasNext">
			<svg viewBox="0 0 10 8" width="16" height="16"><polyline class="_2PQx_mZ _3mXeVRO" stroke-width="2" points="1,2 5,6 9,2" transform="rotate(-90 5 4)"></polyline></svg>
		</a>
	</nav>
</div>
`;

const { defineComponent, ref } = Vue;

export default defineComponent( {
	name: "PageNavigation",
	template,
	props: {
		currentPage: Number,
		hasPrevious: Boolean,
		hasNext: Boolean,
		pages: Number,
		pageSize: Number,
		total: Number
	},
	setup( props ) {
		const showPages = ref( [] );
		const currentPage = props.currentPage;
		showPages.value = Array.from( { length: 7 }, ( _, i ) => {
			if ( i < 2 ) return i + 1;
			if ( i === 2 ) return currentPage < 5 ? 3 : ( currentPage + 5 <= props.pages ? currentPage - 1 : props.pages - ( 6 - i ) );
			return currentPage < 5 ? currentPage + i : ( currentPage + 5 <= props.pages ? currentPage + i - 3 : props.pages - ( 6 - i ) );
		} );
		
		return { showPages };
	}
} );