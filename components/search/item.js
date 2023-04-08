const template = `
<div class="jDiQFZ">
	<div class="hYfnPb">
		<div class="fxGVAF">
			<a class="iUsZyY khjDVZ" :href="'/artworks/'+id">
				<div class="cYUezH">
					<img :src="url" :alt="alt" class="erYaF" style="object-fit: contain; object-position: center center;">
				</div>
				<div class="Sxcoo">
					<div class="liXhix">
						<div class="cIllir">
							<div class="bfWaOT" v-if="xRestrict===1">R-18</div>
						</div>
					</div>
					<div class="hHNegy">
						<div class="kZlOCw">
							<span class="gODLwk">
								<span class="gbNjFx">
									<svg viewBox="0 0 9 10" class="fArvVr">
										<path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10
    C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1
    C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8
    0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z" transform="">
    									</path>
    								</svg>
    							</span>
    						</span>
    						<span>3</span>
    					</div>
    				</div>
    			</div>
    		</a>
    		<div class="eDNlMa">{{id}}</div>
    		<div class="eDNlMk" v-if="aiType===2">AI</div>
    	</div>
	</div>
	<div class="jtpclu">
		<a class="cwshsL" :href="'/artworks/'+id">{{title}}</a>
	</div>
	<div class="jtpclu">
		<div aria-haspopup="true" class="icsUdQ">
			<div class="eMfHJB">
				<a :href="'/users/'+userId">
					<div :title="userName" role="img" class="hMqBzA">
						<img :src="profileImageUrl" width="24" height="24" :alt="userName" style="object-fit: cover; object-position: center top;">
					</div>
				</a>
			</div>
			<a class="kghgsn" :href="'/users/'+userId">{{userName}}</a>
		</div>
	</div>
</div>
`;

const { defineComponent } = Vue;

export default defineComponent( {
	name: "Item",
	template,
	props: {
		id: String,
		// 作品标题
		title: String,
		illustType: Number,
		// 是否R-18（1是，0否）
		xRestrict: Number,
		sl: Number,
		// 缩略图
		url: String,
		description: String,
		tags: Array,
		// 作者的ID
		userId: String,
		// 作者名称
		userName: String,
		// 原始图的宽度
		width: Number,
		// 原始图的高度
		height: Number,
		pageCount: Number,
		alt: String,
		createDate: String,
		updateDate: String,
		aiType: Number,
		profileImageUrl: String
	},
	setup( props ) {
	
	}
} );