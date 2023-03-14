/**
 * await实现线程暂定的功能，等同于 sleep
 * @param ms
 */
export async function wait( ms: number ): Promise<void> {
	return new Promise( resolve => setTimeout( resolve, ms ) );
}