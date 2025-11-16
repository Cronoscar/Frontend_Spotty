class ArrayUtils{
	static splitN<T>( arr: T[], size: number ): T[][] {
		return !size || arr.length == 0 ? [] : [ arr.slice(0, size) ].concat( ArrayUtils.splitN( arr.slice(size) , size ) );
	}
}

export default ArrayUtils;