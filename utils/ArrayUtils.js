class ArrayUtils {
	static splitN(arr, size) {
		return !size || arr.length == 0 ? [] : [ arr.slice(0, size) ].concat( ArrayUtils.splitN( arr.slice(size) , size ) );
	}
}

export default ArrayUtils;
