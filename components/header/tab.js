const template = `
<div class="laRMNP">
	<div class="hbGpVM">
		<span class="hDldyK" :class="{'tab-color-active': isActiveDateDesc}">按最新排序</span>
		<a class="" href="">
			<span class="lkjHVk" :class="{'tab-color-active': isActiveDate}">按旧排序</span>
		</a>
		<button class="ddAFpR" :class="{'tab-color-active': isActiveHot}">按热门度排序<span class="cvJBhn jSdItB"></span></button>
	</div>
	<button type="button" class="cefXLa">
		<div>
			<span class="iSqHrc">
				<svg viewBox="0 0 10 8" class="kfEgdP">
					<path d="M0 1C0 0.447754 0.447754 0 1 0H9C9.55225 0 10 0.447754 10 1C10 1.55225 9.55225 2 9 2
H1C0.447754 2 0 1.55225 0 1ZM0 4C0 3.44775 0.447754 3 1 3H9C9.55225 3 10 3.44775 10 4
C10 4.55225 9.55225 5 9 5H1C0.447754 5 0 4.55225 0 4ZM1 6C0.447754 6 0 6.44775 0 7
C0 7.55225 0.447754 8 1 8H6C6.55225 8 7 7.55225 7 7C7 6.44775 6.55225 6 6 6H1Z">
					</path>
				</svg>
			</span>
			<span class="eEidvZ">搜索条件</span>
		</div>
	</button>
</div>
`;

const { defineComponent, ref } = Vue;

export default defineComponent( {
	name: "HeaderTab",
	template,
	props: {
		orderType: String
	},
	setup( props ) {
		const isActiveDateDesc = ref( props.orderType === 'date_d' );
		const isActiveDate = ref( props.orderType === 'date' );
		// hot排序值不知道多少（没钱开会员）
		const isActiveHot = ref( props.orderType !== 'date_d' && props.orderType !== 'date' );
		
		return {
			isActiveDateDesc,
			isActiveDate,
			isActiveHot
		}
	}
} );