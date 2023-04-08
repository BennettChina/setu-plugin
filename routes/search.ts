import express from "express";
import bot from "ROOT";

export default express.Router().get( "/", async ( req, res ) => {
	const qq: number = parseInt( <string>req.query.qq );
	const cache: string = await bot.redis.getString( `search.pixiv.${ qq }` );
	
	res.send( JSON.parse( cache ) );
} );