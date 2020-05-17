import {Reporter} from 'io-ts/lib/Reporter';
import {ValidationError} from 'io-ts';
import {fold} from 'fp-ts/lib/Either';

function printError(error: ValidationError): string {
	const path = error.context
		.map((c) => c.key)
		.filter((key) => key.length > 0)
		.join('.');

	// The actual error is last in context
	const errorContext = error.context[error.context.length - 1];

	const expectedType = errorContext.type.name;
	return `Expecting ${expectedType}${
		path === '' ? '' : ` at ${path}`
	} but instead got: ${
		error.value === undefined ? 'undefined' : JSON.stringify(error.value)
	}`;
}

export const reporter: Reporter<string[]> = {
	report: fold(
		(errors) => errors.map((error) => printError(error)),
		() => []
	)
};
