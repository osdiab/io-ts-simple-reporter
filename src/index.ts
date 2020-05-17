import {Reporter} from 'io-ts/lib/Reporter';
import {Errors, ValidationError, ContextEntry, InterfaceType, PartialType, Props} from 'io-ts';
import {fold} from 'fp-ts/lib/Either';

function isInterfaceType(type: { _tag: string } | ContextEntry['type']): type is InterfaceType<Props> {
	return '_tag' in type && type._tag === 'InterfaceType';
}

function isPartialType(type: { _tag: string } | ContextEntry['type']): type is PartialType<Props> {
	return '_tag' in type && type._tag === 'PartialType';
}

function printError(error: ValidationError): string {
	return error.context.reduce((output, ctxValue) => {
		console.log('error', error);
		if (isInterfaceType(ctxValue.type)) {
			return `${output}${ctxValue.key}${ctxValue.key && '.'}`;
		}

		if (isPartialType(ctxValue.type)) {
			return `${output}${ctxValue.key}${ctxValue.key && '.'}`;
		}

		return `${output}${ctxValue.key}: ${error.message ?? 'something was wrong'}`;
	}, '');
}

export function failure(errors: Errors) {
	return errors.map(error => printError(error));
}

export function success() {
	return ['No errors!'];
}

const reporter: Reporter<string[]> = {
	report: fold(failure, success)
};

export default reporter;
