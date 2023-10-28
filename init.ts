import { definePlugin } from "@/modules/plugin";
import SetuConfig from "#/setu-plugin/modules/SetuConfig";
import { Renderer } from "@/modules/renderer";
import cfgList from "./commands";
import routers from "./routes";
import { ExportConfig } from "@/modules/config";

export let config: ExportConfig<SetuConfig>;
export let render: Renderer;


export default definePlugin( {
	name: "涩图",
	cfgList,
	repo: {
		owner: "BennettChina",
		repoName: "setu-plugin",
		ref: "v3"
	},
	server: {
		routers
	},
	publicDirs: [ "views", "components", "assets" ],
	async mounted( params ) {
		config = params.configRegister( "setu", SetuConfig.init );
		params.setAlias( config.aliases );
		config.on( "refresh", ( newCfg ) => {
			params.setAlias( newCfg.aliases );
		} )
		render = params.renderRegister( "#app", "views" );
	}
} )