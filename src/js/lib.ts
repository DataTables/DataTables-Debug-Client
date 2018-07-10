export interface ITestResult {
	table: string;
	level: 'error' | 'warning';
	msg: string;
}

export interface ITest {
	($): ITestResult[];
}

// true if v1 > v2
// false if v1 < v2
// null if v1 === v2
export function versionCompare(v1: string, v2: string): boolean {
	var aThis = v1.split('.');
	var aThat = v2.split('.');
	var iThis, iThat;

	for (var i = 0, iLen = aThat.length; i < iLen; i++) {
		iThis = parseInt(aThis[i], 10) || 0;
		iThat = parseInt(aThat[i], 10) || 0;

		// Parts are the same, keep comparing
		if (iThis === iThat) {
			continue;
		}

		// Parts are different, return immediately
		return iThis > iThat;
	}

	return null;
}

export function scrollingEnabled(settings): boolean {
	if (settings.oScroll.sY || settings.oScroll.sX) {
		return true;
	}

	return false;
}

let tests: { name: string; fn: ITest }[] = [];
export function createTest(name: string, test: ITest) {
	tests.push({
		name,
		fn: test
	});
}

export function getTests() {
	return tests;
}

export default {};
